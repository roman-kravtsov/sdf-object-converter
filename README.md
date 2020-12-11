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
