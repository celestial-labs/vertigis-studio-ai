# Activities: Action-Referenz

Verifizierter Katalog der gcx:wf:*-Activities aus workflow-ts/runtime/activities (245 Activities gesamt). Korrekten action-String und Input-/Output-Namen hier nachschlagen, statt zu raten. Outputs referenzierbar als $stepName.<output> (z. B. $s.result); Struktur von Step-name/accessors/annotations siehe references/schema.md, Expression-Syntax siehe references/expression-syntax.md.

* bei Inputs = Pflicht. Bei sehr langen Input-Listen (GP/Network Analyst) nur Kern-Inputs gelistet - Rest aus Runtime-Quellcode. Fehlt eine Activity, dem Nutzer sagen, keinen Action-String erfinden.

## Core & Ablaufsteuerung (gcx:wf:core::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Add Item | `gcx:wf:core::AddItem` | collection*, item*, index | - | Fugt Element zu Array hinzu. |
| Add Items | `gcx:wf:core::AddItems` | collection*, itemsToAdd*, index | - | Fugt mehrere Elemente hinzu. |
| Annotation | `gcx:wf:core::Annotation` | - | - | Reiner Kommentar-Schritt. |
| Await Async Activity | `gcx:wf:core::AwaitAsyncActivity` | activityId* | - | Wartet auf asynchrone Activity. |
| Calculate Date | `gcx:wf:core::CalculateDate` | date*, useUtc, offsetAmount, offsetUnits | date, value | Verschiebt Datum um Offset. |
| Cast | `gcx:wf:core::Cast` | type*, input* | result | Castet Wert auf Typ. |
| Clear Items | `gcx:wf:core::ClearItems` | collection* | - | Leert Collection. |
| Container | `gcx:wf:core::Container` | - | - | Gruppiert Aktionen visuell. |
| Convert Bytes To Text | `gcx:wf:core::ConvertBytesToText` | bytes*, encoding | text | Bytes -> Text. |
| Convert Data Table To Feature Set | `gcx:wf:core::ConvertDataTableToFeatureSet` | dataTable* | featureSet | DataTable -> FeatureSet. |
| Convert Text To Bytes | `gcx:wf:core::ConvertTextToBytes` | text*, encoding | bytes | Text -> Bytes. |
| Convert To Json | `gcx:wf:core::ConvertToJson` | object* | json | Objekt -> JSON-Text. |
| Create File | `gcx:wf:core::CreateFile` | content*, name*, contentType | result | Erstellt Datei-Objekt (Browser). |
| Create Value | `gcx:wf:core::CreateValue` | expression | result | Erstellt Variable (meist per Expression). |
| Decode Uri Component | `gcx:wf:core::DecodeUriComponent` | value* | result | URI-dekodiert. |
| Delay | `gcx:wf:core::Delay` | duration* | - | Pausiert (ms). |
| Encode Uri Component | `gcx:wf:core::EncodeUriComponent` | value* | result | URI-kodiert. |
| Evaluate | `gcx:wf:core::Evaluate` | expression* | result | Fuhrt JS-Expression aus. |
| Evaluate Async | `gcx:wf:core::EvaluateAsync` | expression* | result | Fuhrt asynchrone JS-Expression aus. |
| Exit | `gcx:wf:core::Exit` | - | - | Beendet Workflow/Komponente. |
| Format Date | `gcx:wf:core::FormatDate` | date*, format | formatted, iso, local, unix, utc | Formatiert Datum. |
| Get Base64 String From Bytes | `gcx:wf:core::GetBase64StringFromBytes` | bytes* | result | Bytes -> Base64. |
| Get Base64 String From File | `gcx:wf:core::GetBase64StringFromFile` | file* | result | Datei -> Base64. |
| Get Bytes From Base64 String | `gcx:wf:core::GetBytesFromBase64String` | base64* | result | Base64 -> Bytes. |
| Get First Item | `gcx:wf:core::GetFirstItem` | collection*, itemType | item | Erstes Element. |
| Get Item At Index | `gcx:wf:core::GetItemAtIndex` | collection*, index*, itemType | item | Element an Index. |
| Get Last Item | `gcx:wf:core::GetLastItem` | collection*, itemType | item | Letztes Element. |
| Get Log Level | `gcx:wf:core::GetLogLevel` | - | level | Liest Log-Level. |
| Get Text From File | `gcx:wf:core::GetTextFromFile` | file*, encoding | result | Liest Text aus Datei. |
| Get Workflow Inputs | `gcx:wf:core::GetWorkflowInputs` | inputsType | inputs | Liefert Workflow-Eingaben. |
| If | `gcx:wf:core::If` | condition* | result | Verzweigt per branch true/false. |
| Log | `gcx:wf:core::Log` | message*, level | - | Loggt in Konsole (level: info/warn/error). |
| Parse Json | `gcx:wf:core::ParseJson` | json*, resultType | result | JSON-Text -> Objekt. |
| Parse Number | `gcx:wf:core::ParseNumber` | value* | result | String -> Zahl. |
| Parse Url | `gcx:wf:core::ParseUrl` | url* | url, query, queryString, request, fragment | Zerlegt URL in Bestandteile. |
| Placeholder | `gcx:wf:core::Placeholder` | - | - | Platzhalter fur spateren Austausch. |
| Regex Matches | `gcx:wf:core::RegexMatches` | text*, pattern*, ignoreCase, multiline | result | Liefert Regex-Treffer. |
| Regex Replace | `gcx:wf:core::RegexReplace` | text*, pattern*, replacement*, ignoreCase, multiline | result | Ersetzt per Regex. |
| Remove Item | `gcx:wf:core::RemoveItem` | collection*, item* | removed | Entfernt Element aus Array. |
| Run Activity | `gcx:wf:core::RunActivity` | action*, arguments | - | Fuhrt Activity dynamisch per String. |
| Run Workflow | `gcx:wf:core::RunWorkflow` | url*, arguments | result | Fuhrt anderen Workflow aus. |
| Set Log Level | `gcx:wf:core::SetLogLevel` | level* | - | Setzt Log-Level. |
| Set Property | `gcx:wf:core::SetProperty` | object*, propertyName*, propertyValue | - | Setzt Objekteigenschaft. |
| Set Workflow Output | `gcx:wf:core::SetWorkflowOutput` | name*, value* | - | Setzt Ruckgabe an Host. |
| Subworkflow | `gcx:wf:core::Subworkflow` | subworkflow, argumentsType, resultType | arguments, setResult | Definiert eingebetteten Subworkflow. |
| Switch | `gcx:wf:core::Switch` | value* | default, result | Verzweigt nach Wert (branch = Wert). |
| Text Replace | `gcx:wf:core::TextReplace` | text*, oldValue*, newValue*, ignoreCase | result | Ersetzt Suchstring. |
| Throw | `gcx:wf:core::Throw` | code, message, error | - | Lost Laufzeitfehler aus. |
| Try Catch | `gcx:wf:core::TryCatch` | - | trying, caught, error | Fangt Fehler (branch try/catch). |
| For Each | `gcx:wf:core:loop:ForEach` | items*, exit, itemType | count, item, key, looping, pass | Iteriert Collection (item/pass/key). |
| Loop | `gcx:wf:core:loop:Loop` | exit, loop, collection, count, limit | item, looping, pass | Wiederholt bis Limit/exit (pass). |
| Web Request | `gcx:wf:core:request:WebRequest` | url*, method, headers, query, form, blob, json, text, expect, channel, channelName, timeout, ... | blob, channel, elapsed, json, status, ... | HTTP-Anfrage (json/text/status). |
| Run Subworkflow | `gcx:wf:core:subworkflow:RunSubworkflow` | subworkflowId*, arguments | arguments, result | Startet Subworkflow per ID. |

