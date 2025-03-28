import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { fetchCampaignNameDetails } from "./UploadCsvservice.js";
import "./UploadCsv.css";

const UploadCsv = () => {
  const userid = sessionStorage.getItem("UserID");
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [modalMessage, setModalMessage] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showProgress, setShowProgress] = useState("");
  const navigate = useNavigate();

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
    const campaignName = e.target.value;
    setSelectedCampaign(campaignName);
    setFile(null);
    setUploadProgress(0);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }

    setFiles([...event.target.files]);

    setErrorMessages({}); // Clear previous errors
    setShowProgress(false); // Hide progress initially
    setUploadProgress(0); // Reset progress bar
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

  const parseCSVData = (csvString, selectedCampaign) => {
    try {
      const parsedData = csvString;
      const csvContent = parsedData[0]?.data;

      if (!csvContent || csvContent.length < 2) {
        console.error("Invalid CSV format");
        return [];
      }

      // Extract headers and ensure "campaign_id" exists
      let headers = [...csvContent[0]];
      if (!headers.includes("campaign_id")) {
        headers.push("campaign_id");
      }

      console.log("Selected Campaign ID:", selectedCampaign);

      // Convert remaining rows into JSON objects
      const jsonData = csvContent.slice(1).map((row) => {
        let obj = {};
        headers.forEach((key, idx) => {
          obj[key] = row[idx] || null;
        });

        // **Directly Assign campaign_id from selectedCampaign**
        obj["campaign_id"] = selectedCampaign;

        return obj;
      });

      console.log("Final Parsed Data:", jsonData);
      return jsonData;
    } catch (error) {
      console.error("Error parsing CSV data:", error);
      return [];
    }
  };

  const validateCsv = (data, fileName) => {
    if (data.length === 1) {
      return { [fileName]: "CSV file is empty." };
    }

    // Extract headers
    const headers = data[0].map((header) => header.trim());

    // Required headers, including "campaign_id"
    const requiredHeaders = ["campaign_id", "created_by", "leadChannel"];

    // Ensure required headers exist
    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
      return {
        [fileName]: `Missing required headers: ${missingHeaders.join(", ")}`,
      };
    }

    return null; // No errors
  };

  // uploads in backend
  const handleUpload = async () => {
    if (files.length === 0) {
      setModalMessage("Please select at least one CSV file before uploading.");
      setShowModal(true);
      return;
    }
    // Validate CSV before starting the upload process
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      const csvText = target.result;
      Papa.parse(csvText, {
        complete: (result) => {
          const rows = result.data;
          const error = validateCsv(rows, file.name);
          if (error) {
            setErrorMessages(error);
            setModalMessage(Object.values(error)[0]); // Display the first error message
            setShowModal(true);
            return;
          } else {
            setShowProgress(true);
            simulateUpload();
            setTimeout(() => {
              saveToBackend([{ fileName: file.name, data: rows }]);
            }, 2000);
          }
        },
        skipEmptyLines: true,
      });
    };
    reader.readAsText(file);
  };

  const saveToBackend = async (validData) => {
    setIsUploading(true);
    setUploadProgress(0);
    setShowProgress(true);

    let csvJSONData = parseCSVData(validData, selectedCampaign);

    if (
      csvJSONData.some(
        (item) => item.campaign_id === "Unknown" || !item.campaign_id
      )
    ) {
      setModalMessage("Error: Campaign ID is missing or invalid.");
      setShowModal(true);
      return;
    }

    console.log("Uploading Data:", csvJSONData);

    if (csvJSONData.length > 0) {
      try {
        const response = await fetch(
          "http://192.168.2.11:3004/leadManagement/uploadLeadFromCsv",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(csvJSONData),
          }
        );

        const result = await response.json();

        setTimeout(() => {
          if (response.ok) {
            console.log("Data successfully saved:", result);
            setModalMessage(result.message || "Leads Uploaded Successfully");
          } else {
            console.error("Error saving data:", result);

            // Extract error message from response
            let errorMessages =
              result.Data?.map((item) => item.errorMessage).join("\n") ||
              result.details ||
              "An error occurred.";

            setModalMessage(`Error: ${errorMessages}`);
          }
          setShowModal(true);
        }, 1500);
      } catch (error) {
        console.error("API error:", error);
        setModalMessage("An error occurred while saving data.");
        setShowModal(true);
      }
    } else {
      setModalMessage("An error occurred while generating JSON data.");
      setShowModal(true);
    }
  };

  // samplefile download
  const handleDownloadSample = () => {
    const sampleCsvUrl = "./TemplateCSVUpload.csv";
    window.open(sampleCsvUrl, "_blank");
  };

  const formatFileSize = (size) => {
    if (size < 1024) {
      return `${size} B`; // Bytes
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`; // Kilobytes
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`; // Megabytes
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (
      modalMessage?.trim().toLowerCase() === "all leads inserted successfully"
    ) {
      navigate("/LeadSummary");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">
            Campaign Name<span className="text-danger">*</span>
          </label>
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

        <div className="col-md-6 text-end mb-3 mt-4">
          <button
            type="button"
            onClick={handleDownloadSample}
            className="btn downloadsamplebtn" // added by ankita tank on 5mar25 According to User Role hide show module
          >
            Download Sample
          </button>
        </div>
      </div>

      {selectedCampaign && (
        <div className="row d-flex justify-content-center mt-5">
          <div className="col-md-4 mb-3 file-upload text-center p-5 bg-light rounded uploadbox">
            {file ? (
              <>
                <div className="file-info d-flex align-items-center">
                  <img
                    src="/fileupload.png"
                    style={{ height: "65px", width: "65px" }}
                    alt="File Upload"
                  />
                  <div className="ml-5 text-center d-flex flex-column">
                    <p className="text-muted mb-1">
                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                      {file.name}
                    </p>
                    <p className="text-muted">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                {/* Show Progress UI when Upload is in progress */}
                {showProgress && (
                  <>
                    <div className="col-md-6 progress mt-5">
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
              </>
            ) : (
              <>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  hidden
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="btn bg-transparent filechoose"
                >
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    size="3x"
                    style={{ color: "#0066FF" }}
                  />
                </label>
                <p className="text-muted">
                  Drag & drop or click to choose files
                </p>
              </>
            )}
          </div>
          <p className="small text-center text-muted">
            Supported formats: .csv &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; Max: 25MB
          </p>

          <div className="text-center mt-3">
            <button
              className="uploadbutton"
              onClick={handleUpload}
              disabled={showProgress} // Disable button when uploading
              style={{
                opacity: showProgress ? 0.6 : 1,
                cursor: showProgress ? "not-allowed" : "pointer",
              }}
            >
              {showProgress ? "Upload" : "Upload"}
            </button>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center p-4">
          {modalMessage
            ?.trim()
            .toLowerCase()
            .includes("all leads inserted successfully") ? (
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
            onClick={() => {
              setShowModal(false);
              setUploadProgress(0);
              handleModalClose();
            }}
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
