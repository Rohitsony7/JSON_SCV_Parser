import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [ageDistribution, setAgeDistribution] = useState([null]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const response = await fetch("http://localhost:4200/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result);
      setMessage(result.msg);

      if (result.msg && typeof result.msg === "object") {
        setAgeDistribution(result.msg);
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
      setMessage("Error uploading the file.");
    }
  };

  return (
    <div className="app-container">
      <h1>CSV Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {ageDistribution && (
        <div className="age-distribution">
          <h2>Age Distribution</h2>
          <table>
            <thead>
              <tr>
                <th>Age Group</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(ageDistribution)?.map(
                ([ageGroup, percentage]) => (
                  <tr key={ageGroup}>
                    <td>{ageGroup}</td>
                    <td>{parseFloat(percentage)?.toFixed(2)}%</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