## ArcGIS & Karte (gcx:wf:arcgis::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Add Attachment | `gcx:wf:arcgis::AddAttachment` | url, layer, objectId*, attachment*, attachmentName, gdbVersion, timeout | result | Add Attachment |
| Add Feature Layer | `gcx:wf:arcgis::AddFeatureLayer` | features*, displayName*, fields* | layer | Add Feature Layer |
| Add Features | `gcx:wf:arcgis::AddFeatures` | url, layer, features*, gdbVersion, timeout | results, success | Schreibt neue Features. |
| Add Graphics Layer Features | `gcx:wf:arcgis::AddGraphicsLayerFeatures` | layerId, features*, removeAllFeatures | features | Add Graphics Layer Features |
| Arcade Script | `gcx:wf:arcgis::ArcadeScript` | script*, parameters, profile, spatialReference | result | Arcade Script |
| Area Engine Task | `gcx:wf:arcgis::AreaEngineTask` | geometry*, geodesic, unit | area | Area Engine Task |
| Buffer Engine Task | `gcx:wf:arcgis::BufferEngineTask` | geometry*, distance*, unit, geodesic, union | geometry, results | Puffer (Client). |
| Buffer Service Task | `gcx:wf:arcgis::BufferServiceTask` | url*, geometry*, distance*, unit, bufferSpatialReference, outSpatialReference, geodesic, union | geometry, results | Puffer (Service). |
| Cast Geometry | `gcx:wf:arcgis::CastGeometry` | geometry* | extent, multipoint, point, polygon, polyline | Castet Formular-GeometryRef in Esri-Geometrie (point/polyline/...). |
| Clear Graphics Layer | `gcx:wf:arcgis::ClearGraphicsLayer` | layerId | - | Clear Graphics Layer |
| Clip Engine Task | `gcx:wf:arcgis::ClipEngineTask` | geometry*, extent* | geometry | Clip Engine Task |
| Closest Facility Task | `gcx:wf:arcgis::ClosestFacilityTask` | url*, facilities, incidents, accumulateAttributes, attributeParameterValues, defaultCutoff, defaultTargetFacilityCount, directionsLanguage, directionsLengthUnits, directionsOutputType, directionsStyleName, directionsTimeAttribute, ... | directions, facilities, incidents, messages, pointBarriers, ... | Closest Facility Task |
| Compare Geometries | `gcx:wf:arcgis::CompareGeometries` | geometry1*, geometry2*, operation* | result | Compare Geometries |
| Convert Value To Arc Gis Field Type | `gcx:wf:arcgis::ConvertValueToArcGisFieldType` | value*, type* | result | Convert Value To Arc Gis Field Type |
| Create Feature Set | `gcx:wf:arcgis::CreateFeatureSet` | geometries, features, fields | featureSet | Create Feature Set |
| Create Graphic | `gcx:wf:arcgis::CreateGraphic` | attributes, geometry, symbol | feature | Graphic aus Geometrie/Attributen. |
| Create Point | `gcx:wf:arcgis::CreatePoint` | x*, y*, spatialReference | point | Create Point |
| Cut Engine Task | `gcx:wf:arcgis::CutEngineTask` | geometry*, cutter* | geometry | Cut Engine Task |
| Delete Attachments | `gcx:wf:arcgis::DeleteAttachments` | url, layer, objectId*, attachmentIds*, gdbVersion, timeout | results | Delete Attachments |
| Delete Features | `gcx:wf:arcgis::DeleteFeatures` | url, layer, features*, useGlobalIds, objectIdField, gdbVersion, timeout | results, success | Loscht Features. |
| Densify Engine Task | `gcx:wf:arcgis::DensifyEngineTask` | geometry*, maxSegmentLength, unit | geometry | Densify Engine Task |
| Difference Engine Task | `gcx:wf:arcgis::DifferenceEngineTask` | geometry*, subtractor*, symmetric | geometry, results | Difference Engine Task |
| Distance Engine Task | `gcx:wf:arcgis::DistanceEngineTask` | geometry1*, geometry2*, unit | distance | Distance Engine Task |
| Distance Service Task | `gcx:wf:arcgis::DistanceServiceTask` | url*, geometry1*, geometry2*, unit, geodesic | distance | Distance Service Task |
| Extended Spatial Reference Info Engine Task | `gcx:wf:arcgis::ExtendedSpatialReferenceInfoEngineTask` | spatialReference* | spatialReference | Extended Spatial Reference Info Engine Task |
| Feature Set From Json | `gcx:wf:arcgis::FeatureSetFromJson` | json* | featureSet | Feature Set From Json |
| Flip Engine Task | `gcx:wf:arcgis::FlipEngineTask` | geometry*, orientation, origin | geometry | Flip Engine Task |
| From Geo Coordinate String Service Task | `gcx:wf:arcgis::FromGeoCoordinateStringServiceTask` | url*, strings*, spatialReference, conversionType, conversionMode | coordinates | From Geo Coordinate String Service Task |
| Generalize Engine Task | `gcx:wf:arcgis::GeneralizeEngineTask` | geometry*, maxDeviation, removeDegenerateParts, unit | geometry | Generalize Engine Task |
| Generate Arc Gis Token | `gcx:wf:arcgis::GenerateArcGisToken` | generateTokenUrl*, userName*, password*, ipAddress, referrer, expiration, timeout | expires, token | Generate Arc Gis Token |
| Geocode | `gcx:wf:arcgis::Geocode` | url*, address*, maxLocations, outFields, outSpatialReference, searchExtent, location, distance, timeout | candidate, candidates, spatialReference | Adresse -> Koordinate. |
| Geometry From Json | `gcx:wf:arcgis::GeometryFromJson` | json* | geometry | Geometry From Json |
| Geoprocessing | `gcx:wf:arcgis::Geoprocessing` | url*, arguments*, outSpatialReference, processSpatialReference | messages, results | Geoprocessing |
| Geoprocessing Async | `gcx:wf:arcgis::GeoprocessingAsync` | url*, arguments*, outSpatialReference, processSpatialReference | id, messages, results, status | Geoprocessing Async |
| Get Attribute Value | `gcx:wf:arcgis::GetAttributeValue` | features*, attribute*, index, valueType | feature, value | Get Attribute Value |
| Get Attribute Values | `gcx:wf:arcgis::GetAttributeValues` | features*, attribute*, valueType | value, values | Get Attribute Values |
| Get Centroid | `gcx:wf:arcgis::GetCentroid` | geometry* | centroid | Get Centroid |
| Get Coded Value Domain | `gcx:wf:arcgis::GetCodedValueDomain` | layer, layerInfo, type, field*, url, dynamicLayerDefinition, source, timeout | domain | Get Coded Value Domain |
| Get Current Position | `gcx:wf:arcgis::GetCurrentPosition` | enableHighAccuracy, maximumAge, timeout, useMultipleReadings, accuracyThreshold | accuracy, altitude, altitudeAccuracy, averageAccuracy, averageAltitudeAccuracy, ... | Get Current Position |
| Get Feature Geometries | `gcx:wf:arcgis::GetFeatureGeometries` | features*, union | geometries, geometry | Get Feature Geometries |
| Get Feature Geometry | `gcx:wf:arcgis::GetFeatureGeometry` | features*, index | geometry | Get Feature Geometry |
| Get Feature Layer Info | `gcx:wf:arcgis::GetFeatureLayerInfo` | url*, dynamicLayerDefinition, source, timeout | layerInfo, fields, types | Get Feature Layer Info |
| Get Feature Set Extent | `gcx:wf:arcgis::GetFeatureSetExtent` | features* | center, extent | Get Feature Set Extent |
| Get Feature Set Object Ids | `gcx:wf:arcgis::GetFeatureSetObjectIds` | features*, objectIdField | id, ids | Get Feature Set Object Ids |
| Get Geometry Extent | `gcx:wf:arcgis::GetGeometryExtent` | geometry* | center, extent | Get Geometry Extent |
| Get Graphics Layer Features | `gcx:wf:arcgis::GetGraphicsLayerFeatures` | layerId, geometryType | features | Get Graphics Layer Features |
| Get Layer | `gcx:wf:arcgis::GetLayer` | layerId*, sublayerId | layer, sublayer | Get Layer |
| Get Layer Definition Expression | `gcx:wf:arcgis::GetLayerDefinitionExpression` | layerId*, sublayerId | expression | Get Layer Definition Expression |
| Get Layer Property | `gcx:wf:arcgis::GetLayerProperty` | layerId*, name* | value | Get Layer Property |
| Get Layer Visibility | `gcx:wf:arcgis::GetLayerVisibility` | layerId*, sublayerId | visible | Get Layer Visibility |
| Get Map | `gcx:wf:arcgis::GetMap` | - | map | Aktuelles Karten-Objekt. |
| Get Map Screenshot | `gcx:wf:arcgis::GetMapScreenshot` | height, width | dataUrl | Get Map Screenshot |
| Get Portal User | `gcx:wf:arcgis::GetPortalUser` | loadGroups | user, groups, token | Angemeldeter ArcGIS-Benutzer. |
| Get Table | `gcx:wf:arcgis::GetTable` | tableId*, mapServiceId | table | Get Table |
| Get View Extent | `gcx:wf:arcgis::GetViewExtent` | - | extent, center, scale | Get View Extent |
| Get Viewpoint | `gcx:wf:arcgis::GetViewpoint` | - | viewpoint | Get Viewpoint |
| Intersect Engine Task | `gcx:wf:arcgis::IntersectEngineTask` | geometry1, geometry2 | geometry, results | Intersect Engine Task |
| Label Points Service Task | `gcx:wf:arcgis::LabelPointsServiceTask` | url*, geometry* | points | Label Points Service Task |
| Length Engine Task | `gcx:wf:arcgis::LengthEngineTask` | geometry*, geodesic, unit | length | Length Engine Task |
| Nearest Coordinate Engine Task | `gcx:wf:arcgis::NearestCoordinateEngineTask` | geometry*, point* | distance, empty, index, point, side | Nearest Coordinate Engine Task |
| Nearest Vertex Engine Task | `gcx:wf:arcgis::NearestVertexEngineTask` | geometry*, point* | distance, empty, index, point, side | Nearest Vertex Engine Task |
| Nearest Vertices Engine Task | `gcx:wf:arcgis::NearestVerticesEngineTask` | geometry*, point*, proximity*, maxVertices | results | Nearest Vertices Engine Task |
| Offset Engine Task | `gcx:wf:arcgis::OffsetEngineTask` | geometry*, distance*, joinType, unit, bevelRatio, flattenError | geometry | Offset Engine Task |
| Project Service Task | `gcx:wf:arcgis::ProjectServiceTask` | url, geometry*, outSpatialReference*, transformation, reverse | geometry, results | Project Service Task |
| Query Attachment Infos | `gcx:wf:arcgis::QueryAttachmentInfos` | url, layer, objectId*, gdbVersion, timeout | infos | Query Attachment Infos |
| Refresh Layer | `gcx:wf:arcgis::RefreshLayer` | layer* | - | Refresh Layer |
| Register Cors Url | `gcx:wf:arcgis::RegisterCorsUrl` | url*, withCredentials | success | Register Cors Url |
| Relate Engine Task | `gcx:wf:arcgis::RelateEngineTask` | geometry1*, geometry2*, relations* | incident, incidents | Relate Engine Task |
| Relation Service Task | `gcx:wf:arcgis::RelationServiceTask` | url*, geometry1*, geometry2*, relation | incident, incidents | Relation Service Task |
| Remove Feature Set Fields | `gcx:wf:arcgis::RemoveFeatureSetFields` | features*, fields, removeEmptyFields | feature, features | Remove Feature Set Fields |
| Remove Graphics | `gcx:wf:arcgis::RemoveGraphics` | layerId, features* | - | Remove Graphics |
| Remove Layer | `gcx:wf:arcgis::RemoveLayer` | layerId* | success | Remove Layer |
| Renderer From Json | `gcx:wf:arcgis::RendererFromJson` | json* | renderer | Renderer From Json |
| Reset All Layer Definition Expressions | `gcx:wf:arcgis::ResetAllLayerDefinitionExpressions` | onlyInitialLayers | - | Reset All Layer Definition Expressions |
| Reset Layer Definition Expression | `gcx:wf:arcgis::ResetLayerDefinitionExpression` | layerId*, sublayerId | newExpression, oldExpression | Reset Layer Definition Expression |
| Reshape Service Task | `gcx:wf:arcgis::ReshapeServiceTask` | url*, geometry*, reshaper* | geometry | Reshape Service Task |
| Reverse Geocode | `gcx:wf:arcgis::ReverseGeocode` | url*, location, distance, outSpatialReference, languageCode, returnIntersection, timeout, continueOnError | address, location | Koordinate -> Adresse. |
| Rotate Engine Task | `gcx:wf:arcgis::RotateEngineTask` | geometry*, angle*, origin | geometry | Rotate Engine Task |
| Route Task | `gcx:wf:arcgis::RouteTask` | url*, stops, accumulateAttributes, attributeParameterValues, barriers, directionsLanguage, directionsLengthUnits, directionsOutputType, directionsStyleName, directionsTimeAttribute, doNotLocateOnRestrictedElements, findBestSequence, ... | barriers, messages, polygonBarriers, polylineBarriers, routeResults | Routenberechnung (Network Analyst). |
| Select Features | `gcx:wf:arcgis::SelectFeatures` | features*, featureSetDisplayName, featureSetId, mapServiceId, layerId, layerName, collectionName, combineMode, labelFormat, descriptionFormat, longDescriptionFormat, iconUri, ... | - | Setzt aktive Selektion im Viewer. |
| Service Area Task | `gcx:wf:arcgis::ServiceAreaTask` | url*, facilities, accumulateAttributes, attributeParameterValues, defaultBreaks, doNotLocateOnRestrictedElements, excludeSourcesFromPolygons, impedanceAttribute, impedenceAttribute, mergeSimilarPolygonRanges, outputGeometryPrecision, outputGeometryPrecisionUnits, ... | facilities, messages, pointBarriers, polygonBarriers, polylineBarriers, ... | Service Area Task |
| Set Feature Attribute | `gcx:wf:arcgis::SetFeatureAttribute` | feature*, attributeName*, attributeValue | - | Set Feature Attribute |
| Set Feature Geometry | `gcx:wf:arcgis::SetFeatureGeometry` | feature*, geometry | - | Set Feature Geometry |
| Set Feature Popup | `gcx:wf:arcgis::SetFeaturePopup` | template*, features* | - | Set Feature Popup |
| Set Feature Symbol | `gcx:wf:arcgis::SetFeatureSymbol` | feature*, symbol | - | Set Feature Symbol |
| Set Imagery Layer Options | `gcx:wf:arcgis::SetImageryLayerOptions` | layerId*, mosaicRule, rasterFunction, renderingRule, pixelFilter | mosaicRule, pixelFilter, rasterFunction, renderingRule | Set Imagery Layer Options |
| Set Layer Definition Expression | `gcx:wf:arcgis::SetLayerDefinitionExpression` | layerId*, sublayerId, expression* | newExpression, oldExpression | Set Layer Definition Expression |
| Set Layer Popup | `gcx:wf:arcgis::SetLayerPopup` | template*, layerId* | - | Set Layer Popup |
| Set Layer Property | `gcx:wf:arcgis::SetLayerProperty` | layerId*, name*, value* | newValue, oldValue | Set Layer Property |
| Set Layer Visibility | `gcx:wf:arcgis::SetLayerVisibility` | layerId*, sublayerId, visible* | nowVisible, wasVisible | Set Layer Visibility |
| Set Map | `gcx:wf:arcgis::SetMap` | mapId* | - | Set Map |
| Set View Extent | `gcx:wf:arcgis::SetViewExtent` | scale, geometry, features | newExtent, newScale, oldExtent, oldScale | Set View Extent |
| Set Viewpoint | `gcx:wf:arcgis::SetViewpoint` | geometry, features, viewpoint | newViewpoint, oldViewpoint | Set Viewpoint |
| Show Feature Popup | `gcx:wf:arcgis::ShowFeaturePopup` | features* | - | Show Feature Popup |
| Simplify Engine Task | `gcx:wf:arcgis::SimplifyEngineTask` | geometry* | geometry | Simplify Engine Task |
| Sort Feature Set | `gcx:wf:arcgis::SortFeatureSet` | features*, sortAttribute*, ascending | features | Sort Feature Set |
| Symbol From Json | `gcx:wf:arcgis::SymbolFromJson` | json* | symbol | Symbol From Json |
| To Geo Coordinate String Service Task | `gcx:wf:arcgis::ToGeoCoordinateStringServiceTask` | url*, spatialReference, coordinates, conversionType, conversionMode, numOfDigits, rounding, addSpaces | strings | To Geo Coordinate String Service Task |
| Union Engine Task | `gcx:wf:arcgis::UnionEngineTask` | geometry1*, geometry2 | geometry | Union Engine Task |
| Union Service Task | `gcx:wf:arcgis::UnionServiceTask` | url*, geometry1*, geometry2 | geometry | Union Service Task |
| Update Attachment | `gcx:wf:arcgis::UpdateAttachment` | url, layer, objectId*, attachmentId*, attachment*, attachmentName, gdbVersion, returnEditMoment, uploadId, timeout | result | Update Attachment |
| Update Features | `gcx:wf:arcgis::UpdateFeatures` | url, layer, features*, gdbVersion, timeout | results, success | Aktualisiert Features. |
| Query Task | `gcx:wf:arcgis:query:QueryTask` | url, layer, where, geometry, returnGeometry, returnDistinctValues, returnZ, returnM, outSpatialReference, outFields, orderByFields, gdbVersion, ... | feature, features, results | Attribut-/raumliche Abfrage (FeatureSet). |
| Relationship Query Task | `gcx:wf:arcgis:query:RelationshipQueryTask` | url, layer, objectIds*, relationshipId*, outFields, outSpatialReference, returnGeometry, gdbVersion, definitionExpression, geometryPrecision, maxAllowableOffset | results | Beziehungsklassen-Abfrage. |

