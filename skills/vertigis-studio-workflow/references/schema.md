# Schema: Top-Level JSON

Technische Referenz für die Top-Level-Struktur des Workflow-`.json`: Dateiaufbau,
Step/Transition-Form, Expression-Objekt, Block-Splitting, Formular/Event-Verdrahtung.
**Vollständig lesen vor Analyse/Erzeugung.**

Nicht hier: Activity-Auswahl/Inputs/Outputs → `references/activities.md`; Expression-Inhalt
(`code`) → `references/expression-syntax.md`.

## 1. Top-Level-Struktur

```json
{
  "components": [ { "id": 2, "steps": [ ] } ],
  "deploymentConfig": { "supportedApps": { "VSW": true } },
  "designerVersion": "5.51.1+1",
  "forms": [],
  "licenseInfo": {
    "licenseeId": "....",
    "licenseeUrl": "https://<your-host>/vertigisstudio/workflow/service/auth/license"
  },
  "start": { "id": 3 },
  "transitions": []
}
```

- `components` (Array): Bausteine. Hauptkomponente (meist `id:2`) = Kontrollfluss; weitere =
  Subworkflows/Block-Inhalte/Event-Handler.
- `deploymentConfig.supportedApps` (Object): bool pro App. Keys: `VSW`(Web), `EXB`(Experience
  Builder), `GVH`(Geocortex Viewer HTML5), `GWV`(Geocortex Web Viewer), `VSD`(Desktop),
  `VSM`(Mobile), `WAB`(Web AppBuilder).
- `designerVersion` (String): Standard `"5.51.1+1"`.
- `forms` (Array, optional): Formular-Layouts; entfällt ohne Formulare. **Wichtig:** Auswahllisten
  `items` IMMER Dictionary (Key=ID), nie Array: `"items": { "item1": { "label": "…", "value": "…" } }`.
- `licenseInfo` (Object): `licenseeId` (UUID) **oder** `licenseeUrl`.
- `start` (Object): Einstieg; `id` → Step mit `purpose:"start"`.
- `transitions` (Array): globale Verbindungen zwischen Komponenten (Block-Inhalte, Event-Handler).
  Siehe §4, §6.

### Start über Karten-Werkzeug (kein Event-Listening im Workflow)
Keine `gcx:wf:*`-Activity für „Map Tool Click" — und keine erfinden. Bei Start über ein
Karten-Werkzeug (Toolbar-Button mit Draw-Modus Punkt/Linie/Polygon) sammelt die **Host Application**
Klick/Geometrie; der Workflow braucht dafür **keinen** Event-Listener/Formular-Schritt, sondern
bekommt die Geometrie als **workflow input** (siehe Glossar). Also: **nicht** über `Display Form` +
`GeometryPicker` modellieren, um den Trigger-Klick zu simulieren.

Beim Generieren:
- Kein vorgelagerter Step nötig, um den Klick „entgegenzunehmen" — die Geometrie liegt beim Start vor.
- Name/Typ des workflow-inputs hängt von der Host-Konfiguration ab. Exaktes JSON für deklarierte
  Inputs am `start`-Step ist hier **nicht verifiziert** — im Zweifel den im Host-Tool konfigurierten
  Namen referenzieren (z. B. `$geometry`, nicht `$act.result`) und die Annahme offen benennen.
- `Display Form` + `GeometryPicker` ist **korrekt**, wenn der Workflow den Nutzer *während* des
  Ablaufs um (weitere) Geometrie bittet — nur nicht für den ursprünglichen Trigger-Klick.

## 2. Step-Eigenschaften
Jeder Step = Aktion, Startpunkt oder Kontrollstruktur.
- `id` (Integer): eindeutig in Datei.
- `action` (String): Aktivitätsname, z. B. `"gcx:wf:core::CreateValue"`. Fehlt nur bei Start
  (`purpose:"start"`).
- `title` (String): Anzeigename.
- `description` (String, optional).
- `name` (String, optional): Variablenname; Ergebnis wird als `$name` referenziert.
  **Muss dateiweit eindeutig sein** (sonst `$name`-Kollision).
