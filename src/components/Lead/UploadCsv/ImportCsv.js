import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ImportCsv = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => navigate("/uploadcsv")}
      >
        Import CSV
      </button>
    </div>
  );
};

export default ImportCsv;



// import React, { useState, useEffect } from "react";
// import { Modal, Button } from "react-bootstrap";
// import Papa from "papaparse"; // Import PapaParse
// import "./UploadCsv.css";
// import { fetchCampaignNameDetails } from "./UploadCsvservice.js";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { CloudDrizzle } from "react-feather";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

// const UploadCsv = () => {
//   const userid = sessionStorage.getItem("UserID");
//   const [files, setFiles] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false); // Manage Modal
//     const [modalMessage, setModalMessage] = useState("");
//     const [showProgress, setShowProgress] = useState("");
//   const [errorMessages, setErrorMessages] = useState({});
//   const [campaigns, setCampaigns] = useState([]);
//   const [selectedCampaign, setSelectedCampaign] = useState("");
//   const [file, setFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   // Required column headers
//   const requiredHeaders = ["campaign_id", "leadSource", "mobile_number"];

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];

//     if (selectedFile) {
//       // Ensure it's a CSV file
//       if (!selectedFile.name.endsWith(".csv")) {
//         setModalMessage("Invalid file format. Please upload a CSV file.");
//         setShowModal(true);
//         return;
//       }

//       setFile(selectedFile);
//       setUploadProgress(0); // Reset progress
//       setShowProgress(false); // Hide progress initially
//     }
//   };

//   const simulateUpload = () => {
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 10;
//       setUploadProgress(progress);
//       if (progress >= 100) clearInterval(interval);
//     }, 500);
//   };

//   // validate the csv file
//   const validateCsv = (data, fileName) => {
//     if (data.length === 1) {
//       return { [fileName]: "CSV file is empty." };
//     }

//     // Extract headers
//     const headers = data[0].map((header) => header.trim());

//     // Ensure required headers exist
//     const missingHeaders = requiredHeaders.filter(
//       (header) => !headers.includes(header)
//     );
//     if (missingHeaders.length > 0) {
//       return {
//         [fileName]: `Missing required headers: ${missingHeaders.join(", ")}`,
//       };
//     }

//     // Get the column indexes for required headers
//     const headerIndexes = requiredHeaders.map((header) =>
//       headers.indexOf(header)
//     );

//     // Track if at least one row contains values for mandatory headers
//     let hasValidMandatoryValues = false;

//     // Validate each row (excluding the header row)
//     for (let i = 1; i < data.length; i++) {
//       const row = data[i];

//       // Skip fully empty rows
//       if (row.every((cell) => !cell?.trim())) {
//         continue;
//       }

//       // Ensure every required column has a value
//       const missingFields = requiredHeaders.filter((header, index) => {
//         const columnIndex = headerIndexes[index];
//         return !row[columnIndex]?.trim(); // Check if value is empty
//       });

//       if (missingFields.length > 0) {
//         return {
//           [fileName]: `Missing required headers value for: ${missingFields.join(
//             ", "
//           )}`,
//         };
//       }

//       hasValidMandatoryValues = true;
//     }

//     // If no row contained values for mandatory headers, return an error
//     if (!hasValidMandatoryValues) {
//       return { [fileName]: "Mandatory header values are missing in the CSV." };
//     }

//     return null; // No errors
//   };

//   // uploads in backend
//   const handleUpload = async () => {
//     if (files.length === 0) {
//       alert("Please select at least one CSV file before uploading.");
//       return;
//     }

//     let allErrors = {};
//     let validFiles = 0;
//     let validData = [];

//     files.forEach((file) => {
//       const reader = new FileReader();

//       reader.onload = ({ target }) => {
//         const csvText = target.result;
//         console.log("csvText:", csvText);

//         if (csvText.length === 0) {
//           //adeed By Amruta
//           return alert(file.name + "CSV file is empty.");
//         }
//         Papa.parse(csvText, {
//           complete: (result) => {
//             const rows = result.data;
//             const error = validateCsv(rows, file.name);

//             if (error) {
//               allErrors = { ...allErrors, ...error };
//             } else {
//               validFiles++;
//               validData.push({ fileName: file.name, data: rows });
//             }

