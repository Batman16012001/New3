import React, { useEffect, useState } from "react";
import { fetchFields, saveForm } from "./LeadFormGenerationService";
import { Form, Button, Card, Row, Col, Table, Modal } from "react-bootstrap";
import "./LeadFormGeneration.css";
import { FaDownload } from "react-icons/fa";
import {
  setcommingfrom,
  setleadformentry,
  setLeadFormName,
} from "../../store/campaignSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import store from "../../store/store";
import { fetchLeadFormSummaryDetails } from "../LeadFormSummary/LeadFormSummaryService";
import CommonModal from "../../CommonModal/CommonModal";
import {
  FaEye,
  FaPlus,
  FaAngleLeft,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUserCircle,
  FaFileCsv,
} from "react-icons/fa";

const LeadFormGeneration = () => {
  const [availableFields, setAvailableFields] = useState([]);
  const [addedFields, setAddedFields] = useState([]);
  const [formName, setFormName] = useState("");
  const [latestState, setlatestState] = useState();
  const [showPreview, setShowPreview] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [leadForms, setleadForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [previewdone, setpreviewdone] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [message, setmessage] = useState("");
  const [NextRoute, setNextRoute] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [apistatus, setapistatus] = useState();
  const [onloadData, setonloadData] = useState([]);
  // const [mandatoryFields, setMandatoryFields] = useState([]);
  //   const [addedFields, setAddedFields] = useState([]);

  const commingfromleadorcampaign = useSelector(
    (state) => state.campaign.commingfromleadorcampaign
  );

  useEffect(() => {
    const loadFields = async () => {
      try {
        const data = await fetchFields();
        console.log("Raw API Response:", data.data);
        setonloadData(data);

        if (Object.keys(data.data).length > 0) {
          //const formObject = data.data[0]; // Get first object in array

          // const extractedFields = Object.entries(data.data).map(
          //   ([key, field]) => ({
          //     id: field.id,
          //     text: field.text,
          //     datatype: field.datatype,
          //     required: field.required,
          //     regex: field.regex || "",
          //     options: field.options || [], // Ensure options are provided
          //     isEceylife: field.isEceylife,
          //     isVisibleLMS: field.isVisibleLMS,
          //     errorRegex: field.errorRegex,
          //     errorMandatory: field.errorMandatory,
          //   })
          // );

          const extractedFields = Object.entries(data.data)
            .map(([key, field]) => ({
              id: field.id,
              text: field.text,
              datatype: field.datatype,
              required: field.required,
              regex: field.regex || "",
              options: field.options || [],
              isEceylife: field.isEceylife,
              isVisibleLMS: field.isVisibleLMS,
              errorRegex: field.errorRegex,
              errorMandatory: field.errorMandatory,
            }))
            .filter((field) => field.isVisibleLMS !== "no");

          console.log("Transformed Fields:", extractedFields);
          setAvailableFields(extractedFields);

          // const autoSelectFields = extractedFields.filter(
          //   (field) =>
          //     field.id === "select_campaign" ||
          //     field.id === "last_name" ||
          //     field.id === "mobile_no"
          // );

          const autoSelectFields = extractedFields
            .filter(
              (field) =>
                field.id === "select_campaign" ||
                field.id === "last_name" ||
                field.id === "mobile_no"
            )
            .map((field) => ({
              ...field,
              required: "yes",
            }));

          setAddedFields(autoSelectFields);
        }
      } catch (error) {
        console.error("Error fetching fields:", error);
      }

      try {
        const availableForms = await fetchLeadFormSummaryDetails();
        console.log("Available Fields::::", availableForms);
        setleadForms(availableForms);
      } catch (e) {
        console.log("Error while calling API:::", e);
      }
    };

    loadFields();
  }, []);

  const TextField = ({
    label,
    name,
    required,
    regex,
    disabled,
    isEceylife,
    errorRegex,
    errorMandatory,
  }) => {
    const [error, setError] = useState("");

    const handleBlur = (e) => {
      const value = e.target.value;
      if (regex && !new RegExp(regex).test(value)) {
        setError(`Please enter valid input`);
      } else {
        setError("");
      }
    };

    return (
      <Form.Group as={Col} xs={12} md={6} className="mb-3">
        <Form.Label className="fw-bold">{label}</Form.Label>
        <Form.Control
          type="text"
          name={name}
          required={required === "yes"}
          pattern={regex || undefined}
          className="styled-input"
          onBlur={handleBlur}
          disabled={disabled}
          isEceylife={isEceylife}
          errorRegex={errorRegex}
          errorMandatory={errorMandatory}
        />
        {error && <div className="text-danger">{error}</div>}
      </Form.Group>
    );
  };

  const EmailField = ({ label, name, required, regex, disabled }) => {
    const [error, setError] = useState("");

    const handleBlur = (e) => {
      const value = e.target.value;
      if (regex && !new RegExp(regex).test(value)) {
        setError(`Invalid input`);
      } else {
        setError("");
      }
    };

    return (
      <Form.Group as={Col} xs={12} md={6} className="mb-3">
        <Form.Label className="fw-bold">{label}</Form.Label>
        <Form.Control
          type="email"
          name={name}
          required={required === "yes"}
          pattern={regex || undefined}
          className="styled-input"
          onBlur={handleBlur}
          disabled={disabled}
        />
        {error && <div className="text-danger">{error}</div>}
      </Form.Group>
    );
  };

  const NumberField = ({ label, name, required, regex, disabled }) => {
    const [error, setError] = useState("");

    const handleBlur = (e) => {
      const value = e.target.value;
      if (regex && !new RegExp(regex).test(value)) {
        setError(`Invalid input`);
      } else {
        setError("");
      }
    };

    return (
      <Form.Group as={Col} xs={12} md={6} className="mb-3">
        <Form.Label className="fw-bold">{label}</Form.Label>
        <Form.Control
          type="number"
          name={name}
          required={required === "yes"}
          className="styled-input"
          onBlur={handleBlur}
          disabled={disabled}
        />
        {error && <div className="text-danger">{error}</div>}
      </Form.Group>
    );
  };

  const DateField = ({ label, name, required, disabled }) => {
    const [error, setError] = useState("");

    const handleBlur = (e) => {
      const value = e.target.value;
      if (!value) {
        setError(`Please select a valid input`);
      } else {
        setError("");
      }
    };

    return (
      <Form.Group as={Col} xs={12} md={6} className="mb-3">
        <Form.Label className="fw-bold">{label}</Form.Label>
        <Form.Control
          type="date"
          name={name}
          required={required === "yes"}
          className="styled-input"
          onBlur={handleBlur}
          disabled={disabled}
        />
        {error && <div className="text-danger">{error}</div>}
      </Form.Group>
    );
  };

  const TimeField = ({ label, name, required, disabled }) => {
    const [error, setError] = useState("");

    const handleBlur = (e) => {
      const value = e.target.value;
      if (!value) {
        setError(`Please select a valid time`);
      } else {
        setError("");
      }
    };

    return (
      <>
        <Form.Group as={Col} xs={12} md={6} className="mb-3">
          <Form.Label className="fw-bold">{label}</Form.Label>
          <Form.Control
            type="time"
            name={name}
            required={required === "yes"}
            className="styled-input"
            disabled={disabled}
            onBlur={handleBlur}
          />
          {error && <div className="text-danger">{error}</div>}
        </Form.Group>
      </>
    );
  };

  const SelectField = ({ label, name, required, options = [], disabled }) => {
    const [error, setError] = useState("");

    const handleBlur = (e) => {
      if (required === "yes" && !e.target.value) {
        setError(`Please select a valid input`);
      } else {
        setError("");
      }
    };

    return (
      <Form.Group as={Col} xs={12} md={6} className="mb-3">
        <Form.Label className="fw-bold">{label}</Form.Label>
        <Form.Select
          name={name}
          required={required === "yes"}
          className="styled-input"
          onBlur={handleBlur}
          disabled={disabled}
        >
          <option value="">Select</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </Form.Select>
        {error && <div className="text-danger">{error}</div>}
      </Form.Group>
    );
  };

  const UrlField = ({ label, name, required, regex }) => {
    const [error, setError] = useState("");

    const handleBlur = (e) => {
      const value = e.target.value;
      const urlRegex =
        regex ||
        "^(https?:\\/\\/)?([\\w\\d-]+\\.)+[\\w-]{2,4}(:\\d+)?(\\/.*)?$";

      if (value && !new RegExp(urlRegex).test(value)) {
        setError(`Invalid URL format`);
      } else {
        setError("");
      }
    };

    return (
      <Form.Group as={Col} xs={12} md={6} className="mb-3">
        <Form.Label className="fw-bold">{label}</Form.Label>
        <Form.Control
          type="url"
          name={name}
          required={required === "yes"}
          className="styled-input"
          onBlur={handleBlur}
        />
        {error && <div className="text-danger">{error}</div>}
      </Form.Group>
    );
  };

  const componentsMap = {
    text: TextField,
    email: EmailField,
    number: NumberField,
    date: DateField,
    select: SelectField,
    url: UrlField,
    time: TimeField,
  };

  const handleCheckboxChange = (fieldId, type) => {
    setAddedFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId
          ? { ...field, required: field.required === type ? "" : type }
          : field
      )
    );
  };

  const handleSave = async () => {
    try {
      // Trim and check if formName is empty
      if (!formName.trim()) {
        setErrorMessage("Please provide a form name before saving.");
        return; // Stop execution here
      } else {
        setErrorMessage(""); // Clear error if form name is valid
      }

      // Call API only if formName is present
      const response = await saveForm(formName, addedFields);
      console.log("Response::::", response);
      setapistatus(response.status);

      // Store lead form ID in sessionStorage
      sessionStorage.setItem("leadFormId", response.data.lead_form_ID);

      // Check if API response is successful
      if (response.status === "success") {
        setModalType("save");
        setModalOpen(true);
        setmessage("Form Saved Successfully");
      }

      // Get latest state from Redux store
      var latestState = store.getState().campaign.commingfromleadorcampaign;
      setlatestState(latestState);
      console.log("commingfromleadsummary:", latestState);

      // Determine next route based on state
      const nextRoute =
        latestState === "campaign"
          ? "/createcampaignForm"
          : "/leadsformsummary";
      setNextRoute(nextRoute);
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  const handleFormChange = (e) => {
    const formName = e.target.value;
    setSelectedForm(formName);

    const selectedFormData = leadForms.find(
      (form) => form.lead_form_name === formName
    );

    if (selectedFormData) {
      // Parse lead_form_JSON and extract field IDs
      const parsedFields = JSON.parse(selectedFormData.lead_form_JSON);
      setAddedFields(parsedFields); // Set fields that need to be checked
    } else {
      setAddedFields([]);
      if (Object.keys(onloadData.data).length > 0) {
        //const formObject = data.data[0]; // Get first object in array

        // const extractedFields = Object.entries(data.data).map(
        //   ([key, field]) => ({
        //     id: field.id,
        //     text: field.text,
        //     datatype: field.datatype,
        //     required: field.required,
        //     regex: field.regex || "",
        //     options: field.options || [], // Ensure options are provided
        //     isEceylife: field.isEceylife,
        //     isVisibleLMS: field.isVisibleLMS,
        //     errorRegex: field.errorRegex,
        //     errorMandatory: field.errorMandatory,
        //   })
        // );

        const extractedFields = Object.entries(onloadData.data)
          .map(([key, field]) => ({
            id: field.id,
            text: field.text,
            datatype: field.datatype,
            required: field.required,
            regex: field.regex || "",
            options: field.options || [],
            isEceylife: field.isEceylife,
            isVisibleLMS: field.isVisibleLMS,
            errorRegex: field.errorRegex,
            errorMandatory: field.errorMandatory,
          }))
          .filter((field) => field.isVisibleLMS !== "no");

        console.log("Transformed Fields:", extractedFields);
        setAvailableFields(extractedFields);

        // const autoSelectFields = extractedFields.filter(
        //   (field) =>
        //     field.id === "select_campaign" ||
        //     field.id === "last_name" ||
        //     field.id === "mobile_no"
        // );

        const autoSelectFields = extractedFields
          .filter(
            (field) =>
              field.id === "select_campaign" ||
              field.id === "last_name" ||
              field.id === "mobile_no"
          )
          .map((field) => ({
            ...field,
            required: "yes",
          }));

        setAddedFields(autoSelectFields);
      }
    }
  };
  const togglePreview = () => {
    setpreviewdone(true);
    setShowPreview(!showPreview);
  };

  return (
    <div className="container">
      <div className="row">
        {/* <div className="col-12 col-md-8">
          <h4 className="mt-3 mb-2 fw-medium" style={{ color: "#314363" }}>
            <FaAngleLeft
              style={{
                fontSize: "1.8em",
                color: "#314363",
                marginRight: "10px",
              }}
              onClick={() => navigate("/leadsformsummary")}
            />
            Lead Form Generation
          </h4>
        </div> */}

        {/* <div className="col-12 col-md-4 d-flex align-items-center justify-content-end mt-3 mb-4">
          <div className="d-flex align-items-center">
            <div className="ms-3 me-3 text-end">
              <p className="mb-0 fw-bold">Ravi Sutharsan</p>
              <p className="mb-0">Campaign Manager</p>
            </div>
            <FaUserCircle style={{ fontSize: "2.5em", color: "#314363" }} />
          </div>
        </div> */}
      </div>
      {/* Lead Form Generation */}
      <div className="row p-3">
        <div className="col-md-6 selectleads">
          <Form.Group>
            <div className="row">
              <div className="col-12">
                <Form.Label style={{ color: "#314363" }}>
                  Lead Form Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    const value = e.target.value;
                    const regex = /^[A-Za-z][A-Za-z\s]*$/; // Ensures first character is a letter, then allows letters and spaces

                    if (regex.test(value) || value === "") {
                      setFormName(value);
                      setErrorMessage(""); // Clear error when valid
                    } else {
                      setErrorMessage(
                        "Lead form name should not include spaces or special characters"
                      );
                    }
                  }}
                  placeholder="Enter form name"
                  style={{
                    border: "2px solid #314363",
                    color: "#314363",
                    wordWrap: "break-word",
                  }}
                  maxLength={50}
                  isInvalid={!!errorMessage}
                />
                <Form.Control.Feedback type="invalid">
                  {errorMessage}
                </Form.Control.Feedback>
              </div>
            </div>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label style={{ color: "#314363" }}>
              Select Base Form
            </Form.Label>
            <Row>
              <Col md={12}>
                <Form.Select
                  className="mb-1"
                  value={selectedForm}
                  onChange={handleFormChange}
                  style={{ border: "2px solid #314363", color: "#314363" }}
                >
                  <option value="">Select a Lead Form</option>
                  {leadForms.map((form) => (
                    <option key={form.lead_form_ID} value={form.lead_form_name}>
                      {form.lead_form_name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>

          <Card.Header style={{ color: "#314363" }} className="mt-3">
            Available Lead Form Fields
          </Card.Header>
          <Col md={12}>
            <Card
              style={{
                border: "2px solid #314363",
                borderRadius: "10px",
                // height: "400px",
              }}
            >
              <Card.Body>
                <Row>
                  {availableFields.map((field) => (
                    <Col md={6} key={field.id} className="mb-2">
                      <Form.Check
                        style={{ color: "#314363" }}
                        type="checkbox"
                        label={field.text}
                        checked={addedFields.some((f) => f.id === field.id)}
                        disabled={
                          field.id === "select_campaign" ||
                          field.id === "last_name" ||
                          field.id === "mobile_no"
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAddedFields([...addedFields, field]);
                          } else {
                            setAddedFields(
                              addedFields.filter((f) => f.id !== field.id)
                            );
                          }
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </div>

        <div className="col-md-6 availableleads">
          {/* Selected Fields Form */}
          <Col md={12}>
            {addedFields.length > 0 ? (
              <Card
                className="p-3"
                style={{ backgroundColor: "#868AB11A", border: "none" }}
              >
                <Row>
                  {addedFields.map((field) => {
                    const Component =
                      componentsMap[field.datatype] || "form-input";
                    return (
                      <div className="col-md-6 mb-3">
                        <div>
                          <label style={{ color: "#314363" }}>
                            {field.text}
                          </label>
                          {field.datatype === "select" ? (
                            <select
                              className="form-select  w-100"
                              style={{ color: "#314363" }}
                              disabled
                            >
                              {field.options.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="form-control w-100"
                              disabled
                            />
                          )}
                          <div className="form-check mt-1">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={field.required === "yes"}
                              disabled={
                                field.id === "select_campaign" ||
                                field.id === "last_name" ||
                                field.id === "mobile_no"
                              }
                              style={{ color: "#314363" }}
                              onChange={() =>
                                handleCheckboxChange(field.id, "yes")
                              }
                            />
                            <label
                              className="form-check-label"
                              style={{ color: "#314363" }}
                            >
                              Required
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Row>
              </Card>
            ) : (
              <p className="text-muted"></p>
            )}
          </Col>
          <div className="fixed-bottom d-flex justify-content-end mb-4 me-3">
            <Button
              variant="secondary"
              className="red-outline-button me-5"
              style={{ width: "10%" }}
              onClick={togglePreview}
              disabled={addedFields.length === 0}
            >
              Preview
            </Button>
            <Button
              variant="success"
              className="bottombuttons me-5"
              style={{ width: "10%" }}
              onClick={handleSave}
              disabled={addedFields.length === 0 || !previewdone}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal show={showPreview} onHide={togglePreview} size="lg" centered>
        <Modal.Header closeButton className="modalHeader  text-white">
          <Modal.Title> Lead Creation </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Card className="shadow-sm p-3">
            <Card.Header
              className="d-flex flex-wrap justify-content-between align-items-center"
              style={{ backgroundColor: "#a21d1d" }}
            >
              <h5
                style={{
                  wordBreak: "break-word",
                  flex: "1 1 auto", // Allows resizing
                  minWidth: "0",
                }}
              >
                {formName || "Preview"}
              </h5>
              {/* <Button
                variant="light"
                onClick={handleDownload}
                style={{
                  backgroundColor: "#7A0114",
                  color: "#FFFFFF",
                  whiteSpace: "nowrap",
                }}
              >
                <FaDownload className="me-1" /> Download HTML
              </Button> */}
            </Card.Header>
            <Card.Body className="p-4 bg-light rounded shadow-sm">
              <Row className="gy-3">
                {addedFields.map((field) => {
                  const Component = componentsMap[field.datatype];
                  return Component ? (
                    <Col xs={12} md={6} key={field.id}>
                      <Form.Group
                        controlId={field.text.toLowerCase()}
                        className="mb-3"
                        style={{ textAlign: "left", width: "160%" }}
                      >
                        <Form.Label
                          className="fw-bold text-muted"
                          style={{ fontSize: "medium" }}
                        >
                          {field.text}
                          {field.required === "yes" && (
                            <span className="required-asterisk">*</span>
                          )}{" "}
                          {/* Only show if true */}
                        </Form.Label>

                        {field.datatype === "select" ? (
                          <SelectField
                            name={field.text.toLowerCase().replace(/\s+/g, "_")}
                            required={field.required}
                            options={field.options}
                            disabled
                          />
                        ) : (
                          <Component
                            className="form-control"
                            name={field.text.toLowerCase().replace(/\s+/g, "_")}
                            required={field.required} // Ensure required is passed for validation
                            disabled
                          />
                        )}
                      </Form.Group>
                    </Col>
                  ) : null;
                })}
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>

      <div>
        <CommonModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            if (latestState === "campaign") {
              dispatch(setLeadFormName(formName)); // Dispatch before navigation
            }
            if (NextRoute) {
              navigate(NextRoute); // Navigate only after modal closes
            }
          }}
          message={message}
          actionType={modalType}
          status={apistatus}
        />
      </div>
    </div>
  );
};

export default LeadFormGeneration;
