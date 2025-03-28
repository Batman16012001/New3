import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  setCampaignDataredux,
  setselectedleadaccessdata,
} from "../../store/campaignSlice";
import { Button, Card, Row, Col, Table, Modal } from "react-bootstrap";
import CommonModal from "../../CommonModal/CommonModal";
import "./CampaignDetails.css";
import store from "../../store/store";

const CampaignDetails = ({
  setIsFormSubmitted,
  setActiveTab,
  activeTab,
  isEditMode,
  deactivatedcampaign,
}) => {
  console.log("Deactivated Campaign:::", deactivatedcampaign);
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [dataupdated, setdataupdated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [message, setmessage] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState({});
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedHO, setSelectedHO] = useState([]);
  const [selectedLOPS, setSelectedLOPS] = useState([]);

  const [selectedBrokers, setSelectedBrokers] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);

  const [selectedHob, setSelectedHob] = useState([]);
  const [selectedUnitHead, setSelectedUnitHead] = useState([]);
  const [selectedLia, setSelectedLia] = useState([]);

  // Fetch stored campaign data from Redux
  const campaignDataRedux = useSelector(
    (state) => state.campaign.campaignDataredux
  );

  const formatDateForInput = (date) => {
    if (!date) return "";

    // Check if the date is already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const formatdatawhileupdating = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = parsedDate.getFullYear();
    return `${day}-${month}-${year}`; // Convert to DD-MM-YYYY
  };
  //console.log("CampaignDataRedux:::",campaignDataRedux)

  // Determine source of initial form data
  const rawCampaignData = location.state?.campaign || campaignDataRedux || {};
  console.log("RawCampaignData:::", rawCampaignData);

  const campaignData = {
    campaigntype:
      rawCampaignData.campaign_type || rawCampaignData.campaigntype || "",
    campaignName:
      rawCampaignData.campaign_name || rawCampaignData.campaignName || "",
    startDate:
      formatDateForInput(rawCampaignData.start_date) ||
      rawCampaignData.startDate ||
      "",
    endDate:
      formatDateForInput(rawCampaignData.end_date) ||
      rawCampaignData.endDate ||
      "",

    campaignCost:
      rawCampaignData.campaign_cost || rawCampaignData.campaignCost || "", // Ensure numbers are handled
    leads: rawCampaignData.target_no_of_leads || rawCampaignData.leads || "",
  };

  useEffect(() => {
    const fetchCampaignTypes = async () => {
      try {
        const response = await axios.get(
          "http://192.168.2.11:3002/configurableItems/getConfigurableItems?module=campaignCreation"
        );
        if (response.data.data?.campaignTypes?.DropdownValues) {
          setCampaignOptions(
            response.data.data.campaignTypes.DropdownValues.map((item) => ({
              label: item.label,
              value: item.value,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching campaign types:", error);
      }
    };
    fetchCampaignTypes();
  }, []);

  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const validationSchema = Yup.object({
    campaigntype: Yup.string().required("Campaign Type is required"),
    campaignName: Yup.string()
      .matches(
        /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
        "Campaign Name should not include spaces or special characters"
      )
      .min(2, "Must be at least 2 characters")
      .max(20, "Must be at most 20 characters")
      .required("Campaign Name is required"),
    startDate: Yup.date()
      .nullable()
      .when([], {
        is: () => !isEditMode, // Skip validation if isEditMode is true
        then: (schema) =>
          schema
            .required("Start Date is required")
            .min(today, "Start Date cannot be in the past"),
        otherwise: (schema) => schema.notRequired(),
      }),
    endDate: Yup.date()
      .nullable()
      .when("campaignStatus", {
        is: (status) => status === "active", // Validate only if campaign is active
        then: (schema) => schema.required("End Date is required"),
        otherwise: (schema) => schema.notRequired(),
      })
      .test(
        "is-greater",
        "End Date must be after Start Date",
        function (endDate) {
          return this.parent.startDate && endDate
            ? new Date(endDate) > new Date(this.parent.startDate)
            : true;
        }
      ),
  });

  const formik = useFormik({
    initialValues: campaignData || {},
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true, // Ensures form updates when data changes
    onSubmit: (values) => {
      console.log("Submitting Form Data:", values);
      dispatch(setCampaignDataredux(values)); // Save data to Redux
      if (isEditMode) {
        const selectedData = {
          leadCreationAccess: rawCampaignData?.lead_creation_access || [],
          selectedProvinces: rawCampaignData?.selected_province || [],
          selectedDistricts: rawCampaignData?.selected_district || {},
          selectedBranches: rawCampaignData?.selected_branch || {},
          selectedHob: rawCampaignData?.selected_HOB || [],
          selectedUnitHead: rawCampaignData?.selected_unit_head || [],
          selectedLia: rawCampaignData?.selected_LIA || [],
          selectedHO: rawCampaignData?.selected_head_office || [],
          selectedLOPS: rawCampaignData?.selected_life_ops || [],
          selectedBrokers: rawCampaignData?.selected_broker || [],
          selectedDesignation: rawCampaignData?.selected_designation || [],
          selectedDepartment: rawCampaignData?.selected_department || [],
        };
        console.log("selectedData:::", selectedData);
        dispatch(setselectedleadaccessdata(selectedData));
      }

      setIsFormSubmitted(true);
      setActiveTab("Set Lead Creators");
    },
  });

  const updatedEditedData = async () => {
    try {
      //setdataupdated(true)
      const errors = await formik.validateForm();

      if (Object.keys(errors).length > 0) {
        console.log("Validation Errors:", errors);
        formik.setTouched({
          endDate: true, // Ensures the error message appears
          startDate: true,
        });
        return;
      }
      let updatedatarequest = {
        modified_by: "Admin",
        end_date: formatdatawhileupdating(formik.values.endDate),
      };
      const campaign_id = rawCampaignData.campaign_id;

      const response = await axios.put(
        `http://192.168.2.11:3001/campaignManagement/editCampaignDetails/${campaign_id}`,
        updatedatarequest
      );
      console.log("Reaponse:::", response);
      if (response.data.status === "success") {
        setModalType("update");
        setModalOpen(true);
        setmessage(response.data.message);
        dispatch(
          setCampaignDataredux({
            ...campaignDataRedux,
            endDate: formik.values.endDate,
          })
        );
      }
      console.log(
        "Updated Campaign Data Redux:::",
        store.getState().campaign.campaignDataredux
      );
    } catch (e) {
      console.log("Error while updating data:::", e);
    }
  };

  useEffect(() => {
    if (campaignDataRedux && Object.keys(campaignDataRedux).length > 0) {
      console.log("Mapping Redux data to Formik:", campaignDataRedux);
      formik.setFieldValue("endDate", campaignDataRedux.endDate);
    }
  }, [campaignDataRedux]);

  useEffect(() => {
    if (isEditMode) {
      setdataupdated(true); // Enable update button if endDate changes
    }
  }, [formik.values.endDate]);

  return (
    <div className="tab-content d-flex flex-column align-items-center">
      {activeTab === "Campaign Information" && (
        <form
          onSubmit={formik.handleSubmit}
          className="w-100 d-flex flex-column align-items-center"
        >
          <div className="campaign-card p-2 w-75 campaignfields hidden-scroll">
            <div className="row justify-content-center">
              <div className="col-md-6 mb-3">
                <h6 className="leadCreationHeader text-center mb-3">
                  Please provide the details for the new campaign.
                </h6>
              </div>
            </div>

            {/* Campaign Type */}
            <div className="row justify-content-center">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Campaign Type <span className="text-danger">*</span>
                </label>
                <select
                  name="campaigntype"
                  value={formik.values.campaigntype}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isEditMode}
                  className={`form-control ${
                    formik.errors.campaigntype ? "is-invalid" : ""
                  }`}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {campaignOptions.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formik.errors.campaigntype && (
                  <div className="invalid-feedback">
                    {formik.errors.campaigntype}
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Name */}
            <div className="row justify-content-center">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Campaign Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="campaignName"
                  value={formik.values.campaignName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isEditMode}
                  className={`form-control ${
                    formik.errors.campaignName ? "is-invalid" : ""
                  }`}
                />
                {formik.errors.campaignName && (
                  <div className="invalid-feedback">
                    {formik.errors.campaignName}
                  </div>
                )}
              </div>
            </div>

            {/* Start & End Date */}
            <div className="row justify-content-center">
              <div className="col-md-3 mb-3">
                <label className="form-label">
                  Start Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isEditMode}
                  className={`form-control ${
                    formik.errors.startDate ? "is-invalid" : ""
                  }`}
                />
                {formik.errors.startDate && (
                  <div className="invalid-feedback">
                    {formik.errors.startDate}
                  </div>
                )}
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">
                  End Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={deactivatedcampaign && isEditMode}
                  className={`form-control ${
                    formik.errors.endDate ? "is-invalid" : ""
                  }`}
                />
                {formik.errors.endDate && (
                  <div className="invalid-feedback">
                    {formik.errors.endDate}
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Cost & Leads */}
            <div className="row justify-content-center">
              <div className="col-md-6 mb-3">
                <label className="form-label">Campaign Cost</label>
                <input
                  type="text"
                  name="campaignCost"
                  value={formik.values.campaignCost}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      formik.setFieldValue("campaignCost", value);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  disabled={isEditMode}
                  className="form-control"
                  min={0}
                />
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-6 mb-3">
                <label className="form-label">Lead Target</label>
                <div className="d-flex align-items-center border rounded p-3 bg-light">
                  <img
                    src="/leadTarget.png"
                    alt="Lead Target Icon"
                    style={{ width: "61px", height: "61px", marginLeft: "5px" }}
                  />
                  <span className="col-md-6" style={{ marginLeft: "70px" }}>
                    <input
                      type="text"
                      name="leads"
                      value={formik.values.leads}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          formik.setFieldValue("leads", value);
                        }
                      }}
                      disabled={isEditMode}
                      className="form-control ms-2"
                      style={{
                        border: "2px solid #314363",
                        borderRadius: "10px",
                      }}
                      min={0}
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className="fixed-bottom d-flex justify-content-end mb-5 me-5">
              {isEditMode && (
                <Button
                  variant="secondary"
                  className="red-outline-button me-5"
                  onClick={updatedEditedData}
                  style={{ width: "10%" }}
                  disabled={!dataupdated}
                >
                  Update
                </Button>
              )}

              <Button
                variant="success"
                type="submit"
                className="bottombuttons me-5"
                onClick={() => console.log(formik.errors)}
                style={{ width: "10%" }}
              >
                Next
              </Button>
            </div>
          </div>
        </form>
      )}
      <div>
        <CommonModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          message={message}
          actiontype={modalType}
        />
      </div>
    </div>
  );
};

export default CampaignDetails;
