#!/usr/bin/env bun
/**
 * json-query.ts — read (and later edit) VertiGIS Workflow JSON by path.
 *
 * Two query modes, both returning CONCRETE paths so editing can be layered on top:
 *
 *   1. Segment query (structural, JSONPath-lite):
 *        components[*].steps[?id=26].title
 *      Supports: .key   [n]   [*]   [?key=value]   [?key!=value]   [?key]
 *
 *   2. findById (domain-specific): recursively locate every node whose `.id === N`,
 *      regardless of which component/steps/transitions array it lives in. This is the
 *      primitive that actually matters for workflow files.
 *
 * CLI:
 *   bun scripts/json-query.ts <file> <query>          # segment query
 *   bun scripts/json-query.ts <file> --id <n>         # find node(s) by id
 *   bun scripts/json-query.ts <file> <query> --paths  # print concrete paths only
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Json = null | boolean | number | string | Json[] | { [k: string]: Json };
export type PathKey = string | number;

/** A single query hit: the concrete path from root plus the value found there. */
export interface Match {
    path: PathKey[];
    value: Json;
}

// ---------------------------------------------------------------------------
// Query parsing
// ---------------------------------------------------------------------------

type Step =
    | { kind: "key"; name: string }
    | { kind: "index"; index: number }
    | { kind: "wildcard" }
    | { kind: "filter"; key: string; op: "eq" | "neq" | "exists"; value?: Json };

// Matches one token at a time: a (dotted) identifier, or a [...] bracket expression.
const TOKEN = /\.?([A-Za-z_$][\w$]*)|\[(\*|-?\d+|\?[^\]]+)\]/g;

/** Parse a coerced literal for filter comparisons: number, bool, null, or bare/quoted string. */
function parseLiteral(raw: string): Json {
    const t = raw.trim();
    if (t === "true") return true;
    if (t === "false") return false;
    if (t === "null") return null;
    if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
        return t.slice(1, -1);
    }
    return t;
}

export function parseQuery(query: string): Step[] {
    const steps: Step[] = [];
    let lastIndex = 0;
    let m: RegExpExecArray | null;
    TOKEN.lastIndex = 0;

    while ((m = TOKEN.exec(query)) !== null) {
        if (m.index !== lastIndex) {
            throw new Error(`Unerwartetes Zeichen in Query bei Position ${lastIndex}: "${query.slice(lastIndex)}"`);
        }
        lastIndex = TOKEN.lastIndex;

        if (m[1] !== undefined) {
            steps.push({ kind: "key", name: m[1] });
            continue;
        }

        const b = m[2]!;
        if (b === "*") {
            steps.push({ kind: "wildcard" });
        } else if (/^-?\d+$/.test(b)) {
            steps.push({ kind: "index", index: Number(b) });
        } else {
            // filter: ?key=value | ?key!=value | ?key
            const body = b.slice(1);
            const neq = body.indexOf("!=");
            const eq = body.indexOf("=");
            if (neq !== -1) {
                steps.push({ kind: "filter", key: body.slice(0, neq).trim(), op: "neq", value: parseLiteral(body.slice(neq + 2)) });
            } else if (eq !== -1) {
                steps.push({ kind: "filter", key: body.slice(0, eq).trim(), op: "eq", value: parseLiteral(body.slice(eq + 1)) });
            } else {
                steps.push({ kind: "filter", key: body.trim(), op: "exists" });
            }
        }
    }

    if (lastIndex !== query.length) {
        throw new Error(`Query nicht vollständig geparst, Rest: "${query.slice(lastIndex)}"`);
    }
    return steps;
}

// ---------------------------------------------------------------------------
// Query evaluation
// ---------------------------------------------------------------------------

const isObject = (v: unknown): v is { [k: string]: Json } =>
    v !== null && typeof v === "object" && !Array.isArray(v);

function matchesFilter(el: Json, step: Extract<Step, { kind: "filter" }>): boolean {
    if (!isObject(el)) return false;
    const has = Object.prototype.hasOwnProperty.call(el, step.key);
    if (step.op === "exists") return has;
    if (!has) return false;
    const equal = el[step.key] === step.value;
    return step.op === "eq" ? equal : !equal;
}

export function query(root: Json, q: string | Step[]): Match[] {
    const steps = typeof q === "string" ? parseQuery(q) : q;
    let cursors: Match[] = [{ path: [], value: root }];

    for (const step of steps) {
        const next: Match[] = [];
        for (const cur of cursors) {
            const v = cur.value;
            switch (step.kind) {
                case "key":
                    if (isObject(v) && Object.prototype.hasOwnProperty.call(v, step.name)) {
                        next.push({ path: [...cur.path, step.name], value: v[step.name] });
                    }
                    break;
                case "index":
                    if (Array.isArray(v)) {
                        const i = step.index < 0 ? v.length + step.index : step.index;
                        if (i >= 0 && i < v.length) next.push({ path: [...cur.path, i], value: v[i] });
                    }
                    break;
                case "wildcard":
                    if (Array.isArray(v)) {
                        v.forEach((el, i) => next.push({ path: [...cur.path, i], value: el }));
                    } else if (isObject(v)) {
                        for (const k of Object.keys(v)) next.push({ path: [...cur.path, k], value: v[k] });
                    }
                    break;
                case "filter":
                    if (Array.isArray(v)) {
                        v.forEach((el, i) => { if (matchesFilter(el, step)) next.push({ path: [...cur.path, i], value: el }); });
                    } else if (isObject(v)) {
                        for (const k of Object.keys(v)) { if (matchesFilter(v[k], step)) next.push({ path: [...cur.path, k], value: v[k] }); }
                    }
                    break;
            }
        }
        cursors = next;
    }
    return cursors;
}