//             // If all files are processed, check errors and proceed
//             if (Object.keys(allErrors).length > 0) {
//               setErrorMessages(allErrors);
//               alert(JSON.stringify(error)); // need to change
//             } else if (
//               validFiles > 0 &&
//               validFiles + Object.keys(allErrors).length === files.length
//             ) {
//               console.log("Valid CSVs uploaded:", validData);

//               setErrorMessages({}); // Clear errors on success

//               // Call API after successful validation
//               saveToBackend(validData);
//             }
//           },
//           skipEmptyLines: true,
//         });
//       };

//       reader.readAsText(file);
//     });
//   };

//   const parseCSVData = (csvString) => {
//     try {
//       // Parse the CSV string to JSON
//       const parsedData = csvString;
//       const csvContent = parsedData[0]?.data;

//       if (!csvContent || csvContent.length < 2) {
//         console.error("Invalid CSV format");
//         return [];
//       }

//       // Extract headers (first row)
//       const headers = csvContent[0];

//       // Convert remaining rows into JSON objects
//       const jsonData = csvContent.slice(1).map((row) => {
//         let obj = {};
//         headers.forEach((key, index) => {
//           obj[key] = row[index];
//         });
//         return obj;
//       });

//       return jsonData;
//     } catch (error) {
//       console.error("Error parsing CSV data:", error);
//       return [];
//     }
//   };

//   // Function to send data to backend
//   const saveToBackend = async (validData, allErrors) => {
//     if (validData.length > 0) {
//       let csvJSONData = parseCSVData(validData);
//       if (csvJSONData.length > 0) {
//         try {
//           const response = await fetch(
//             "http://192.168.2.11:3004/leadManagement/uploadLeadFromCsv",
//             {
//               method: "PUT",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify(csvJSONData),
//             }
//           );

//           const result = await response.json();
//           if (response.ok) {
//             console.log("Data successfully saved:", result);
//             // alert("CSV data successfully saved!");
//             setShowModal(true);
//           } else {
//             console.error("Error saving data:", result.details);
//             alert(result.details[0]);
//             // alert("Failed to save data. Please try again.");
//           }
//         } catch (error) {
//           console.error("API error:", error);
//           alert("An error occurred while saving data.");
//         }
//       } else {
//         alert("An error occurred while generating json data.");
//       }
//     } else {
//       alert(allErrors[0]); // need to change
//     }
//   };

//   // samplefile download
//   const handleDownloadSample = () => {
//     const sampleCsvUrl = "./TemplateCSVUpload.csv";
//     window.open(sampleCsvUrl, "_blank");
//   };

//   useEffect(() => {
//     const loadCampaignNameData = async () => {
//       try {
//         const data = await fetchCampaignNameDetails(userid);
//         setCampaigns(data?.data?.campaigns || []);
//       } catch (error) {
//         console.error("Error fetching campaign data:", error);
//       }
//     };
//     loadCampaignNameData();
//   }, []);

//   const handleCampaignChange = (e) => {
//     setSelectedCampaign(e.target.value);
//   };

//   return (
//     <div className="container ">
//       {/* Campaign Name Display */}
//       <div className="row ">
//         <div className="col-md-6 mb-3">
//           <label className="form-label">Campaign Name </label>
//           <select
//             className="form-select"
//             name="campaignSelection"
//             onChange={handleCampaignChange}
//           >
//             <option value="">Select a Campaign</option>
//             {campaigns.map((campaign) => (
//               <option key={campaign.campaign_id} value={campaign.campaign_id}>
//                 {campaign.campaign_name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Show File Upload Section Only When a Campaign is Selected */}
     
//     selectedCampaign && (
//       <div className="row d-flex justify-content-center mt-5">
//         <div className="col-md-4 mb-3 file-upload text-center p-5 bg-light rounded uploadbox h-75">
//           {/* File Selection UI */}
//           {!file && (
//             <>
//               <input
//                 type="file"
//                 accept=".csv"
//                 onChange={handleFileChange}
//                 hidden
//                 id="fileInput"
//               />
//               <label htmlFor="fileInput" className="btn">
//                 <FontAwesomeIcon icon={faCloudArrowUp} size="3x" style={{ color: "blue" }} />
//               </label>
//               <p className="text-muted">Drag & drop or click to choose files</p>
//             </>
//           )}