## Forms (gcx:wf:forms::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Activate Form Element | `gcx:wf:forms::ActivateFormElement` | form, elementName | - | Activate Form Element |
| Add Form Element | `gcx:wf:forms::AddFormElement` | form, elementName*, elementType*, element, targetForm, targetElement, targetPosition | - | Add Form Element |
| Clear Form Element Error | `gcx:wf:forms::ClearFormElementError` | form, elementName | - | Clear Form Element Error |
| Complete Form | `gcx:wf:forms::CompleteForm` | form, result* | - | Schliest Formular kunstlich ab. |
| Filter Form Element Items | `gcx:wf:forms::FilterFormElementItems` | form, elementName, phrase | result | Filter Form Element Items |
| Get Form Element Items From Collection | `gcx:wf:forms::GetFormElementItemsFromCollection` | collection*, labelFieldName, valueFieldName | items | Get Form Element Items From Collection |
| Get Form Element Items From Features | `gcx:wf:forms::GetFormElementItemsFromFeatures` | features*, labelFieldName*, valueFieldName, fields | items | Get Form Element Items From Features |
| Get Form Element Property | `gcx:wf:forms::GetFormElementProperty` | form, elementName, name* | value | Get Form Element Property |
| Get Form Element Value | `gcx:wf:forms::GetFormElementValue` | form, elementName | value | Get Form Element Value |
| Get Form Event Data | `gcx:wf:forms::GetFormEventData` | form | elementId, itemId, type, argument, value | Holt Eventdaten (.argument). |
| Hide Form Element | `gcx:wf:forms::HideFormElement` | form, elementName | - | Hide Form Element |
| Propagate Form Event | `gcx:wf:forms::PropagateFormEvent` | form | - | Propagate Form Event |
| Set Current Form Element Item | `gcx:wf:forms::SetCurrentFormElementItem` | form, elementName, matchType*, value* | result | Set Current Form Element Item |
| Set Form Element Error | `gcx:wf:forms::SetFormElementError` | form, elementName, error*, markdown | - | Set Form Element Error |
| Set Form Element Event | `gcx:wf:forms::SetFormElementEvent` | form, displayFormId, elementName, eventName*, targetActivityId* | - | Set Form Element Event |
| Set Form Element Item Property | `gcx:wf:forms::SetFormElementItemProperty` | form, elementName, itemKey*, propertyName*, propertyValue, markdown | - | Set Form Element Item Property |
| Set Form Element Items | `gcx:wf:forms::SetFormElementItems` | form, elementName, items*, reset | - | Set Form Element Items |
| Set Form Element Limits | `gcx:wf:forms::SetFormElementLimits` | form, elementName, lowerBound, upperBound | - | Set Form Element Limits |
| Set Form Element Property | `gcx:wf:forms::SetFormElementProperty` | form, elementName, propertyName*, propertyValue, markdown | - | Set Form Element Property |
| Show Form Element | `gcx:wf:forms::ShowFormElement` | form, elementName, visible | - | Show Form Element |
| Display Form | `gcx:wf:forms:form:DisplayForm` | name, form, template, container, region, reset | actor, error, event, result, route, ... | Zeigt Formular (state/result). |