// ---------------------------------------------------------------------------
// Domain helper: find by id (deep recursive scan)
// ---------------------------------------------------------------------------

/** Every node in the tree whose own `.id === id` (steps, transitions, components, forms, ...). */
export function findById(root: Json, id: number): Match[] {
    const hits: Match[] = [];
    const walk = (v: Json, path: PathKey[]) => {
        if (Array.isArray(v)) {
            v.forEach((el, i) => walk(el, [...path, i]));
        } else if (isObject(v)) {
            if (v.id === id) hits.push({ path, value: v });
            for (const k of Object.keys(v)) walk(v[k], [...path, k]);
        }
    };
    walk(root, []);
    return hits;
}

// ---------------------------------------------------------------------------
// Concrete-path get / set / delete (the editing layer, built on Match.path)
// ---------------------------------------------------------------------------

export function getByPath(root: Json, path: PathKey[]): Json | undefined {
    let cur: Json = root;
    for (const key of path) {
        if (Array.isArray(cur) && typeof key === "number") cur = cur[key];
        else if (isObject(cur) && typeof key === "string") cur = cur[key];
        else return undefined;
    }
    return cur;
}

export function setByPath(root: Json, path: PathKey[], value: Json): void {
    if (path.length === 0) throw new Error("setByPath: leerer Pfad ersetzt die Wurzel nicht");
    const parent = getByPath(root, path.slice(0, -1));
    const last = path[path.length - 1];
    if (Array.isArray(parent) && typeof last === "number") parent[last] = value;
    else if (isObject(parent) && typeof last === "string") parent[last] = value;
    else throw new Error(`setByPath: Elternknoten unter ${JSON.stringify(path)} nicht schreibbar`);
}

export function deleteByPath(root: Json, path: PathKey[]): void {
    if (path.length === 0) throw new Error("deleteByPath: Wurzel kann nicht gelöscht werden");
    const parent = getByPath(root, path.slice(0, -1));
    const last = path[path.length - 1];
    if (Array.isArray(parent) && typeof last === "number") parent.splice(last, 1);
    else if (isObject(parent) && typeof last === "string") delete parent[last];
    else throw new Error(`deleteByPath: Elternknoten unter ${JSON.stringify(path)} nicht bearbeitbar`);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const HELP = `json-query — VertiGIS Workflow JSON abfragen

  bun scripts/json-query.ts <datei> <query>        Segment-Query
  bun scripts/json-query.ts <datei> --id <n>       Knoten per id finden
  bun scripts/json-query.ts <datei> <query> --paths  nur konkrete Pfade

Query-Syntax:  .key   [n]   [*]   [?key=wert]   [?key!=wert]   [?key]
Beispiele:
  'components[*].steps[?id=26]'
  'forms[0].elements[*].type'
  'components[?id=2].steps[*].title'
  --id 26`;

/** Read + parse JSON. Uses Bun.file when running under Bun, else node:fs. */
async function readJson(file: string): Promise<Json> {
    // @ts-ignore - Bun global only exists at runtime under Bun
    if (typeof Bun !== "undefined") return (await Bun.file(file).json()) as Json;
    const { readFileSync } = await import("node:fs");
    return JSON.parse(readFileSync(file, "utf8")) as Json;
}

/** True when this file is the entry point, under either Bun or Node. */
async function isMain(): Promise<boolean> {
    const bunMain = (import.meta as { main?: boolean }).main;
    if (typeof bunMain === "boolean") return bunMain;
    const { pathToFileURL } = await import("node:url");
    return import.meta.url === pathToFileURL(process.argv[1] ?? "").href;
}

if (await isMain()) {
    const args = process.argv.slice(2);
    if (args.length < 2 || args.includes("-h") || args.includes("--help")) {
        console.log(HELP);
        process.exit(args.length < 2 ? 1 : 0);
    }

    const file = args[0]!;
    const pathsOnly = args.includes("--paths");
    const root = await readJson(file);

    let results: Match[];
    const idFlag = args.indexOf("--id");
    if (idFlag !== -1) {
        const id = Number(args[idFlag + 1]);
        if (!Number.isFinite(id)) { console.error("--id braucht eine Zahl"); process.exit(1); }
        results = findById(root, id);
    } else {
        results = query(root, args[1]!);
    }

    if (results.length === 0) {
        console.error("(keine Treffer)");
        process.exit(2);
    }

    for (const r of results) {
        if (pathsOnly) console.log(r.path.join("."));
        else console.log(`${r.path.join(".")}  =  ${JSON.stringify(r.value)}`);
    }
    console.error(`\n${results.length} Treffer`);
}
