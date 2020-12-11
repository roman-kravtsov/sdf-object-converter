const fs = require("fs");
const SDFObjectConverter = require("./SDFObject/SDFObjectConverter");
const utils = require("./utils");

/**
 * Convert a SDFObject to a Thing Model
 *
 */
function convert() {
  const { fileName: sdfObjectFileName } = utils.getConsoleArguments();

  const sdfObject = utils.getDataFromFile(sdfObjectFileName);

  const sdfObjectConverter = new SDFObjectConverter(sdfObject);
  const thingModel = sdfObjectConverter.convert();
  const thingModelJSON = JSON.stringify(thingModel, null, "\t");
  console.log(thingModel);
  fs.writeFileSync("./generated-thing-model.json", thingModelJSON);
}

convert();
