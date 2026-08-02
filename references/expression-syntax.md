# Expression Syntax

Referenz für Expressions in VertiGIS Workflow. Wie eine Expression als JSON-Objekt kodiert wird
(`code`/`source`/`accessors`/`annotations`), steht in `references/schema.md` Abschnitt 3.

## Table of Contents

- [Expression Syntax](#expression-syntax)
  - [Table of Contents](#table-of-contents)
  - [Expression Prefix](#expression-prefix)
  - [Cross-Activity References](#cross-activity-references)
  - [String Operations](#string-operations)
    - [Verkettung](#verkettung)
    - [String-Methoden](#string-methoden)
    - [Escaping](#escaping)
  - [Conditional Expressions](#conditional-expressions)
  - [Array Operations](#array-operations)
  - [Object Operations](#object-operations)
  - [Date/Time Operations](#datetime-operations)
  - [Regular Expressions](#regular-expressions)
  - [Number Operations](#number-operations)
  - [JSON Operations](#json-operations)
  - [Common Patterns](#common-patterns)
    - [Fallback-Kette](#fallback-kette)
    - [Self-Calling Function (IIFE) für mehrere Array-Schritte in einem](#self-calling-function-iife-für-mehrere-array-schritte-in-einem)
    - [URL bauen](#url-bauen)
    - [Bedingter Zugriff mit Default](#bedingter-zugriff-mit-default)
  - [Debugging Expressions](#debugging-expressions)

---

## Expression Prefix

**Nur relevant, wenn ein Mensch im Workflow Designer tippt.** Dort müssen Expressions mit `=`
beginnen, sonst wird der Text als Literal behandelt, nicht ausgewertet:

```javascript
=$abs1.result * 23        // Expression, wird ausgewertet
23                         // Literal, wird nicht ausgewertet
="Score: " + $abs1.result  // Expression mit Text
```

Ausnahme, ein reines Literal braucht kein `=`:

```javascript
=74   // äquivalent zu:
74
```

**In der JSON-Datei steht kein `=`.** Die Felder `code`/`source` im Expression-Objekt
(`references/schema.md` Abschnitt 3) enthalten den reinen JS-Ausdruck ohne führendes `=`:

```json
"inputs": { "message": { "code": "$abs1.result * 23", "source": "$abs1.result * 23", "accessors": ["$abs1"] } }
```

Alle weiteren Beispiele in dieser Datei zeigen die Designer-Schreibweise mit `=`, weil das die
Form ist, die ein Nutzer sieht/eingibt. Schreibst oder editierst du direkt die JSON-Datei, lass
das `=` weg und trag nur den reinen Ausdruck in `code`/`source` ein.

---

## Cross-Activity References

```javascript
=$abs1.result                          // Output einer Activity
=$abs1.result * 23                     // kombiniert mit weiterem Term
=$form1.state.textBox1.value           // Formularwert (case-sensitive)
=$query1.features[0].attributes.NAME   // verschachtelter Zugriff
```

**Nur Activities, die im Flow zuvor bereits ausgeführt wurden**, haben zum Zeitpunkt der
Auswertung einen Output. Referenzierst du eine Activity, die erst später im Ablauf kommt, noch
gar nicht erreicht wird (anderer Branch), oder in einer anderen, nicht verbundenen Komponente
liegt, ist der Output zur Laufzeit nicht verfügbar. Beim Schreiben oder Prüfen einer Expression
also immer den tatsächlichen Kontrollfluss nachvollziehen (`references/schema.md`), bevor du eine
`$name`-Referenz einsetzt.

Welchen `outputName` eine Activity liefert: `references/activities.md`.

---

## String Operations

### Verkettung

```javascript
=`${$prompt1.result}`                          // Template Literal (bevorzugt)
=`You entered ${$prompt1.result}. Correct?`    // mit Text drumherum
="You entered " + $prompt1.result              // Plus-Operator (nur wenn schon so vorhanden)
```

### String-Methoden

```javascript
=$text1.result.toLowerCase()
=$text1.result.toUpperCase()
=$text1.result.trim()
=$text1.result.substring(0, 100)
=$text1.result.slice(0, 100)
=$text1.result.replace("old", "new")
=$text1.result.split(",")
=$text1.result.includes("keyword")
=$text1.result.startsWith("prefix")
=$text1.result.endsWith("suffix")
=$text1.result.length
```

### Escaping

```javascript
=`He said "hi"`               // Template Literal: Anführungszeichen brauchen kein Escaping
="He said \"hi\""              // Plus-Operator: müssen escaped werden
```

---

## Conditional Expressions

```javascript
=$query1.features.length > 0 ? "Found" : "Not found"       // Ternary
=$form1.state.textBox1.value || "N/A"                       // Logical OR (Default)
=$formEventData1.argument ?? "N/A"                           // Nullish Coalescing (0/"" bleiben erhalten)
=$query1.features?.[0]?.attributes?.STATE_NAME               // Optional Chaining
=$query1.features?.[0]?.attributes?.STATE_NAME ?? "Unknown"  // kombiniert
```

---

## Array Operations

```javascript
=$query1.features.length                                          // Anzahl
=$names1.result.join(", ")                                         // Array zu String
=$query1.features.map(f => f.attributes.NAME)                      // Transformieren
=$query1.features.filter(f => f.attributes.STATUS === "Active")    // Filtern
=$query1.features.find(f => f.attributes.OBJECTID === 5)           // Erstes Match
=$query1.features.some(f => f.attributes.STATUS === "Active")      // Trifft auf eins zu?
=$query1.features.every(f => f.attributes.VALID === true)          // Trifft auf alle zu?
=$values1.result.sort((a, b) => a - b)                              // Sortieren
=$query1.features.slice(0, 5)                                      // Ausschnitt
```

---

## Object Operations

```javascript
=$query1.features[0].attributes.STATE_NAME       // Dot Notation
=$query1.features[0].attributes["Field Name"]    // Bracket Notation (Leerzeichen/Sonderzeichen)
=Object.keys($query1.features[0].attributes)
=Object.values($query1.features[0].attributes)
=Object.entries($query1.features[0].attributes)
```

---

## Date/Time Operations

```javascript
=new Date().toISOString()                              // aktueller Zeitstempel
=Date.now()                                             // Unix-Timestamp (ms)
=new Date($abs1.result).toISOString()                   // String parsen
=new Date($abs1.result * 1000).toISOString()            // Unix-Sekunden zu ISO
=(Date.now() - new Date($abs1.result).getTime()) / (1000 * 60 * 60)  // Alter in Stunden
```

---

## Regular Expressions

```javascript
=/pattern/.test($text1.result)          // Test
=$text1.result.match(/\d+/g)            // alle Treffer
=$text1.result.match(/#\w+/g)?.join(" ") ?? ""   // Treffer zu String
```

Für Regex direkt in einer Activity-Konfiguration (z. B. `Regex Replace`): `references/activities.md`.

---

## Number Operations

```javascript
=$score1.result * 2
=$price1.result + $tax1.result
=Math.round($abs1.result)
=Math.floor($abs1.result)
=Math.ceil($abs1.result)
=Math.min($a1.result, $b1.result)
=Math.max($a1.result, $b1.result)
=Math.abs($diff1.result)
=Math.pow($base1.result, 2)
=Math.sqrt($abs1.result)
=$abs1.result.toFixed(2)
=parseFloat($form1.state.textBox1.value)
=parseInt($form1.state.textBox1.value, 10)
```

---

## JSON Operations

```javascript
=JSON.parse($webRequest1.result.text)
=JSON.stringify($query1.features)
=JSON.stringify($query1.features, null, 2)   // formatiert
```

Nützlich für `Web Request`-Inputs (`form`/`query`) und zum Parsen von `.text`-Outputs.

---

## Common Patterns

### Fallback-Kette

```javascript
=$form1.state.description.value || $form1.state.summary.value || "No description"
```

### Self-Calling Function (IIFE) für mehrere Array-Schritte in einem

```javascript
=(() => {
  const active = $query1.features.filter(f => f.attributes.STATUS === "Active");
  return active.length;
})()
```
Nicht übertreiben: wird es unübersichtlich, lieber auf mehrere Steps mit Activities aufteilen.

### URL bauen

```javascript
=`https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3/query?where=${$textReplace1.result}`
```

### Bedingter Zugriff mit Default

```javascript
=$query1.features?.[0]?.attributes?.NAME ?? "Unknown"
```

---

## Debugging Expressions

| Symptom | Ursache | Fix |
|---|---|---|
| Expression wird als Text angezeigt, nicht ausgewertet | `=` fehlt | `=` voranstellen |
| `undefined` im Ergebnis | falscher/fehlender `outputName` | `references/activities.md` prüfen |
| Funktioniert im Sandbox-Test, nicht im Deployment | Syntax/Property in Zielumgebung nicht unterstützt | Durch eine Activity ersetzen statt einer Rohzugriffs-Expression |
| Fehler mitten in einer Zugriffskette | Zwischenwert fehlt | `?.` einsetzen |
| `0`/`""` wird fälschlich ersetzt | `||` statt `??` | `??` verwenden |
| Wert kommt nicht an, obwohl ID richtig aussieht | Groß-/Kleinschreibung falsch | Expressions sind case-sensitive |

```javascript
// Typprüfung
=typeof $abs1.result === "string"
=Array.isArray($query1.features)
=$abs1.result !== undefined
```