CSV to JSON Converter API
This project demonstrates a CSV to JSON converter API built using Node.js and Express.js, capable of parsing CSV files into JSON and uploading the parsed data to a PostgreSQL database. Additionally, the application calculates and reports the age distribution of the uploaded users.

Features
Convert CSV files with complex property structures into JSON objects.
Store parsed data in a PostgreSQL database.
Calculate and display age distribution across predefined age groups.
Custom CSV parser implemented without using third-party NPM packages.
Prerequisites
Node.js (v14 or later)
PostgreSQL (v12 or later)
Setup Instructions
1. Clone the Repository
bash
Copy code
git clone https://github.com/<your-repo-name>/csv-json-converter-api.git
cd csv-json-converter-api
2. Install Dependencies
Run the following command to install all necessary dependencies:

bash
Copy code
npm install
3. Configure Environment Variables
Create a .env file in the project root directory with the following configuration:

env
Copy code
PORT=4200
DB_USER=<your_db_user>
DB_PASSWORD=<your_db_password>
DB_HOST=localhost
DB_PORT=5432
DB_NAME=csv_upload
CSV_UPLOAD_DIR=uploads
4. Setup PostgreSQL Database
Open your PostgreSQL client and run the following SQL command to create the required table:

sql
Copy code
CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  age INT NOT NULL,
  address JSONB,
  additional_info JSONB
);
5. Start the Server
Start the server using the following command:

bash
Copy code
npm start
The server will run at http://localhost:4200.

API Endpoints
POST /upload
Description: Uploads a CSV file, parses it, and stores the data in the PostgreSQL database.
Request:
Form-data containing a CSV file (key: csvFile).
Response:
A message showing the age distribution as a percentage.
Example CSV Format
csv
Copy code
name.firstName, name.lastName, age, address.line1, address.line2, address.city, address.state, gender
Rohit, Soni, 29, A-563 Rakshak Society, New Pune Road, Pune, Maharashtra, male
Ravi, Sharma, 42, 12/C Block, Koramangala, Bangalore, Karnataka, male
...
Sample API Response
json
Copy code
{
  "msg": {
    "<20": "20.00",
    "20-40": "45.00",
    "40-60": "25.00",
    ">60": "10.00"
  }
}
Age Distribution Calculation
The application calculates the age distribution across the following groups:

< 20
20-40
40-60
> 60
This distribution is logged to the console after the data is processed.

Project Structure
bash
Copy code
├── server.js           # Main server file
├── parseCSV.js         # Custom CSV parsing logic
├── database.js         # PostgreSQL connection setup and queries
├── .env                # Environment variables
└── uploads/            # Directory for storing uploaded CSV files
Assumptions
The first row in the CSV file will always contain the headers (property names).
The application can handle CSV files with over 50,000 rows.
Nested properties with infinite depth are supported (e.g., a.b.c.d).
Unmapped properties are stored under additional_info in JSON format.
Enhancements (Future)
Implement CSV validation rules.
Support for paginated data display.
Add user authentication for secure file uploads.
License
This project is licensed under the MIT License.