## App (gcx:wf:app::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Get Application Data | `gcx:wf:app::GetApplicationData` | key*, visibility | value | Liest globale Sitzungsvariable. |
| Get Application Info | `gcx:wf:app::GetApplicationInfo` | - | name, version, info | Get Application Info |
| Get User Info | `gcx:wf:app::GetUserInfo` | - | username, email, roles | Get User Info |
| Publish Event | `gcx:wf:app::PublishEvent` | eventName*, eventArgument | - | Publish Event |
| Remove Application Data | `gcx:wf:app::RemoveApplicationData` | key*, visibility | removed | Remove Application Data |
| Run Command | `gcx:wf:app::RunCommand` | commandName*, commandParameter | - | Fuhrt Host/Viewer-Command aus. |
| Run Operation | `gcx:wf:app::RunOperation` | operationName*, operationParameter | result | Run Operation |
| Set Application Data | `gcx:wf:app::SetApplicationData` | key*, visibility, value* | - | Speichert globale Variable. |

## Browser (gcx:wf:browser::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Get Browser Info | `gcx:wf:browser::GetBrowserInfo` | - | url, userAgent | Get Browser Info |
| Inject Css | `gcx:wf:browser::InjectCss` | content, url | - | Inject Css |

## UI (gcx:wf:ui::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Alert | `gcx:wf:ui::Alert` | text*, title, markdown | - | Modaler OK-Dialog. |
| Confirm | `gcx:wf:ui::Confirm` | text*, title, markdown | result | OK/Abbrechen (result=true). |
| Prompt | `gcx:wf:ui::Prompt` | description*, defaultText, title, markdown | result | Eingabeaufforderung (result). |