//           {/* File Upload Progress (Only after clicking Upload) */}
//           {file && showProgress && (
//             <div className="file-progress text-center p-3 border rounded bg-light">
//               <FontAwesomeIcon icon={faCloudArrowUp} size="2x" />
//               <p>{file.name}</p>
//               <p className="text-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
//               <div className="progress">
//                 <div
//                   className="progress-bar"
//                   role="progressbar"
//                   style={{ width: `${uploadProgress}%` }}
//                 >
//                   {uploadProgress}%
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Upload Button */}
//         {file && !showProgress && (
//           <div className="text-center mt-3">
//             <button className="uploadbutton" onClick={handleUpload}>
//               Upload
//             </button>
//           </div>
//         )}

//         <p className="small text-center text-muted mt-2">
//           Supported formats: CSV &nbsp; | &nbsp; Max: 25MB
//         </p>

//         {/* Error Modal */}
        
//       </div>
//     )

//       {/* {selectedCampaign && (
//         <div className="row d-flex justify-content-center mt-5">
//           <div className="col-md-4 mb-3 file-upload text-center p-5 bg-light rounded uploadbox h-75">
            
//             {!file ? (
//               <>
//                 <input
//                   type="file"
//                   accept=".csv"
//                   onChange={handleFileChange}
//                   hidden
//                   id="fileInput"
//                 />
//                 <label htmlFor="fileInput" className="btn">
//                   <FontAwesomeIcon icon={faCloudArrowUp} size="3x" style={{ color: "blue" }} />
//                 </label>
//                 <p className="text-muted">Drag & drop or click to choose files</p>
//               </>
//             ) : (
//               // Show Progress UI when a file is selected
//               <div className="file-progress text-center">
//                 <FontAwesomeIcon icon={faCloudArrowUp} size="2x" />
//                 <p>{file.name}</p>
//                 <p className="text-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
//                 <div className="progress">
//                   <div
//                     className="progress-bar"
//                     role="progressbar"
//                     style={{ width: `${uploadProgress}%` }}
//                   >
//                     {uploadProgress}%
//                   </div>
//                 </div>
//               </div>
//             )}
//             </div>
//         </div>
//       )} */}

//       {/* Success Modal */}
//      <Modal show={showModal} onHide={() => setShowModal(false)}>
//           <Modal.Header closeButton>
//             <Modal.Title>File Upload Error</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>{modalMessage}</Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//     </div>
//   );
// };

// export default UploadCsv;


import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp,faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';
import { fetchCampaignNameDetails } from "./UploadCsvservice.js";
import './UploadCsv.css';

// const UploadCsv = () => {
//   const userid = sessionStorage.getItem("UserID");
//   const [files, setFiles] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [showProgress, setShowProgress] = useState(false); // Show progress only after upload button is clicked
//   const [errorMessages, setErrorMessages] = useState({});
//   const [campaigns, setCampaigns] = useState([]);
//   const [selectedCampaign, setSelectedCampaign] = useState("");
//   const [file, setFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const requiredHeaders = ["campaign_id", "leadSource", "mobile_number"];

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       // Ensure it's a CSV file
//       if (!selectedFile.name.endsWith(".csv")) {
//         setModalMessage("Invalid file format. Please upload a CSV file.");
//         setShowModal(true);
//         return;
//       }

//       setFile(selectedFile);
//       setShowProgress(false); // Hide progress initially
//       setUploadProgress(0); // Reset progress bar
//     }
//   };

//   // Simulate file upload progress
//   const simulateUpload = () => {
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 10;
//       setUploadProgress(progress);
//       if (progress >= 100) {
//         clearInterval(interval);
//         // Trigger the backend save after progress reaches 100%
//         setTimeout(() => {
//           saveToBackend(); // Call the function to send data to the backend
//         }, 500); // Delay before sending data to backend after progress completes
//       }
//     }, 500);
//   };

//   // Validate CSV file contents
//   const validateCsv = (data, fileName) => {
//     if (data.length === 1) {
//       return { [fileName]: "CSV file is empty." };
//     }

//     const headers = data[0].map((header) => header.trim());
//     const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
//     if (missingHeaders.length > 0) {
//       return {
//         [fileName]: `Missing required headers: ${missingHeaders.join(", ")}`,
//       };
//     }

//     const headerIndexes = requiredHeaders.map((header) => headers.indexOf(header));
//     let hasValidMandatoryValues = false;

//     for (let i = 1; i < data.length; i++) {
//       const row = data[i];
//       if (row.every((cell) => !cell?.trim())) continue;

//       const missingFields = requiredHeaders.filter((header, index) => {
//         const columnIndex = headerIndexes[index];
//         return !row[columnIndex]?.trim();
//       });