- `position` (String): `"x,y"` (linke obere Ecke). **Zwingend für Import.**
- `purpose` (String, optional): nur am Komponenten-Einstieg, Wert `"start"`.
- `inputs` (Object): Eingabeparameter.
- `transitions` (Array, optional): Folge-Steps.

### Transitions
```json
"transitions": [ { "id": 12, "target": { "id": 162 }, "branch": "true", "position": "90,60 90,110", "sourceConnector": "bottom", "targetConnector": "top" } ]
```
`id` eindeutig; `target.id` Ziel-Step. Optional: `branch` (z. B. If `"true"`/`"false"`),
`position` (`"StartX,Y ZielX,Y"`), `sourceConnector`/`targetConnector`.

## 3. Inputs und Expressions
`inputs` = statische Werte oder JS-Expressions.

Statisch: `"inputs": { "level": "info", "layerId": "temporal" }`

Dynamisch (Expression-Objekt):
```json
"inputs": { "expression": { "code": "$myVar.result === true", "source": "$myVar.result === true", "accessors": ["$myVar"], "annotations": [ { "index": 0, "count": 6, "kind": "idref" } ] } }
```
- `code`: ausgeführter JS. `source`: Originalausdruck (meist = `code`; kann fehlen).
- `accessors`: alle referenzierten Namen mit `$` — Step-Referenzen (`$name`) **und** Form-Referenzen
  (`$$form`). Leer/weglassbar wenn keine Referenz.
- `annotations`: pro Vorkommen eines `$`-Namens ein Eintrag: `index` (0-basiert im `source`-String),
  `count` (Länge inkl. `$`), `kind` (`"idref"` für Step-Referenzen). `$$form` wird ebenfalls annotiert.
- `values` (optional): Kontextwerte, z. B. `{ "id": 5 }` bei `resources.forms[values.id]`.
- **Ableiten, nicht zählen:** `annotations` rein aus `source` + `accessors` berechnen (Offset/Länge
  jedes `$name`-Vorkommens). Niemals von Hand zählen — Fehlerquelle. Stattdessen
  `bun scripts/expression.ts "<code>"` (aus dem Skill-Ordner) ausführen — liefert das fertige
  `{ code, source, accessors, annotations }`-Objekt zum Übernehmen.

Mehrere Variablen (Reihenfolge links→rechts): `source` `$visibleLayers.length > 0 && $visibleLayers[0] === $map1.id`
```json
"accessors": ["$visibleLayers", "$visibleLayers", "$map1"],
"annotations": [
  { "index": 0,  "count": 14, "kind": "idref" },
  { "index": 29, "count": 14, "kind": "idref" },
  { "index": 51, "count": 5,  "kind": "idref" }
]
```
(Korrigiert: `$map1` liegt bei Index 51, nicht 49.)

## 4. Components

A workflow is a set of **components**. Each entry in `components` is one flow graph:
`{ "id", "title"?, "steps": [...] }`. The **main component** contains the step referenced by `start.id`.
Every other component is a **child component** owned by one step (the Designer UI calls it a "subworkflow").

### Activities that own child components
| Activity | `action` | Child components | `branch` |
|---|---|---|---|
| Container | `gcx:wf:core::Container` | 1 | `content` |
| Function | `gcx:wf:core::Subworkflow` | 1 | `content` |
| For Each | `gcx:wf:core:loop:ForEach` | 1 | `loop` |
| Loop | `gcx:wf:core:loop:Loop` | 1 | `loop` |
| Try Catch | `gcx:wf:core::TryCatch` | 2 | `try`, `catch` |
| Display Form | `gcx:wf:forms:form:DisplayForm` | 0..n, one per wired form event | `<eventName>$<elementName>` (→ §5) |

### Wiring
1. The owner step sits flat in its component's `steps`. A step never contains `steps`.
2. Each child component is its own `components` entry with a unique `id` and exactly one start step
   (`purpose: "start"`, `position: "0,0"` — coordinates are per component).
3. Owner and child are linked by a **top-level** `transitions` entry:
   `{ "id", "branch", "source": { "id": <owner step> }, "target": { "id": <child start step> } }`.
   `branch` must match the table exactly, otherwise the runtime never enters the child component.
   Transitions within one component stay in the source step's `transitions` (only `target`).
