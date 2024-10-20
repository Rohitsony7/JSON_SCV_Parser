const fs = require("fs");
const { parse } = require("csv-parse/sync");

function parseCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  const parsedRecords = records.map((record) => {
    const parsedRecord = {};

    for (let key in record) {
      const value = record[key];
      const keys = key.split(".");

      keys.reduce((acc, part, index) => {
        if (index === keys.length - 1) {
          acc[part] = value;
        } else {
          acc[part] = acc[part] || {};
        }
        return acc[part];
      }, parsedRecord);
    }

    return parsedRecord;
  });

  console.log("Parsed Records:", parsedRecords);

  return parsedRecords;
}

module.exports = { parseCSV };