//       if (missingFields.length > 0) {
//         return {
//           [fileName]: `Missing required values for: ${missingFields.join(", ")}`,
//         };
//       }

//       hasValidMandatoryValues = true;
//     }

//     if (!hasValidMandatoryValues) {
//       return { [fileName]: "Mandatory header values are missing in the CSV." };
//     }

//     return null;
//   };

//   // Handle file upload after validation
//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a CSV file before uploading.");
//       return;
//     }

//     let allErrors = {};
//     const reader = new FileReader();

//     reader.onload = ({ target }) => {
//       const csvText = target.result;
//       if (csvText.length === 0) {
//         return alert(file.name + " is empty.");
//       }

//       Papa.parse(csvText, {
//         complete: (result) => {
//           const rows = result.data;
//           const error = validateCsv(rows, file.name);

//           if (error) {
//             allErrors = { ...allErrors, ...error };
//             setModalMessage(error[file.name]);
//             setShowModal(true);
//           } else {
//             // If no errors, show progress and proceed with upload
//             setShowProgress(true);
//             simulateUpload(); // Start upload simulation
//           }
//         },
//         skipEmptyLines: true,
//       });
//     };

//     reader.readAsText(file);
//   };

//   const saveToBackend = async () => {
//     const reader = new FileReader();
//     reader.onload = async ({ target }) => {
//       const csvText = target.result;
//       const rows = Papa.parse(csvText, { header: true }).data; // Parse with headers set to true
//       const csvJSONData = parseCSVData(rows);
  
//       if (csvJSONData.length > 0) {
//         try {
//           const response = await fetch("http://192.168.2.11:3004/leadManagement/uploadLeadFromCsv", {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(csvJSONData),
//           });
//           console.log("Response:",response);
          
  
//           if (response.ok) {
//             const result = await response.json();
//             setModalMessage(result.message || "File uploaded successfully.");
//             setShowModal(true);
//           } else {
//             const errorResult = await response.json();
//             setModalMessage(errorResult.message || "An error occurred while uploading.");
//             setShowModal(true);
//           }
//         } catch (error) {
//           console.error("Upload error:", error);
//           setModalMessage("An error occurred while uploading.");
//           setShowModal(true);
//         }
//       }
//     };
  
//     reader.readAsText(file);
//   };
  

//   const parseCSVData = (csvData) => {
//     if (!csvData || csvData.length === 0) return [];
  
//     // Assuming `csvData` is already parsed with headers, Papa.parse's `header: true` should return an object for each row.
//     const headers = Object.keys(csvData[0]); // Extract headers from the first row (object keys)
    
//     return csvData.map((row) => {
//       let obj = {};
//       headers.forEach((key) => {
//         obj[key] = row[key]; // Map each row's value by headers
//       });
//       return obj;
//     });
//   };
  

//   const handleDownloadSample = () => {
//     const sampleCsvUrl = "./TemplateCSVUpload.csv";
//     window.open(sampleCsvUrl, "_blank");
//   };

//   useEffect(() => {
//     const loadCampaignNameData = async () => {
//       try {
//         const data = await fetchCampaignNameDetails(userid);
//         setCampaigns(data?.data?.campaigns || []);
//       } catch (error) {
//         console.error("Error fetching campaign data:", error);
//       }
//     };
//     loadCampaignNameData();
//   }, []);

//   const handleCampaignChange = (e) => {
//     setSelectedCampaign(e.target.value);
//   };

//   return (
//     <div className="container">
//       {/* Campaign Name Display */}
//       <div className="row">
//         <div className="col-md-6 mb-3">
//           <label className="form-label">Campaign Name </label>
//           <select
//             className="form-select"
//             name="campaignSelection"
//             onChange={handleCampaignChange}
//           >
//             <option value="">Select a Campaign</option>
//             {campaigns.map((campaign) => (
//               <option key={campaign.campaign_id} value={campaign.campaign_id}>
//                 {campaign.campaign_name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Show File Upload Section Only When a Campaign is Selected */}
//       {selectedCampaign && (
//         <div className="row d-flex justify-content-center mt-5">
//           <div className="col-md-4 mb-3 file-upload text-center p-5 bg-light rounded uploadbox">
//             {/* File Selection UI */}
//             {!file && (
//               <>
//                 <input
//                   type="file"
//                   accept=".csv"
//                   onChange={handleFileChange}
//                   hidden
//                   id="fileInput"
//                 />
//                 <label htmlFor="fileInput" className="btn">
//                   <FontAwesomeIcon icon={faCloudArrowUp} size="3x" style={{ color: "blue" }} />
//                 </label>
//                 <p className="text-muted">Drag & drop or click to choose files</p>
//               </>
//             )}