4. Child components can own further child components (same pattern, any depth).

### Execution
- The owner step runs its child component. When the child has no more transitions, control returns to the
  owner step, which decides what's next: another pass (Loop/ForEach), `catch` (TryCatch), or its own
  outgoing transitions.
- Scope is shared: steps inside see every outer `$name`, and outputs produced inside remain readable after
  the owner step (loops: value of the last pass). Exception: form-event components get their own scope
  (outer names visible inside, not the other way round).
- `Exit` inside any component ends the whole workflow. There is no break/continue.

### Identifiers
- `id` is one namespace across components, steps, transitions and forms. A duplicate is silently
  re-numbered on import, which breaks the transitions pointing to it.
- A step `name` must be unique across the whole file, all components included. On a duplicate the earlier
  step silently loses its name and every `$name` reference to it breaks.

### Per-activity essentials
`<name>` = the `name` of the owner step.
- **For Each**: `$<name>.item`, `$<name>.pass` (0-based), `$<name>.count`, `$<name>.key` (only when
  `items` is an object). **Loop**: `$<name>.pass` only. There is no `index` — a habit from JS
  `array.forEach((item, index) => …)`; the Designer does not flag it and it is `undefined` at runtime.
- **Loop** runs 0 times unless `count` or `exit` is set.
- **Try Catch**: the error is `$<name>.error` inside `catch`. Without a `catch` component the error is
  swallowed silently.
- **Function**: needs input `subworkflow` = expression `$$subworkflow` (otherwise `arguments` is empty
  and `setResult` does nothing). The Function step has no incoming or outgoing transitions; it is called
  by Execute Function (`gcx:wf:core:subworkflow:RunSubworkflow`) with `subworkflowId: "<name>"`.
  Return a value with `$<name>.setResult(value)`; the caller reads `$<executeFunctionName>.result`.

### Editing
Deleting an owner step means deleting its child components (recursively) and their top-level transitions
too — otherwise orphaned components remain in the file.

### Example (main component with For Each + Try Catch)
```json
{
  "components": [
    {
      "id": 2,
      "steps": [
        { "id": 3, "purpose": "start", "title": "Start", "position": "0,0",
          "transitions": [ { "id": 9, "target": { "id": 4 } } ] },
        { "id": 4, "action": "gcx:wf:core:loop:ForEach", "name": "forEach1",
          "title": "For Each", "position": "-30,110",
          "inputs": { "itemType": "number",
            "items": { "code": "[1, 2, 3]", "source": "[1, 2, 3]", "accessors": [], "annotations": [] } },
          "transitions": [ { "id": 21, "target": { "id": 37 } } ] },
        { "id": 37, "action": "gcx:wf:core::TryCatch", "name": "tryCatch1",
          "title": "Try Catch", "position": "-30,300", "inputs": {} }
      ]
    },
    {
      "id": 5, "steps": [
        { "id": 6, "purpose": "start", "title": "For Each", "position": "0,0",
          "transitions": [ { "id": 16, "target": { "id": 15 } } ] },
        { "id": 15, "action": "gcx:wf:core::Log", "title": "Log", "position": "-30,110",
          "inputs": { "message": { "code": "$forEach1.item", "source": "$forEach1.item",
            "accessors": ["$forEach1"], "annotations": [ { "index": 0, "count": 9, "kind": "idref" } ] } } }
      ]
    },
    {
      "id": 38, "steps": [
        { "id": 39, "purpose": "start", "title": "Try", "position": "0,0",
          "transitions": [ { "id": 46, "target": { "id": 45 } } ] },
        { "id": 45, "action": "gcx:wf:core::Throw", "title": "Throw", "position": "-30,110",
          "inputs": { "message": "Fatal Error", "code": { "code": "\"100\"", "source": "\"100\"" } } }
      ]
    },
    {
      "id": 41, "steps": [
        { "id": 42, "purpose": "start", "title": "Catch", "position": "0,0",
          "transitions": [ { "id": 48, "target": { "id": 47 } } ] },
        { "id": 47, "action": "gcx:wf:core::Log", "title": "Log", "position": "-30,110", "inputs": { "message": "Handle Error" } }
      ]
    }
  ],
  "start": { "id": 3 },
  "transitions": [
    { "id": 7,  "branch": "loop",  "source": { "id": 4 },  "target": { "id": 6 } },
    { "id": 40, "branch": "try",   "source": { "id": 37 }, "target": { "id": 39 } },
    { "id": 43, "branch": "catch", "source": { "id": 37 }, "target": { "id": 42 } }
  ]
}
```

