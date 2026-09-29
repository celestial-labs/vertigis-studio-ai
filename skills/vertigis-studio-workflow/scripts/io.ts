import * as fs from "node:fs";
import * as path from "node:path";
import type { Json, PathKey } from "./json-query.ts"; // todo: use Bun.file

export function readJson(p: string, fallback: Json = null): Json {
    if (!fs.existsSync(p)) return fallback;
    try { return JSON.parse(fs.readFileSync(p, "utf8")); }
    catch { return fallback; }
}

export function writeJson(p: string, obj: Json): void {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}

/** Rekursiv über den JSON-Baum; ersetzt jeden Knoten durch fn(...). Immutabel. */
export function mapTree(
    node: Json,
    fn: (ctx: { key: PathKey | null; value: Json; path: PathKey[] }) => Json,
    path: PathKey[] = [],
    key: PathKey | null = null,
): Json {
    const replaced = fn({ key, value: node, path });
    if (replaced !== node) return replaced;
    if (Array.isArray(node)) return node.map((el, i) => mapTree(el, fn, [...path, i], i));
    if (node && typeof node === "object") {
        const out: { [k: string]: Json } = {};
        for (const [k, v] of Object.entries(node)) out[k] = mapTree(v, fn, [...path, k], k);
        return out;
    }
    return node;
}
