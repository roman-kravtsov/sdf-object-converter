const fs = require("fs");
/**
 * Get Thing Data From a JSON file
 *
 * @param {String} filePath
 * @return {Object} Thing Data
 */
function getDataFromFile(filePath) {
  const content = fs.readFileSync(filePath);
  return JSON.parse(content);
}
/**
 * Read the console arguments and get required data
 *
 * @return {Object[]}
 */
function getConsoleArguments() {
  if (process.argv.length > 3 && process.argv.length < 5) {
    console.warn(
      "Usage: node thingModel2thingDescription.js <thingModel.json> <thingDescriptionTemplate.json> <placeholders.json>"
    );

    process.exit(-1);
  }

  const fileName = process.argv[2];
  const templateFileName = process.argv[3];
  const placeholdersFileName = process.argv[4];

  return {
    fileName,
    templateFileName,
    placeholdersFileName,
  };
}

module.exports = {
  getDataFromFile: getDataFromFile,
  getConsoleArguments: getConsoleArguments,
};