## 5. Formulare und Event-Handling
Anzeige per `Display Form` (`gcx:wf:forms:form:DisplayForm`); Layouts im globalen `forms`-Array.

1. **`forms`:** jedes Formular eindeutige `id`. Steuerelemente in `elements` (Key=Element-ID, z. B.
   `"autoComplete1"`), jedes mit `type` (`"AutoComplete"`, `"ButtonBar"`, `"Header"`, …). `items`
   immer Dictionary, nie Array.
2. **Aufruf:** `Display Form` referenziert Formular per Expression auf `resources.forms[values.id]`.
   Werte später `$form1.state.<elementName>.value`.
3. **Element-Events:** globale Transition im top-level `transitions`. `branch` =
   `<eventName>$<elementName>` (z. B. `suggest$autoComplete1`, `changed$autoComplete1`). `source.id`
   = Display-Form-Step, `target.id` = Start-Step (`purpose:"start"`, `title:"Event"`) der
   Event-Handler-Komponente.
4. **Event-Handler-Komponente:** eigene Komponente mit eindeutiger `id` + sprechendem `title` (z. B.
   `"suggest-autoComplete1"`). Eingangs-Step `title:"Event"`. Event-Daten via `Get Form Event Data`
   (`form: $$form`) → Argument in `$formEventData1.argument`. Dynamische Auswahllisten füllen mit
   `Set Form Element Items`.
5. **Pflichtfelder/Validierung:** Formular ist ohne `required` absendbar — das Element selbst muss
   `"required": true` tragen, sonst geht Submit durch (z. B. `GeometryPicker` ohne Wert). Bestätigt
   durch Nutzer-Feedback: nicht-`required` `GeometryPicker` ließ sich ohne Geometrie absenden →
   leerer/undef-Wert im Folgeschritt. Also: bei jedem zwingenden Element `required: true` setzen.
6. **`GeometryPicker`-Wert = `GeometryRef`, keine rohe Geometrie:** `$form1.state.<name>.value`
   liefert `GeometryRef`, keine Esri-Geometrie. Weitergabe an ArcGIS-Activity mit `geometry`-Input
   (z. B. `Buffer Engine Task`, `Query Task`) → Laufzeitfehler *"The type 'GeometryRef' is not valid
   for this input"*. Immer zuerst durch **Cast Geometry** (`gcx:wf:arcgis::CastGeometry`, Input
   `geometry`, Output `result`), dann `$castGeometry1.result` verwenden.