## Math (gcx:wf:math::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Abs | `gcx:wf:math::Abs` | value* | result | Abs |
| Cos | `gcx:wf:math::Cos` | angle* | result | Cos |
| Max | `gcx:wf:math::Max` | value1*, value2 | result | Max |
| Min | `gcx:wf:math::Min` | value1*, value2 | result | Min |
| Pow | `gcx:wf:math::Pow` | base*, exponent* | result | Pow |
| Random | `gcx:wf:math::Random` | - | result | Random |
| Sin | `gcx:wf:math::Sin` | angle* | result | Sin |
| Sqrt | `gcx:wf:math::Sqrt` | value* | result | Sqrt |
| Tan | `gcx:wf:math::Tan` | angle* | result | Tan |

## CSV (gcx:wf:csv::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Convert Csv To Data Table | `gcx:wf:csv::ConvertCsvToDataTable` | csv*, delimiter | result | Convert Csv To Data Table |
| Convert Data Table To Csv | `gcx:wf:csv::ConvertDataTableToCsv` | dataTable*, delimiter | result | Convert Data Table To Csv |
| Parse Csv | `gcx:wf:csv::ParseCsv` | csv*, delimiter, quoteCharacter, headerPresent, parseNumbers, parseBooleans, itemType | result | Parse Csv |