//             {/* Show Progress UI when Upload is in progress */}
//             {showProgress && (
//               <>
//                 <FontAwesomeIcon icon={faCloudArrowUp} size="2x" />
//                 <p>{file.name}</p>
//                 <p className="text-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
//                 <div className="progress">
//                   <div
//                     className="progress-bar"
//                     role="progressbar"
//                     style={{ width: `${uploadProgress}%` }}
//                   >
//                     {uploadProgress}%
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Upload Button */}
//           {file && !showProgress && (
//             <div className="text-center mt-3">
//               <button className="uploadbutton" onClick={handleUpload}>
//                 Upload
//               </button>
//             </div>
//           )}

//           <p className="small text-center text-muted mt-2">
//             Supported formats: CSV &nbsp; | &nbsp; Max: 25MB
//           </p>
//         </div>
//       )}

//       {/* Success/Error Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Body className="text-center p-4">
//           {modalMessage?.trim().toLowerCase() === "csv files imported successfully!" ? (
//             <img src="/greentick.gif" alt="Success" width="103" height="103" />
//           ) : (
//             <FontAwesomeIcon
//               icon={faTriangleExclamation}
//               size="3x"
//               style={{ color: "#7a0014" }}
//             />
//           )}

//           <h5 className="text-lg font-semibold mt-3" style={{ color: "#671E75" }}>
//             {modalMessage || "Something went wrong."}
//           </h5>

//           <button
//             className="mt-4 px-4 py-2 rounded-lg text-white"
//             onClick={() => setShowModal(false)}
//             style={{
//               backgroundColor: "#671E75",
//               border: "none",
//               color: "#FFFFFF",
//             }}
//           >
//             OK
//           </button>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };


