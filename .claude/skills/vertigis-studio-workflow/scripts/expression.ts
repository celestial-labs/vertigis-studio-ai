// VertiGIS-Workflow-Expressions sind NICHT wie n8n:
//   - kein {{ }}-Marker  -> alle bracket/mixed-content-Funktionen aus n8n entfallen
//   - roher JS-Code in den Feldern code/source (siehe references/expression-syntax.md)
//   - der '='-Prefix existiert NUR in der Designer-Eingabe, NIE in der JSON-Datei
// --- Aus n8n portiert (Grenze Designer-Eingabe <-> JSON) --------------------

/** Designer-Form: ein getippter Ausdruck beginnt mit '='. In der JSON-Datei niemals. */
export function isExpression(value: unknown): value is string {
    return typeof value === "string" && value.startsWith("=");
}

/**
 * Designer-Eingabe -> reiner JS fürs code/source-Feld: führendes '=' entfernen.
 * Kein Ausdruck -> unverändert zurück.
 * (Vereinfachte Fassung von n8n's extractExpressionContent ohne {{ }}-Behandlung.)
 */
export function stripExpressionPrefix(value: string): string {
    return isExpression(value) ? value.slice(1) : value;
}

// --- VertiGIS-eigen: accessors + annotations (schema.md §3) -----------------

export interface Annotation {
    index: number;
    count: number;
    kind: "idref";
}

export interface Expression {
    code: string;
    source: string;
    accessors: string[];
    annotations: Annotation[];
}

// Referenz-Token: $name (Step-Ref) oder $$form (Form-Ref). Stoppt an '.', '[' usw.
// Matcht NICHT das Template-Literal '${', da danach kein Buchstabe/_ folgt.
const REF_RE = /\$\$?[A-Za-z_]\w*/g;

/**
 * Alle $name-/$$form-Referenzen aus einer Expression ziehen — in Reihenfolge,
 * mit Duplikaten (eine pro Vorkommen), passend 1:1 zu computeAnnotations.
 * Grenze: erkennt keine Refs, die nur in String-Literalen stehen (z. B. "$5 tax").
 */
export function extractAccessors(source: string): string[] {
    return source.match(REF_RE) ?? [];
}

/**
 * annotations aus dem source ableiten (nie von Hand zählen, schema.md §3):
 * pro $-Vorkommen index (0-basiert), count (Länge inkl. $), kind "idref".
 */
export function computeAnnotations(source: string): Annotation[] {
    const anns: Annotation[] = [];
    for (const m of source.matchAll(REF_RE)) {
        anns.push({ index: m.index, count: m[0].length, kind: "idref" });
    }
    return anns;
}

/**
 * Vollständiges Expression-Objekt (schema.md §3) aus reinem oder Designer-Code bauen.
 * Setzt source = code (Regelfall); accessors/annotations werden abgeleitet.
 */
export function buildExpression(code: string): Expression {
    const clean = stripExpressionPrefix(code);
    return {
        code: clean,
        source: clean,
        accessors: extractAccessors(clean),
        annotations: computeAnnotations(clean),
    };
}

// --- CLI (schema.md §3: nie von Hand zählen — hier ableiten lassen) --------

const HELP = `Expression-Objekt (code/source/accessors/annotations) aus rohem JS-Code bauen.

Usage:
  bun scripts/expression.ts <code>
  node scripts/expression.ts <code>

<code> ist der rohe JS-Ausdruck fürs code/source-Feld (führendes '=' aus der
Designer-Eingabe wird, falls vorhanden, automatisch entfernt).

Beispiel:
  bun scripts/expression.ts '$visibleLayers.length > 0 && $visibleLayers[0] === $map1.id'`;

/** True when this file is the entry point, under either Bun or Node. */
async function isMain(): Promise<boolean> {
    const bunMain = (import.meta as { main?: boolean }).main;
    if (typeof bunMain === "boolean") return bunMain;
    const { pathToFileURL } = await import("node:url");
    return import.meta.url === pathToFileURL(process.argv[1] ?? "").href;
}

if (await isMain()) {
    const args = process.argv.slice(2);
    if (args.length < 1 || args.includes("-h") || args.includes("--help")) {
        console.log(HELP);
        process.exit(args.length < 1 ? 1 : 0);
    }
    console.log(JSON.stringify(buildExpression(args[0]!), null, 2));
}