## PDF (gcx:wf:pdf::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Add Georeference To Pdf | `gcx:wf:pdf::AddGeoreferenceToPdf` | source*, pageBounds*, mapBounds*, coordinateSystem*, pageIndex, name | result | Add Georeference To Pdf |
| Add Image To Pdf | `gcx:wf:pdf::AddImageToPdf` | source*, image*, x*, y*, height, width, borderWidth, borderColor, pageIndex | result | Add Image To Pdf |
| Add Text To Pdf | `gcx:wf:pdf::AddTextToPdf` | source*, text*, x*, y*, fontName, fontSize, color, pageIndex | result | Add Text To Pdf |
| Create Pdf | `gcx:wf:pdf::CreatePdf` | pageWidth, pageHeight, title, author, subject, language, keywords | result | Create Pdf |
| Extract Pdf Pages | `gcx:wf:pdf::ExtractPdfPages` | source*, startIndex, numberOfPages | result, totalPages | Extract Pdf Pages |
| Merge Pdfs | `gcx:wf:pdf::MergePdfs` | sources* | result, totalPages | Merge Pdfs |

## XLSX (gcx:wf:xlsx::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Convert Data Table To Xlsx | `gcx:wf:xlsx::ConvertDataTableToXlsx` | dataTable*, password | result | Convert Data Table To Xlsx |
| Convert Xlsx To Data Set | `gcx:wf:xlsx::ConvertXlsxToDataSet` | xlsx*, password | result | Convert Xlsx To Data Set |