Beispiel (AutoComplete mit `suggest` aus Layer-Abfrage + `changed`-Logging):
```json
{
  "_properties": { "isServerWorkflow": false },
  "components": [
    {
      "id": 2, "steps": [
        { "id": 3, "position": "0,0", "purpose": "start", "title": "Start",
          "transitions": [ { "id": 6, "position": "90,60 90,110", "sourceConnector": "bottom", "target": { "id": 4 } } ] },
        { "id": 4, "action": "gcx:wf:forms:form:DisplayForm", "name": "form1", "title": "Display Form", "position": "-30,110",
          "inputs": { "form": { "accessors": [], "code": "resources.forms[values.id]", "values": { "id": 5 } } } }
      ]
    },
    {
      "id": 7, "title": "suggest-autoComplete1", "steps": [
        { "id": 8, "position": "0,0", "purpose": "start", "title": "Event",
          "transitions": [ { "id": 15, "target": { "id": 10 } } ] },
        { "id": 10, "action": "gcx:wf:forms::GetFormEventData", "name": "formEventData1", "title": "Get Form Event Data", "position": "-30,110",
          "inputs": { "form": { "accessors": ["$$form"], "code": "$$form", "source": "$$form" } },
          "transitions": [ { "id": 16, "target": { "id": 11 } } ] },
        { "id": 11, "action": "gcx:wf:core::TextReplace", "name": "textReplace1", "title": "Text Replace", "position": "-30,270",
          "inputs": { "oldValue": "'", "newValue": "''",
            "text": { "accessors": ["$formEventData1"], "code": "$formEventData1.argument", "source": "$formEventData1.argument" } },
          "transitions": [ { "id": 17, "target": { "id": 12 } } ] },
        { "id": 12, "action": "gcx:wf:arcgis:query:QueryTask", "name": "query1", "title": "Query Layer", "position": "-30,440",
          "inputs": { "outFields": "STATE_NAME,POP2007", "returnGeometry": false,
            "url": "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
            "where": { "accessors": ["$textReplace1"],
              "code": "\"UPPER(STATE_NAME) LIKE UPPER('\" + $textReplace1.result + \"%')\"",
              "source": "`UPPER(STATE_NAME) LIKE UPPER('${$textReplace1.result}%')`" } },
          "transitions": [ { "id": 18, "target": { "id": 13 } } ] },
        { "id": 13, "action": "gcx:wf:forms::GetFormElementItemsFromFeatures", "name": "formElementItems1", "title": "Get Form Element Items From Features", "position": "-30,580",
          "inputs": { "labelFieldName": "STATE_NAME",
            "features": { "accessors": ["$query1"], "code": "$query1.features", "source": "$query1.features" } },
          "transitions": [ { "id": 19, "target": { "id": 14 } } ] },
        { "id": 14, "action": "gcx:wf:forms::SetFormElementItems", "title": "Set Form Element Items", "position": "-30,750",
          "inputs": { "form": { "accessors": ["$$form"], "code": "$$form", "source": "$$form" },
            "items": { "accessors": ["$formElementItems1"], "code": "$formElementItems1.items", "source": "$formElementItems1.items" } } }
      ]
    },
    {
      "id": 20, "title": "change-autoComplete1", "steps": [
        { "id": 21, "position": "0,0", "purpose": "start", "title": "Event",
          "transitions": [ { "id": 25, "sourceConnector": "bottom", "target": { "id": 24 } } ] },
        { "id": 24, "action": "gcx:wf:core::Log", "title": "Log", "position": "-30,110",
          "inputs": { "message": { "accessors": ["$form1"],
            "annotations": [ { "count": 6, "index": 0, "kind": "idref" } ],
            "code": "$form1.state.autoComplete1.value", "source": "$form1.state.autoComplete1.value" } } }
      ]
    }
  ],
  "deploymentConfig": { "supportedApps": { "VSW": true } },
  "designerVersion": "5.51.1+1",
  "forms": [
    {
      "defaults": {},
      "id": 5,
      "elements": {
        "header": { "section": "header", "type": "Header", "title": { "markdown": "Form Title" } },
        "autoComplete1": { "type": "AutoComplete", "enabled": true, "rowIndex": 0, "rowNumber": 0,
          "title": { "markdown": "Auto Complete" }, "prompt": { "markdown": "Start typing a value" } },
        "footer": { "section": "footer", "type": "ButtonBar",
          "items": {
            "0": { "default": true, "index": 0, "validates": true,  "value": "submit", "label": { "markdown": "Submit" } },
            "1": { "index": 1, "validates": false, "value": "cancel", "label": { "markdown": "Cancel" } }
          } }
      }
    }
  ],
  "licenseInfo": { "licenseeId": "6186c77c-832c-031f-68e7-15ddb2c47678" },
  "start": { "id": 3 },
  "transitions": [
    { "id": 9,  "branch": "suggest$autoComplete1", "source": { "id": 4 }, "target": { "id": 8 } },
    { "id": 22, "branch": "changed$autoComplete1", "source": { "id": 4 }, "target": { "id": 21 } }
  ]
}
```

## 6. Positionierung (`position` und Transition-`position`)
Validator prüft nur: jeder Step hat `position` (`"x,y"`-String, linke obere Ecke). Layout pro
Komponente, Wurzel = Step mit `purpose:start`.

**Konstanten** (`GRID`,`V_GAP` code-verifiziert; Rest experience-basiert, siehe §Fehlerliste):

