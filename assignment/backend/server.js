const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const { parseCSV } = require("./parseCSV");
const { pool } = require("./database");
const { log } = require("console");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(fileUpload());
app.use(express.json());

app.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.csvFile) {
      return res.status(400).send("No CSV file uploaded.");
    }

    const csvFile = req.files.csvFile;
    const filePath = path.join(
      __dirname,
      process.env.CSV_UPLOAD_DIR,
      csvFile.name
    );

    await csvFile.mv(filePath);

    const records = await parseCSV(filePath);

    console.log("Parsed Records:", records);

    for (const record of records) {
      console.log("Processing record:", record);

      if (!record.name || !record.name.firstName || !record.name.lastName) {
        console.error("Invalid record structure:", record);
        continue;
      }

      const {
        name: { firstName, lastName },
        age,
        address,
        ...additionalInfo
      } = record;

      const fullName = `${firstName} ${lastName}`;
      const addressJSON = JSON.stringify(address);
      const additionalInfoJSON = JSON.stringify(additionalInfo);

      await pool.query(
        `
        INSERT INTO public.users (name, age, address, additional_info)
        VALUES ($1, $2, $3, $4)
      `,
        [fullName, age, addressJSON, additionalInfoJSON]
      );
    }

    const result = await pool.query(`SELECT age FROM public.users`);
    const ageGroups = calculateAgeDistribution(
      result.rows.map((row) => row.age)
    );

    console.log("Age-Group % Distribution", ageGroups);

    res.status(200).json({ msg: ageGroups });
  } catch (error) {
    console.error("Error processing CSV file:", error);
    res.status(500).send("Error processing CSV file.");
  }
});

function calculateAgeDistribution(ages) {
  const total = ages.length;
  const distribution = { "<20": 0, "20-40": 0, "40-60": 0, ">60": 0 };

  ages.forEach((age) => {
    if (age < 20) distribution["<20"]++;
    else if (age <= 40) distribution["20-40"]++;
    else if (age <= 60) distribution["40-60"]++;
    else distribution[">60"]++;
  });

  return {
    "<20": ((distribution["<20"] / total) * 100).toFixed(2),
    "20-40": ((distribution["20-40"] / total) * 100).toFixed(2),
    "40-60": ((distribution["40-60"] / total) * 100).toFixed(2),
    ">60": ((distribution[">60"] / total) * 100).toFixed(2),
  };
}

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
