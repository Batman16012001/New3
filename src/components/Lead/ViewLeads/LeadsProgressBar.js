import React, { useEffect, useState } from "react";
import "./LeadsProgressBar.css"; // Custom CSS for styling
import axios from "axios";

const LeadsProgressBar = ({ leadStages }) => {
  const [allStages, setAllStages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.2.11:3002/configurableitems/getLeadStages"
        );
        console.log("Fetched Stages:", response.data.result[0]);

        // Set stages after converting them to lowercase for consistent comparison
        setAllStages(
          response.data.result[0].stages.map((stage) => stage.toLowerCase())
        );
      } catch (error) {
        console.error("Error while fetching:", error);
      }
    };

    fetchData();
  }, []);

  if (allStages.length === 0) return <p>Loading stages...</p>;

  // Convert received lead stages to lowercase for comparison
  const completedStages = leadStages
    ? leadStages.map((stage) => stage.stage_name.toLowerCase())
    : [];

  return (
    <div className="progress-wrapper">
      <div className="progress-container">
        {allStages.map((stage, index) => (
          <div
            key={index}
            className={`progress-step ${
              completedStages.includes(stage) ? "active" : ""
            }`}
          >
            {stage}
          </div>
        ))}
      </div>

      {/* Display Current Stage */}
      <div className="last-stage">
        <strong>Current Stage:</strong>{" "}
        {completedStages.length > 0
          ? leadStages[leadStages.length - 1]?.stage_name
          : ""}
      </div>
    </div>
  );
};

export default LeadsProgressBar;
