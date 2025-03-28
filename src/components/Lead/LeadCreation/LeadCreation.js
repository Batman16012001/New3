import React, { useState, useEffect } from "react";
import { useFormik, Formik, Form } from "formik";
import * as Yup from "yup";
import {
  fetchCampaignNameDetails,
  fetchFields,
  createLeadForm,
  updateLeadForm,
  getLeadDetails,
} from "./LeadCreationService.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faArrowLeft,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./LeadCreation.css";
import axios from "axios";

const LeadCreation = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [fields, setFields] = useState([]); // Store dynamic fields
  const userid = sessionStorage.getItem("UserID");
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage Modal
  const [message, setMessage] = useState("");
  const location = useLocation();
  const [leadData, setLeadData] = useState(location.state?.leadData || {});

  const navigate = useNavigate();
  const [navigateToSummary, setNavigateToSummary] = useState(false);
  const [branches, setBranches] = useState([]);
  const { leadID } = useParams();

  console.log("leadID from useParams:", leadID);

  const userRole = sessionStorage.getItem("UserRole");
  const jobTitle = sessionStorage.getItem("JobTitle");
  console.log("User Role and job title is a", userRole, jobTitle);
  const roleConfig = JSON.parse(
    sessionStorage.getItem("UserRoleBasedJson") || "{}"
  );
  console.log("Role Config", roleConfig);

  const canCreateLeadForm = roleConfig[userRole]?.Modules?.Leads?.CreateLead;
  console.log("Can Create Lead Form", canCreateLeadForm);

  useEffect(() => {
    const loadCampaignNameData = async () => {
      try {
        const data = await fetchCampaignNameDetails(userid);
        setCampaigns(data?.data?.campaigns || []);
        console.log("campaign name Data:", data);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }

      try {
        const response = await axios.get(
          "http://192.168.2.11:3002/configurableItems/getBranchByDistrict"
        );
        setBranches(response?.data?.data || []);
        // setBranches(response?.data?.data?.branch_name || []);
        console.log("Nearest branches:", response);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };

    const fetchLeadData = async () => {
      try {
        const data = await getLeadDetails(leadID);
        console.log("Lead Details:::", data);
        setLeadData(data);
      } catch (error) {
        console.error("Failed to load lead details");
      }
    };

    fetchLeadData();
    loadCampaignNameData();
  }, []);

  const fetchLeadFields = async (leadformid) => {
    try {
      const response = await fetch(
        `http://192.168.2.11:3003/leadFormManagement/getLeadFormJSON/${leadformid}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null); // Handle possible non-JSON error response
        throw new Error(
          errorData?.details ||
            `Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Lead Fields Data:", data); // Log fetched lead fields

      setFields(data?.data?.lead_form_JSON || []); // Store lead form fields
      setMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("Error fetching lead fields:", error.message);

      setMessage(
        error.message || "An error occurred while fetching campaign details."
      );
      setIsModalOpen(true);
      setFields([]);
    }
  };

  useEffect(() => {
    try {
      if (leadData.data?.campaign_id) {
        setSelectedCampaign(leadData.data?.campaign_id);
        console.log(
          "Selected campaign ID from leadData:",
          leadData.data.campaign_id
        );

        // Find the corresponding leadFormId dynamically
        const selectedCampaignData = campaigns?.find(
          (camp) => camp.campaign_id === leadData.data?.campaign_id
        );
        if (selectedCampaignData?.lead_form_id) {
          fetchLeadFields(selectedCampaignData.lead_form_id); // Fetch relevant form fields dynamically
        } else {
          console.error(
            "No lead form found for campaign ID:",
            leadData.data.campaign_id
          );
          setFields([]); // Clear fields if no matching campaign
        }
      }
    } catch (e) {
      console.log("Error in edit:::", e);
    }
  }, [leadData, campaigns]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (
      message?.trim().toLowerCase() === "lead created successfully" ||
      message?.trim().toLowerCase() === "lead updated successfully"
    ) {
      navigate("/LeadSummary");
    }
  };

  const handleCampaignChange = async (
    e,
    setFieldValue,
    setTouched,
    resetForm
  ) => {
    const selectedValue = e.target.value;
    console.log("Selected Campaign ID:", selectedValue);

    const selectedCampaignData = campaigns.find(
      (camp) => camp.campaign_id === selectedValue
    );

    if (!selectedCampaignData) {
      console.error("No campaign found for the selected ID:", selectedValue);
      return;
    }

    console.log("Selected Campaign Data:", selectedCampaignData);

    const leadFormId = selectedCampaignData.lead_form_id;
    const campaignName = selectedCampaignData.campaign_name;

    console.log("Lead Form ID:", leadFormId);
    console.log("Campaign Name:", campaignName);

    resetForm(); // This clears all the previous form values

    // Dynamically update campaign ID & name
    setFieldValue("campaignSelection", selectedValue);
    setFieldValue("select_campaign", campaignName);
    setTouched({ campaignSelection: true, select_campaign: true });

    if (leadFormId) {
      await fetchLeadFields(leadFormId);
    } else {
      setFields([]);
    }
  };

  const generateValidationSchema = (fields) => {
    let schema = {};

    fields.forEach((field) => {
      if (field.id === "select_campaign") {
        return; // Ignore select_campaign from validation
      }

      let validation = Yup.string(); // Default type

      // Apply Regex Validation first
      if (field.regex && field.errorMandatory) {
        validation = validation.matches(
          new RegExp(field.regex),
          field.errorMandatory || "Invalid format"
        );
      }

      // Apply Required Validation after Regex
      if (field.required === "yes" && field.errorMandatory) {
        validation = validation.required(
          field.errorMandatory || "This field is required"
        );
      }

      // Store validation in schema using api_key if available, else use field.id
      schema[field.api_key || field.id] = validation;
    });

    return Yup.object().shape(schema);
  };

  const validationSchema = generateValidationSchema(fields);

  const handleSubmit = async (e, values) => {
    console.log("Form Submitted:", values);

    // Map dynamic fields
    const mappedValues = fields.reduce((acc, field) => {
      const key = field.api_key || field.id;
      acc[field.text.toLowerCase().replace(/\s/g, "_")] = values[key] || "";
      return acc;
    }, {});

    mappedValues.select_campaign = values.select_campaign || "";

    console.log("Mapped Values:", mappedValues);

    try {
      let response;
      let messageText = "";
      let selectedValue = values.campaignSelection; // Use Formik values

      if (leadData?.data?.lead_id) {
        // Editing an existing lead
        const editPayload = {
          lead_id: leadData.data.lead_id,
          modified_by: values.modified_by || "000001",
          current_stage: values.current_stage || "GA",
          stage_remarks: values.stage_remarks || "Follow up",
          sub_stage: values.sub_stage || "Not interested",
          allocation: values.allocation || "",
          title: values.title || "",
          first_name: values.first_name || "",
          last_name: values.last_name || "",
          name_with_initials: values.name_with_initials || "",
          mobile_no: values.mobile_no?.toString() || "",
          home_number: values.home_number?.toString() || "",
          email_id: values.email_id || "",
          nic_number: values.nic_number?.toString() || "",
          line1: values.line1 || "",
          line2: values.line2 || "",
          line3: values.line3 || "",
          dob: values.dob || "",
          marital_status: values.marital_status || "",
          monthly_income: values.monthly_income?.toString() || "",
          remarks: values.remarks || "",
          nearest_branch: values.nearest_branch || "",
          term: values.term || "",
          spouse_NIC_number: values.spouse_NIC_number?.toString() || "",
          district: values.district || "",
          occupation: values.occupation || "",
          type_product: values.type_product || "",
          gender: values.gender || "",
          educational_qualification: values.educational_qualification || "",
          select_campaign: values.campaign_name || "",
        };

        console.log("Edit Payload:", editPayload);
        response = await updateLeadForm(editPayload);
        messageText = response.message || "Lead Updated Successfully";
      } else {
        // Creating a new lead
        const createPayload = {
          campaign_id: selectedValue,
          created_by: values.created_by || "000001",
          lead_channel: values.lead_channel || "LMS",
          lead_source: jobTitle === "brokers" ? "Broker" : "HeadOffice",
          // lead_source: values.lead_source || "Broker",
          select_campaign: values.select_campaign || "",
          title: values.title || "",
          name_with_initials: values.name_with_initials || "",
          first_name: values.first_name || "",
          last_name: values.last_name || "",
          mobile_no: values.mobile_no?.toString() || "",
          home_number: values.home_number?.toString() || "",
          email_id: values.email_id || "",
          nic_number: values.nic_number?.toString() || "",
          line1: values.line1 || "",
          line2: values.line2 || "",
          line3: values.line3 || "",
          dob: values.dob || "",
          marital_status: values.marital_status || "",
          monthly_income: values.monthly_income?.toString() || "",
          remarks: values.remarks || "",
          allocation: values.allocation || "",
          nearest_branch: values.nearest_branch || "",
          term: values.term || "",
          spouse_NIC_number: values.spouse_NIC_number?.toString() || "",
          district: values.district || "",
          occupation: values.occupation || "",
          type_product: values.type_product || "",
          gender: values.gender || "",
          educational_qualification: values.educational_qualification || "",
        };

        console.log("Create Payload:", createPayload);
        response = await createLeadForm(createPayload);
        messageText = response.message || "Lead Created Successfully";
      }

      console.log("API Response:", response);
      setMessage(messageText);
      setIsModalOpen(true);
      setNavigateToSummary(true);
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        error.message || "Failed to process request. Please try again."
      );
      setIsModalOpen(true);
    }
  };

  const getMaxDateForField = (id) => {
    const today = new Date();

    if (id === "dob") {
      // For DOB, max should be 18 years old
      today.setFullYear(today.getFullYear() - 18);
    }

    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const getMinDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 80); // Min 80 years old
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const handleDateChange = (e, id) => {
    const { name, value } = e.target;
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time for comparison

    let isValid = true;

    if (id === "dob") {
      const maxDob = new Date();
      maxDob.setFullYear(maxDob.getFullYear() - 18);

      if (selectedDate > maxDob) {
        isValid = false;
        setMessage(
          "Date of birth cannot be in the future or less than 18 years old."
        );
        setIsModalOpen(true);
      }
    } else {
      if (selectedDate > today) {
        isValid = false;
        setMessage("Future dates are not allowed.");
        setIsModalOpen(true);
      }
    }

    if (isValid) {
      e.target.value = value;
    } else {
      e.target.value = ""; // Reset invalid date
    }
  };

  const handleNumberValidation = async (e, setFieldError, setFieldValue) => {
    const { name, value } = e.target;

    if (!value) return; // Skip validation if empty

    // Validation rules
    const validations = {
      mobile_no: {
        regex: /^[0-9]{10,15}$/, // Mobile: 10-15 digits
        error: "Mobile number must be between 10 and 15 digits.",
        apiKey: "mobile_number",
      },
      nic_number: {
        regex: /^[0-9]{9,12}$/, // NIC: 9-12 digits
        error: "NIC number must be between 9 and 12 digits.",
        apiKey: "nic_number",
      },
    };

    const fieldValidation = validations[name];

    if (!fieldValidation) return; // Skip if no validation rule found

    // 1. **Local Validation (Before API Call)**
    if (!fieldValidation.regex.test(value)) {
      setFieldError(name, fieldValidation.error);
      return;
    }

    // 2. **API Request**
    try {
      const params = new URLSearchParams();
      params.append(fieldValidation.apiKey, value);

      const response = await fetch(
        `http://192.168.2.11:3004/leadManagement/validateDuplicate?${params.toString()}`
      );

      const data = await response.json(); // Convert response to JSON

      if (!response.ok) {
        // Extract and show API error messages correctly
        const apiErrorMessage = data.message || "Invalid input format.";
        setFieldError(name, apiErrorMessage);
        setFieldValue(name, "");
        setMessage(apiErrorMessage);
        setIsModalOpen(true);
        return;
      }

      // **Check if it's a duplicate record**
      if (
        data.status === "failed" &&
        data.duplicateFields?.includes(fieldValidation.apiKey)
      ) {
        setFieldError(name, data.message || "Duplicate record found");
        setFieldValue(name, "");
        setMessage(data.message || "Duplicate record found");
        setIsModalOpen(true);
      } else {
        setFieldError(name, ""); // Clear error if valid
      }
    } catch (error) {
      console.error("Validation error:", error);

      // **Handle API Errors & Network Issues**
      const errorMessage =
        error.message || "Validation error. Please try again.";
      setFieldError(name, errorMessage);
      setMessage(errorMessage);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="container">
      <Formik
        initialValues={{
          campaignSelection: leadData.data?.campaign_id || "",
          select_campaign: leadData.data?.campaign_name || "",
          title: leadData.data?.title || "", // Explicitly mapped
          name_with_initials: leadData.data?.initials || "",
          first_name: leadData.data?.first_name || "",
          last_name: leadData.data?.last_name || "",
          email_id: leadData.data?.email || "",
          nic_number: leadData.data?.nic || "", // Handle inconsistent field names
          spouse_NIC_number: leadData.data?.spouse_nic || "",
          line1: leadData.data?.address_line1 || "",
          line2: leadData.data?.address_line2 || "",
          line3: leadData.data?.address_line3 || "",
          marital_status: leadData.data?.marital_status || "",
          monthly_income: leadData.data?.monthly_income || "",
          occupation: leadData.data?.occupation || "",
          district: leadData.data?.district || "",
          type_product: leadData.data?.product_type || "",
          educational_qualification:
            leadData.data?.educational_qualification || "",
          gender: leadData.data?.gender || "",
          mobile_no: leadData.data?.mobile_no || "",
          allocation: leadData.data?.so_code || "",
          home_number: leadData.data?.home_no || "",
          dob: leadData.data?.dob || "",
          nearest_branch: leadData.data?.nearest_branch || "",
          remarks: leadData.data?.remark || "",
          term: leadData.data?.term || "",
          // Add only if leadData exists and has lead_id
          ...(leadData?.data?.lead_id && {
            stage: leadData.data?.current_stage || "",
            sub_stage: leadData.data?.sub_stage || "",
            stage_remarks: leadData.data?.stage_remarks || "",
          }),
          ...fields.reduce((acc, field) => {
            const fieldName = field.api_key || field.id;
            acc[fieldName] = leadData.data?.[fieldName] || "";
            return acc;
          }, {}),
        }}
        validateOnBlur={true}
        validateOnChange={true}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Formik values on submit:", values); // Check if values exist
          handleSubmit(values);
        }}
      >
        {({
          errors,
          touched,
          handleChange,
          handleBlur,
          values,
          setFieldValue,
          setTouched,
          setFieldError,
          resetForm,
        }) => (
          <Form className="leadfieldsheight hidden-scroll">
            {/* Campaign Selection Dropdown */}
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Select Campaign<span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                name="campaignSelection"
                value={values.campaignSelection}
                onChange={(e) => {
                  setFieldValue("campaignSelection", e.target.value);
                  handleCampaignChange(e, setFieldValue, setTouched, resetForm);
                }}
                onBlur={handleBlur}
                disabled={leadData && leadData.data && leadData.data.lead_id} // Disable if leadData exists
              >
                <option value="">Select a Campaign</option>
                {campaigns.map((campaign) => (
                  <option
                    key={campaign.campaign_id}
                    value={campaign.campaign_id}
                  >
                    {campaign.campaign_name}
                  </option>
                ))}
              </select>
              {touched.campaignSelection && errors.campaignSelection && (
                <div className="text-danger">{errors.campaignSelection}</div>
              )}
            </div>

            {/* Conditionally Render Fields Only If a Campaign Is Selected */}
            {values.campaignSelection && (
              <div className="row mt-4">
                {fields.map((field) =>
                  field.api_key !== "select_campaign" &&
                  field.id !== "select_campaign" ? (
                    <div className="col-md-6 mb-3" key={field.id}>
                      <label className="form-label">
                        {field.text}
                        {field.required === "yes" && (
                          <span className="text-danger">*</span>
                        )}
                      </label>

                      {(field.datatype === "number" ||
                        field.datatype === "text") && (
                        <input
                          type={field.datatype}
                          className={`form-control ${
                            errors[field.api_key || field.id] &&
                            touched[field.api_key || field.id]
                              ? "is-invalid"
                              : ""
                          }`}
                          name={field.api_key || field.id}
                          value={values[field.api_key || field.id] || ""}
                          onChange={(e) => {
                            handleChange(e);
                            handleNumberValidation(
                              e,
                              setFieldError,
                              setFieldValue
                            );
                          }}
                          onBlur={(e) => {
                            let value = e.target.value
                              .replace(/\s+/g, " ") // Replace multiple spaces with a single space
                              .trim(); // Remove leading & trailing spaces

                            if (field.datatype === "text") {
                              value = value.toUpperCase(); // Convert to uppercase only for text
                            }

                            setFieldValue(field.api_key || field.id, value);
                            handleBlur(e);
                          }}
                        />
                      )}

                      {field.datatype === "email" && (
                        <input
                          type="email"
                          className={`form-control ${
                            errors[field.api_key || field.id] &&
                            touched[field.api_key || field.id]
                              ? "is-invalid"
                              : ""
                          }`}
                          name={field.api_key || field.id}
                          value={values[field.api_key || field.id]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      )}

                      {field.datatype === "select" && (
                        <select
                          className={`form-select ${
                            errors[field.api_key || field.id] &&
                            touched[field.api_key || field.id]
                              ? "is-invalid"
                              : ""
                          }`}
                          name={field.api_key || field.id}
                          value={values[field.api_key || field.id] || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">Select an option</option>

                          {/* If the field is 'nearest_branch', use branch names */}
                          {field.id === "nearest_branch"
                            ? branches.map((branch) => (
                                <option
                                  key={branch.branch_code}
                                  value={branch.branch_name}
                                >
                                  {branch.branch_name}
                                </option>
                              ))
                            : field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                        </select>
                      )}

                      {field.datatype === "time" && (
                        <input
                          type="time"
                          className={`form-control ${
                            errors[field.api_key || field.id] &&
                            touched[field.api_key || field.id]
                              ? "is-invalid"
                              : ""
                          }`}
                          name={field.api_key || field.id}
                          value={values[field.api_key || field.id] || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      )}

                      {field.datatype === "date" && (
                        <input
                          type="date"
                          className={`form-control ${
                            errors[field.api_key || field.id] &&
                            touched[field.api_key || field.id]
                              ? "is-invalid"
                              : ""
                          }`}
                          name={field.api_key || field.id}
                          value={values[field.api_key || field.id] || ""}
                          onChange={(e) => {
                            handleDateChange(e, field.id);
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          min={field.id === "dob" ? getMinDate() : undefined}
                          max={getMaxDateForField(field.id)}
                        />
                      )}

                      {errors[field.api_key || field.id] &&
                        touched[field.api_key || field.id] &&
                        field.id !== "select_campaign" && ( // Ignore select_campaign errors
                          <div className="invalid-feedback">
                            {errors[field.api_key || field.id]}
                          </div>
                        )}
                    </div>
                  ) : null
                )}
              </div>
            )}

            {leadData?.data?.lead_id && (
              <div className="row mt-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Current Stage</label>
                  <input
                    type="text"
                    className="form-control"
                    name="stage"
                    value={values.stage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Sub-Stage</label>
                  <input
                    type="text"
                    className="form-control"
                    name="sub_stage"
                    value={values.sub_stage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Stage Remarks</label>
                  <input
                    type="text"
                    className="form-control"
                    name="stage_remarks"
                    value={values.stage_remarks}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly
                  />
                </div>
              </div>
            )}

            {/* Submit and Cancel Buttons */}
            <div className="fixed-bottom d-flex justify-content-end mb-5 me-5">
              <Button
                variant="secondary"
                className="red-outline-button me-5"
                style={{ width: "10%" }}
                onClick={() => navigate("/LeadSummary")}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                className="bottombuttons me-5"
                style={{ width: "10%" }}
                type="submit"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default form submission

                  console.log("Submit clicked", values);
                  console.log("formik error:", errors);
                  console.log("formik touched:", touched);
                  console.log("leadData:", leadData);

                  if (Object.keys(errors).length > 0) {
                    setTouched(
                      Object.keys(errors).reduce((acc, key) => {
                        acc[key] = true;
                        return acc;
                      }, {})
                    );
                    return;
                  }
                  handleSubmit(e, values);
                }}
                disabled={!values.campaignSelection} // Prevent submitting without selecting a campaign
              >
                {leadData && leadData.data && leadData.data.lead_id
                  ? "Update Lead"
                  : "Create Lead"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
        <Modal.Body className="text-center p-4">
          {message?.trim().toLowerCase() === "lead created successfully" ||
          message?.trim().toLowerCase() === "lead updated successfully" ? (
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
            {message || "Something went wrong."}
          </h5>

          <button
            className="mt-4 px-4 py-2 rounded-lg text-white"
            onClick={handleModalClose}
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

export default LeadCreation;
