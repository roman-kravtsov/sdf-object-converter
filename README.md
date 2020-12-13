# SDF Object to Thing Model Converter
### Project structure
```
sdf-object-converter                 //
├─ Converter                         //
│  └─ Converter.js                   // Abstract Converter
├─ examples                          // Examples of SDF Objects
│  ├─ example-1.json                 //
│  ├─ example-2.json                 //
│  ├─ ...
├─ generated-thing-model.json        // A Generated Thing Model
├─ index.js                          // Main file
├─ SDFObject                         //
│  ├─ README.md                      //
│  ├─ sdf-object-example.json        //
│  └─ SDFObjectConverter.js          // SDF Object to Thing Model converter
└─ utils                             //
   └─ index.js                       // utility functions
```

# How to run
```js
npm start
```
This will serve `sdf-object-example.json` as an input and generate a file `generated-thing-model.json`

# How to serve custom json as input
```js
node index.js <Aboslute/Relative path to a SDF-Object.json file>
```

# How this works

### This tool converts an SDF Object to a Thing model. It maps SDF Object elements to the appropriate elements of a Thing Model.
* ### Contents of `sdfObject` property are mapped to 3 corresponding Thing Model properties: `properties`, `actions` and `events`.
* ### Contents of `sdfProperty` are mapped to the contents of `properties` key of a Thing Model.
* ### Contents of `sdfAction` are mapped to the contents of `actions` key of a Thing Model.
* ### Contents of `sdfEvent` are mapped to the contents of `events` key of a Thing model.
  
If an `sdfProperty`, `sdfAction` or `sdfEvent` property contain an `sdfRef`, then the referenced object is searched and inserted directly in the corresponding property of a Thing Model.

# To Do
1. Reference logic is also supported by Thing Model and json-ld. A referenced object in a `SDF Object` will also be mapped to the `definitions` property of a Thing Model, therefore all following properties of a Thing Model will also reference to a corresponding object.