const UploadCsv = () => {
  const userid = sessionStorage.getItem("UserID");
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showProgress, setShowProgress] = useState(false); // Show progress only after upload button is clicked
  const [errorMessages, setErrorMessages] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const requiredHeaders = ["campaign_id", "leadSource", "mobile_number"];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Ensure it's a CSV file
      if (!selectedFile.name.endsWith(".csv")) {
        setModalMessage("Invalid file format. Please upload a CSV file.");
        setShowModal(true);
        return;
      }

      setFile(selectedFile);
      setShowProgress(false); // Hide progress initially
      setUploadProgress(0); // Reset progress bar
    }
  };

  // Simulate file upload progress
  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 500);
  };

  // Validate CSV file contents
  const validateCsv = (data, fileName) => {
    if (data.length === 1) {
      return { [fileName]: "CSV file is empty." };
    }

    const headers = data[0].map((header) => header.trim());
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
    if (missingHeaders.length > 0) {
      return {
        [fileName]: `Missing required headers: ${missingHeaders.join(", ")}`,
      };
    }

    const headerIndexes = requiredHeaders.map((header) => headers.indexOf(header));
    let hasValidMandatoryValues = false;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row.every((cell) => !cell?.trim())) continue;

      const missingFields = requiredHeaders.filter((header, index) => {
        const columnIndex = headerIndexes[index];
        return !row[columnIndex]?.trim();
      });

      if (missingFields.length > 0) {
        return {
          [fileName]: `Missing required values for: ${missingFields.join(", ")}`,
        };
      }

      hasValidMandatoryValues = true;
    }

    if (!hasValidMandatoryValues) {
      return { [fileName]: "Mandatory header values are missing in the CSV." };
    }

    return null;
  };

  // Handle file upload after validation
  const handleUpload = async () => {
    if (!file) {
      setModalMessage("Please select a CSV file before uploading.");
      setShowModal(true);
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = ({ target }) => {
      const csvText = target.result;
      if (csvText.length === 0) {
        setModalMessage(file.name + " is empty.");
        setShowModal(true);
        return;
      }
  
      Papa.parse(csvText, {
        complete: (result) => {
          const rows = result.data;
          console.log("Parsed CSV Data:", rows); // Debug parsed CSV data
  
          const error = validateCsv(rows, file.name);
          if (error) {
            console.log("CSV Validation Error:", error); // Debug validation error
            setModalMessage(error[file.name]);
            setShowModal(true);
          } else {
            setShowProgress(true);
            simulateUpload();
            setTimeout(() => {
              saveToBackend(rows);
            }, 2000);
          }
        },
        skipEmptyLines: true,
      });
    };
  
    reader.readAsText(file);
  };
  
  

  const saveToBackend = async (csvData) => {
    if (csvData.length > 0) {
      const csvJSONData = parseCSVData(csvData);
      if (csvJSONData.length > 0) {
        try {
          const response = await fetch("http://192.168.2.11:3004/leadManagement/uploadLeadFromCsv", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(csvJSONData),
          });
  
          console.log("Raw API Response:", response);
  
          const result = await response.json(); // Ensure we correctly parse the response
          console.log("Parsed API Response:", result);
  
          if (response.ok) {
            setModalMessage(result.message || "CSV files imported successfully!");
          } else {
            setModalMessage(result.message || "An error occurred while uploading.");
          }
        } catch (error) {
          console.error("Upload error:", error);
          setModalMessage("An error occurred while uploading.");
        } finally {
          setShowProgress(false); // Ensure progress UI is hidden after completion
          setShowModal(true);
        }
      }
    }
  };
  

  const parseCSVData = (csvString) => {
    const headers = csvString[0];
    return csvString.slice(1).map((row) => {
      let obj = {};
      headers.forEach((key, index) => {
        obj[key] = row[index];
      });
      return obj;
    });
  };

  const handleDownloadSample = () => {
    const sampleCsvUrl = "./TemplateCSVUpload.csv";
    window.open(sampleCsvUrl, "_blank");
  };

  useEffect(() => {
    const loadCampaignNameData = async () => {
      try {
        const data = await fetchCampaignNameDetails(userid);
        setCampaigns(data?.data?.campaigns || []);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };
    loadCampaignNameData();
  }, []);

  const handleCampaignChange = (e) => {
    setSelectedCampaign(e.target.value);
    setFile(null); // Reset file selection when changing the campaign
    setShowProgress(false); // Hide progress UI if switching campaigns
    setUploadProgress(0); // Reset upload progress
  };
  

  return (
    <div className="container">
      {/* Campaign Name Display */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Campaign Name </label>
          <select
            className="form-select"
            name="campaignSelection"
            onChange={handleCampaignChange}
          >
            <option value="">Select a Campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.campaign_id} value={campaign.campaign_id}>
                {campaign.campaign_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show File Upload Section Only When a Campaign is Selected */}
      {selectedCampaign && (
        <div className="row d-flex justify-content-center mt-5">
          <div className="col-md-4 mb-3 file-upload text-center p-5 bg-light rounded uploadbox">
            {/* File Selection UI */}
            {!file && (
              <>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  hidden
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="btn">
                  <FontAwesomeIcon icon={faCloudArrowUp} size="3x" style={{ color: "blue" }} />
                </label>
                <p className="text-muted">Drag & drop or click to choose files</p>
              </>
            )}

            {/* Show Progress UI when Upload is in progress */}
            {showProgress && (
              <>
                <FontAwesomeIcon icon={faCloudArrowUp} size="2x" />
                <p>{file.name}</p>
                <p className="text-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
                </>
            )}
          </div>

          <p className="small text-center text-muted">
            Supported formats: CSV &nbsp; | &nbsp; Max: 25MB
          </p>
          {/* Upload Button */}
          {file && !showProgress && (
            <div className="text-center mt-3">
              <button className="uploadbutton" onClick={handleUpload}>
                Upload
              </button>
            </div>
          )}
        </div>
      )}

      
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Body className="text-center p-4">
      {modalMessage?.trim() === "CSV files imported successfully!" ? (
          <img src="/greentick.gif" alt="Success" width="103" height="103" />
        ) : (
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size="3x"
            style={{ color: "#7a0014" }}
          />
        )}

        <h5
          className="text-lg font-semibold mt-3"
          style={{ color: "#671E75" }}
        >
          {modalMessage || "Something went wrong."}
        </h5>

        <button
          className="mt-4 px-4 py-2 rounded-lg text-white"
          onClick={() => setShowModal(false)}
          style={{
            backgroundColor: "#671E75",
            border: "none",
            color: "#FFFFFF",
          }}
        >
          OK
        </button>
      </Modal.Body>
    </Modal>

    </div>
  );
};

export default UploadCsv;