## Image (gcx:wf:image::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Get Image Metadata | `gcx:wf:image::GetImageMetadata` | source* | latitude, longitude, metadata | Get Image Metadata |
| Rotate Image | `gcx:wf:image::RotateImage` | source*, angle* | result | Rotate Image |

## Essentials (gcx:wf:essentials::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Get Essentials Site | `gcx:wf:essentials::GetEssentialsSite` | - | site | Get Essentials Site |
| Run Essentials Workflow | `gcx:wf:essentials::RunEssentialsWorkflow` | url*, arguments, timeout | result | Run Essentials Workflow |
| Run Essentials Workflow Activity | `gcx:wf:essentials::RunEssentialsWorkflowActivity` | action*, inputs | result | Run Essentials Workflow Activity |

## Geocortex (gcx:wf:geocortex::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Generate Webmap For Report | `gcx:wf:geocortex::GenerateWebmapForReport` | mapName*, extent, scale | result | Generate Webmap For Report |
| Run Print | `gcx:wf:geocortex::RunPrint` | url*, exportFormat, extent, scale, parameters, resultFileName, resolution, rotation | href | Run Print |
| Run Report | `gcx:wf:geocortex::RunReport` | url*, featureIds, parameters, includeMap, webmapParameters, resultFileName, dataSources, name, value | href | Run Report |

