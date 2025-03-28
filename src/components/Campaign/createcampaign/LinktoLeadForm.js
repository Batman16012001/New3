import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Offcanvas } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { fetchLeadFormSummaryDetails } from "../../Lead/LeadFormSummary/LeadFormSummaryService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setLeadFormName,
  setSelectedFormType,
} from "../../store/campaignSlice";
import CommonModal from "../../CommonModal/CommonModal";

const LinkToLeadForm = ({
  setIsFormSubmitted,
  setActiveTab,
  activeTab,
  setLeadAccessData,
  campaignData,
  leadAccessData,
  isEditMode,
}) => {
  // const campaignDataRedux = useSelector((state) => state.campaign.campaignDataRedux);
  // console.log("Fetched from Redux:", campaignDataRedux);

  const campaignDataRedux = useSelector(
    (state) => state.campaign.campaignDataredux
  );
  console.log("Fetched from Redux:", campaignDataRedux);

  const leadaccessDataredux = useSelector(
    (state) => state.campaign.selectedleadaccessdata
  );
  console.log("Data through redux::::", leadaccessDataredux);

  const leadFormName = useSelector((state) => state.campaign.leadFormName);

  const selectedFormType = useSelector(
    (state) => state.campaign.selectedFormType
  );
  const dispatch = useDispatch();
  const [saveclicked, setsaveclicked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [leadForms, setLeadForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [error, setError] = useState(null);
  const [message, setmessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiStatus, setapistatus] = useState("");
  console.log("CampaignData::::", campaignData);
  console.log("LeadAccessData:::", leadAccessData);

  const navigate = useNavigate();
  const user_id = sessionStorage.getItem("UserID");
  //const lead_form_ID = sessionStorage.getItem("leadFormId");
  const navigate_to_campaignsummary = useNavigate();
  useEffect(() => {
    const getLeadForms = async () => {
      try {
        const sortedData = await fetchLeadFormSummaryDetails();
        console.log("Sorted Data::::", sortedData);
        setLeadForms(sortedData);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    getLeadForms();
  }, []);

  useEffect(() => {
    if (isEditMode && campaignData) {
      const { lead_form_id, lead_form_name } = campaignData;

      if (lead_form_id) {
        const isTemplateForm = leadForms.some(
          (form) => form.lead_form_ID === lead_form_id
        );

        formik.setValues({
          formType: isTemplateForm ? "template" : "new",
          leadForm: isTemplateForm ? lead_form_id : "",
        });

        dispatch(setSelectedFormType(isTemplateForm ? "template" : "new"));

        if (!isTemplateForm) {
          // If it's a new form, set the form name
          dispatch(setLeadFormName(lead_form_name));
        }
      }
    }
  }, [isEditMode, campaignData, leadForms, dispatch]);

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const formik = useFormik({
    initialValues: {
      formType: selectedFormType || "",
      leadForm: "", 
    },
    validationSchema: Yup.object({
      formType: Yup.string().required("Please select a form type"),
      leadForm: Yup.string().when("formType", (formType, schema) => {
        return formType === "template"
          ? schema.required("Please select a lead form name")
          : schema.nullable();
      }),
      
    }),
    onSubmit: async (values) => {
      console.log("Form submitted:", values);
    },
  });
  
  

  const handleSubmit = async () => {
    if (formik.values.formType === "template" && !formik.values.leadForm) {
      setmessage("Please select a lead form name");
      setModalType("error");
      setModalOpen(true);
      formik.setFieldError("leadForm", "Please select a lead form name");
      return; // Stop submission
    }
  
    console.log("Form submitted with values:", formik.values);
  
    let selectedLeadFormId = "";
  
    if (formik.values.formType === "new") {
      selectedLeadFormId = sessionStorage.getItem("leadFormId") || "";
      console.log("Selected ID if form is new:::", selectedLeadFormId);
    } else if (formik.values.formType === "template") {
      const selectedFormData = leadForms.find(
        (form) => form.lead_form_ID === formik.values.leadForm
      );
      selectedLeadFormId = selectedFormData ? selectedFormData.lead_form_ID : "";
      console.log("Selected ID if form is template:::", selectedLeadFormId);
    }
  
    console.log("Form submitted with values:", formik.values);
  
    let payload = {
      campaign_name: campaignDataRedux?.campaignName || "",
      campaign_type: campaignDataRedux?.campaigntype || "",
      start_date: formatDate(campaignDataRedux?.startDate),
      end_date: formatDate(campaignDataRedux?.endDate),
      lead_form_id: String(selectedLeadFormId),
      created_by: String(user_id),
      lead_creation_access: leadaccessDataredux?.leadCreationAccess || [],
      selected_province: leadaccessDataredux?.selectedProvinces || [],
      selected_district: Object.values(
        leadaccessDataredux?.selectedDistricts || {}
      ).flat(),
      selected_branch: Object.values(
        leadaccessDataredux?.selectedBranches || {}
      ).flat(),
      selected_HOB: (leadaccessDataredux?.selectedHob || []).map(
        (hob) => hob.value
      ),
      selected_unit_head: (leadaccessDataredux?.selectedUnitHead || []).map(
        (unit) => unit.value
      ),
      selected_LIA: (leadaccessDataredux?.selectedLia || []).map(
        (lia) => lia.value
      ),
      selected_head_office: leadaccessDataredux?.selectedHO || [],
      selected_life_ops: leadaccessDataredux?.selectedLOPS || [],
      selected_broker: leadaccessDataredux?.selectedBrokers || [],
      selected_designation: leadaccessDataredux?.selectedDesignation || [],
      selected_department: leadaccessDataredux?.selectedDepartment || [],
      targeted_leads: String(campaignDataRedux?.leads || "0"),
      campaign_cost: String(campaignDataRedux?.campaignCost || "0"),
    };
  
    console.log("✅ Final Payload:", payload);
  
    try {
      const apicall = await fetch(
        "http://192.168.2.11:3001/campaignManagement/campaignCreation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await apicall.json();
      console.log("API Response:", result);
      setapistatus(result.status);
  
      if (result.status === "success") {
        setModalType("save");
        setModalOpen(true);
        setmessage(result.message);
        setsaveclicked(true);
      }
    } catch (e) {
      console.log("Error while calling API:::", e);
    }
  };
  

  const handleFormSelection = (event) => {
    const selectedId = event.target.value;
    const form = leadForms.find((f) => f.lead_form_ID === selectedId);
    if (form) {
      setSelectedForm(form);
      setFormFields(JSON.parse(form.lead_form_JSON || "[]"));
      formik.setFieldValue("leadForm", selectedId);
    }
  };

  const renderFormFields = () => {
    if (!formFields.length) {
      return <p>No fields available for this form.</p>;
    }
    return (
      <Row>
        {formFields.map((field) => (
          <Col md={6} key={field.id} className="mb-3">
            <Form.Group>
              <Form.Label>
                {field.text}{" "}
                {field.required === "yes" && (
                  <span style={{ color: "red" }}>*</span>
                )}
              </Form.Label>
              {field.datatype === "text" && (
                <Form.Control type="text" placeholder={field.text} />
              )}
              {field.datatype === "number" && (
                <Form.Control type="number" placeholder={field.text} />
              )}
              {field.datatype === "date" && (
                <Form.Control type="date" placeholder={field.text} />
              )}
              {field.datatype === "email" && (
                <Form.Control type="email" placeholder={field.text} />
              )}
              {field.datatype === "select" && (
                <Form.Select>
                  <option>Select {field.text}</option>
                </Form.Select>
              )}
            </Form.Group>
          </Col>
        ))}
      </Row>
    );
  };

  const handlePreviousClick = () => {
    setActiveTab("Set Lead Creators");
  };

  return (
    <>
      {activeTab === "Select Lead Form" && (
        <Container>
          <div className="text-center">
            <h6 className="mb-2 fw-medium" style={{ color: "#7A0114" }}>
              Please select the lead form to link to the campaign.
            </h6>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <Form onSubmit={formik.handleSubmit} className="text-center">
              <div className="row justify-content-center mt-4">
                {!isEditMode && (
                  <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <Form.Check
                      type="radio"
                      label={
                        <span style={{ fontSize: "medium" }}>
                          Link Template Lead Form
                        </span>
                      }
                      name="formType"
                      value="template"
                      onChange={(e) => {
                        dispatch(setSelectedFormType(e.target.value));
                        formik.setFieldValue("formType", e.target.value);
                      }}
                      disabled={isEditMode}
                      checked={formik.values.formType === "template"}
                      className="me-2"
                    />
                    <Form.Check
                      type="radio"
                      label={
                        <span style={{ fontSize: "medium" }}>
                          Create New Lead Form
                        </span>
                      }
                      name="formType"
                      value="new"
                      onChange={(e) => {
                        dispatch(setSelectedFormType(e.target.value));
                        formik.setFieldValue("formType", "new");
                        navigate("/leadFormGeneration");
                      }}
                      disabled={isEditMode}
                      checked={formik.values.formType === "new"}
                    />
                  </div>
                )}
              </div>
              {formik.touched.formType && formik.errors.formType && (
                <div style={{ color: "red" }}>{formik.errors.formType}</div>
              )}

              {formik.values.formType === "template" && (
                <div className="row justify-content-center mt-4">
                  <div className="col-md-6 d-flex align-items-center justify-content-center flex-column">
                    <Form.Label className="align-self-start text-left">
                      Lead Form Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="leadForm"
                      value={formik.values.leadForm}
                      onBlur={formik.handleBlur}
                      onClick={handleFormSelection}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        console.log("Lead Form Selected:", selectedValue);
                        formik.setFieldValue("leadForm", selectedValue);
                      }}
                      
                      className="textinput"
                      disabled={isEditMode}
                    >
                      <option value="">Select</option>
                      {leadForms.map((form) => (
                        <option
                          key={form.lead_form_ID}
                          value={form.lead_form_ID}
                        >
                          {form.lead_form_name}
                        </option>
                      ))}
                    </Form.Select>
                    {formik.touched.leadForm && formik.errors.leadForm ? (
  <div className="text-danger">{formik.errors.leadForm}</div>
) : null}

                    
                  </div>
                </div>
              )}

              {formik.values.formType === "new" && (
                <div className="row justify-content-center mt-4">
                  <div className="col-md-6 d-flex align-items-center justify-content-center flex-column">
                    <Form.Label className="align-self-start text-left">
                      Selected Form
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={leadFormName ? leadFormName : "No form selected"}
                      readOnly
                      className="textinput"
                      disabled={isEditMode}
                    />
                  </div>
                </div>
              )}

              <div className="fixed-bottom d-flex justify-content-end mb-5 me-5">
                <Button
                  variant="secondary"
                  className="red-outline-button "
                  style={{ width: "10%", marginRight: "41%" }}
                  onClick={handlePreviousClick}
                >
                  Previous
                </Button>
                <Button
                  className="bottombuttons me-5"
                  variant="secondary"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={
                    isEditMode || (!formik.values.formType && !saveclicked)
                  }
                  style={{ width: "10%" }}
                >
                  Save
                </Button>

                <Button
                  variant="success"
                  type="submit"
                  className="bottombuttons me-5"
                  onClick={() => setShowDrawer(true)}
                  disabled={
                    isEditMode ||
                    !formik.values.formType ||
                    !formik.values.leadForm
                  }
                  style={{ width: "10%" }}
                >
                  Preview
                </Button>
              </div>
            </Form>
          )}

          <div>
            <CommonModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              message={message}
              actiontype={modalType}
              status={apiStatus}
              navigateTo="/campaignsummary"
            />
          </div>

          {/* Offcanvas (Drawer) for Preview */}
          <Offcanvas
            show={showDrawer}
            onHide={() => setShowDrawer(false)}
            placement="end"
            style={{ width: "50%" }}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Preview Form</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {selectedForm ? (
                <>
                  <h5>{selectedForm.lead_form_name}</h5>
                  {renderFormFields()}
                </>
              ) : (
                <p>No form selected</p>
              )}
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      )}
    </>
  );
};

export default LinkToLeadForm;