| Konstante | Wert | Bedeutung |
|---|---|---|
| `GRID` | 10 | `Sizes.DEFAULT_GRID` — jedes x/y Vielfaches (`snapToGrid`) |
| `V_GAP` | 50 | `Sizes.DROP_TARGET_OFFSET` — Rang-Abstand (Y) |
| `STEP_W` | 240 | Breite normale Activity (auch `If`, `Display Form`) |
| `STEP_W_PILL` | 180 | Start, Exit |
| `H_PILL` | 60 | Start, Exit |
| `H_IF` | 130 | `If` |
| `H_FORM` | 180 | `Display Form` |
| `H_SHORT` | 90 | sonstige Activity, Description ≤ 40 Z. |
| `H_DEFAULT` | 110 | sonstige, 40–70 Z. (Default bei Unsicherheit) |
| `H_TALL` | 120 | sonstige, 70–100 Z. |
| `BRANCH_GAP` | 40 | Puffer zw. `If` und Branch-Mitte |

`width`/`height` hängen nur von Steptyp/Description-Länge ab, nie von Input-Anzahl.

**Y (Rang):** `y_child = snap(y_parent + height(parent) + V_GAP)`. Merge mehrerer Eltern:
`y = snap(max(y_parents) + height(parent_mit_max_y) + V_GAP)`.

**X (Spine):** Spine = vertikale Mittelachse `c` (Center, nicht linke Kante) eines Zweigs;
`x = snap(c − width/2)`. Gerade Kette: `c` konstant — Breitenwechsel (Pill↔Standard) ändert nur `x`.

**`If`-Branch:** kein Kind bleibt unter dem `If`:
```
offset  = width(If)/2 + BRANCH_GAP + width(child)/2
c_true  = c_if − offset
c_false = c_if + offset
x_child = snap(c_child − width(child)/2)
```
`c_true`/`c_false` = lokale Spine für den Zweig. **Kein Reset** — auch am nächsten `If` kumulativ
relativ zur eigenen, schon versetzten `c`.

**Transitionen:** `position:""` (leer) für alle Transitionen innerhalb einer Komponente — Designer
routet selbst aus Step-Positionen (`routePoints()`/`ObstacleMap`, orthogonal, hindernisvermeidend),
kann also weggelassen werden. Bei `If`: `sourceConnector:"left"`+`targetConnector:"top"` (true),
`sourceConnector:"right"`+`targetConnector:"top"` (false). Cross-Component-Transitionen: meist weder
`position` noch Connectors.

**Determinismus:** Branches immer `true` vor `false`; gleicher Rang → links vor rechts nach `x`;
`snapToGrid` als letzter Schritt auf jedes x/y.

Einordnung: Y-Rang ≈ Layered-Layout (Sugiyama/`dagre`); der kumulative, nie zurückgesetzte
`If`-Versatz ≈ Reingold-Tilford-Baumlayout (Teilbaum erbt Elternversatz).

## 7. Generierungsregeln
- **Gültiges JSON:** nur valides JSON, kein Markdown. Keine Kommentare (`//`, `/* */`) im Ergebnis-JSON
  (nur in dieser Referenz).
- **IDs:** alle `id` (Components, Steps, Transitions) eindeutig, fortlaufende Integer.
- **Positions:** jeder Step braucht realistische X,Y (Vielfaches von 10; Formel §6:
  `y_child = snap(y_parent + height(parent) + V_GAP)`). Sonst Importfehler.
- **Referenzierung:** Quell-Step braucht `name` (eindeutig); in Expressions `$name.<output>`
  (Output-Name je Activity → `references/activities.md`) und `$name` in `accessors` (mit `annotations`,
  am besten auto-berechnet).
- **Vollständigkeit:** pro Komponente ein Start-Step; keine Transition ins Leere (jedes `target.id` existiert).

Activity-Auswahl/Inputs/Outputs → `references/activities.md`; Expression-Inhalt (`code`/`source`) →
`references/expression-syntax.md`.

Setze Nutzer-Anforderungen in passende `gcx:wf:…`-Aktivitäten um und generiere exakt nach diesem Schema.