## Server (gcx:wf:server::...)  (nur Server-Workflows)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Copy File | `gcx:wf:server::CopyFile` | sourcePath*, destinationPath* | - | Copy File |
| Create Directory | `gcx:wf:server::CreateDirectory` | path* | - | Create Directory |
| Create Download | `gcx:wf:server::CreateDownload` | content*, contentType, filename*, openInBrowser, expiry | url | Create Download |
| Create Email Attachment | `gcx:wf:server::CreateEmailAttachment` | content*, contentType, filename* | result | Create Email Attachment |
| Create Zip From Directory | `gcx:wf:server::CreateZipFromDirectory` | sourceDirectory*, destinationZipFile*, includeSourceDirectoryName | - | Create Zip From Directory |
| Delete Directory | `gcx:wf:server::DeleteDirectory` | path* | - | Delete Directory |
| Delete File | `gcx:wf:server::DeleteFile` | path* | - | Delete File |
| Directory Exists | `gcx:wf:server::DirectoryExists` | path* | exists | Directory Exists |
| Extract Zip To Directory | `gcx:wf:server::ExtractZipToDirectory` | sourceZipFile*, destinationDirectory* | - | Extract Zip To Directory |
| File Exists | `gcx:wf:server::FileExists` | path* | exists | File Exists |
| Get Directories In Directory | `gcx:wf:server::GetDirectoriesInDirectory` | path*, searchPattern | directories | Get Directories In Directory |
| Get Files In Directory | `gcx:wf:server::GetFilesInDirectory` | path*, searchPattern | files | Get Files In Directory |
| Move File | `gcx:wf:server::MoveFile` | sourcePath*, destinationPath* | - | Move File |
| Read File | `gcx:wf:server::ReadFile` | path*, encoding | text | Read File |
| Read File Bytes | `gcx:wf:server::ReadFileBytes` | path* | bytes | Read File Bytes |
| Run Application | `gcx:wf:server::RunApplication` | fileName*, arguments, timeout, waitForResult | errorData, exitCode, outputData | Run Application |
| Run Python | `gcx:wf:server::RunPython` | pythonFile*, arguments, timeout | error, exitCode, result, success | Run Python |
| Send Email | `gcx:wf:server::SendEmail` | to, from*, cc, bcc, subject, body*, attachments, isBodyHtml | - | Send Email |
| Sql Non Query | `gcx:wf:server::SqlNonQuery` | providerName*, connectionString, connectionConfigName, commandText*, parameters, commandTimeout | rowsAffected | Sql Non Query |
| Sql Query | `gcx:wf:server::SqlQuery` | providerName*, connectionString, connectionConfigName, commandText*, parameters, commandTimeout | dataTable | Sql Query |
| Sql Query Unsafe | `gcx:wf:server::SqlQueryUnsafe` | providerName*, connectionString, connectionConfigName, commandText*, parameters, commandTimeout | dataTable | Sql Query Unsafe |
| Write File | `gcx:wf:server::WriteFile` | path*, text*, encoding | - | Write File |
| Write File Bytes | `gcx:wf:server::WriteFileBytes` | path*, bytes* | - | Write File Bytes |

## Web AppBuilder (gcx:wf:wab::...)

| Name | Typ | Inputs | Outputs | Beschreibung |
|---|---|---|---|---|
| Open Widget | `gcx:wf:wab::OpenWidget` | widgetId* | - | Open Widget |
| Publish Widget Data | `gcx:wf:wab::PublishWidgetData` | data*, keepHistory | - | Publish Widget Data |
| Send Layer To Attribute Table | `gcx:wf:wab::SendLayerToAttributeTable` | layer* | - | Send Layer To Attribute Table |