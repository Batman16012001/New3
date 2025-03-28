import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaPlus,
  FaAngleLeft,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUserCircle,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  fetchLeadSummaryDetails,
  fnSoftDeleteLead,
  getLeadDetails,
} from "./leadSummaryservice";
import {
  setCampaignDataredux,
  setcommingfrom,
  setSelectedFormType,
  setselectedleadaccessdata,
} from "../../store/campaignSlice";
import { useDispatch } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import leadDetailsModal from "./leadSummarymodal";
import "./leadSummary.css";

const Leadsummary = () => {
  const [menuOpen, setMenuOpen] = useState(null); // Track open menu
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [leadData, setleadData] = useState([]);
  const [softdeleteLeadId, setSoftDeleteLeadId] = useState("");
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateLead, setDeactivateLead] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const { leadID } = useParams();
  //const navigate = useNavigate();

  //added by ankita tank on 1mar25 sort functionality
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const location = useLocation();
  const campaignName = location.state?.campaignName;

  console.log("leadID from useParams:", leadID);

  console.log("Campaign Name:", campaignName);

  const dispatch = useDispatch();
  const fieldMapping = {
    FirstName: "first_name",
    LastName: "last_name",
    StartDate: "start_date",
    // EndDate: "end_date",
    // CampaignCost: "campaign_cost",
    // Status: "status",
  };

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [filters, setFilters] = useState([
    { field: "", value: "", startDate: "", endDate: "" },
  ]);
  const userid = sessionStorage.getItem("UserID");

  useEffect(() => {
    // Fetch dropdown options
    const fetchDropdownOptions = async () => {
      try {
        const response = await fetch("/dropdowns.json");
        const data = await response.json();
        // console.error("fetch dropdowns:", response);
        if (data.leadSummaryDropdown?.filterOptions) {
          let options = data.leadSummaryDropdown.filterOptions.filter(
            (opt) =>
              !["StartDate", "EndDate", "CampaignCost"].includes(opt.value)
          ); // Removed CampaignCost
          // options.push({ value: "DateRange", label: "Date Range" }); // Added DateRange filter
          console.log("options loading dropdowns:", options);
          setDropdownOptions(options);
        }
      } catch (error) {
        console.error("Error loading dropdowns:", error);
      }
    };

    fetchDropdownOptions();
    loadSummaryData();
  }, [leadID]); // Added `userId` as a dependency

  useEffect(() => {
    if (campaignName) {
      setFilters([
        {
          field: "campaign_name", // Ensure this matches the API response value
          value: campaignName,
        },
      ]);
    }
  }, [campaignName]);

  // Fetch campaign summary data
  const loadSummaryData = async () => {
    try {
      const data = await fetchLeadSummaryDetails(userid);
      console.log("Lead Data::::", data.Leads);

      // Ensure leadData is an array
      setleadData(data?.Leads || []);
      console.log("lead", data);
    } catch (error) {
      console.error("Error fetching Lead data:", error);
    }
  };

  const handleFilterChange = (index, key, value) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  const addFilter = () => {
    const selectedFields = filters.map((f) => f.field);
    const availableOptions = dropdownOptions.filter(
      (opt) => !selectedFields.includes(opt.value)
    );
    if (availableOptions.length > 0) {
      setFilters([
        ...filters,
        {
          field: availableOptions[0].value,
          value: "",
          startDate: "",
          endDate: "",
        },
      ]);
    }
  };

  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const handleShowDetails = (leadID) => {
    navigate(`/viewleadDetails/${leadID}`);
  };

  const toTimestamp = (dateStr) => {
    return dateStr ? new Date(dateStr).getTime() : 0;
  };
  const filteredLeads = Array.isArray(leadData)
    ? leadData.filter((lead) => {
        return filters.every(({ field, value }) => {
          if (!field || !value.trim()) return true;

          const mappedField = fieldMapping[field] || field;
          if (!lead[mappedField]) return false;

          return lead[mappedField]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        });
      })
    : [];

  //added by ankita tank on 1mar25 sort functionality
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const handleDeactivate = (lead_id) => {
    setModalMessage("Delet this Lead");
    setDeactivateLead("Yes");
    setSoftDeleteLeadId(lead_id);
    setShowDeactivateModal(true);
  };
  const confirmDeactivation = async () => {
    if (deactivateLead === "Yes") {
      await fnSoftDeleteLead(softdeleteLeadId, deactivateLead);
      await loadSummaryData(); // Reload the summary data
    }
    setShowDeactivateModal(false);
  };

  //added by ankita tank on 3mar25 according adjust the height of the table
  const calculateTableHeight = () => {
    const baseHeight = 70; // Base height in vh
    const additionalHeight = filters.length * 7; // Additional height per filter in vh
    return `${baseHeight - additionalHeight}vh`;
  };

  // added by ankita tank on 4mar25 According to User Role hide show module
  const userRole = sessionStorage.getItem("UserRole");
  console.log("User Role is a", userRole);
  const roleConfig = JSON.parse(
    sessionStorage.getItem("UserRoleBasedJson") || "{}"
  );
  console.log("Role Config", roleConfig);

  const canCreateLead = roleConfig[userRole]?.Modules?.Leads?.CreateLead;
  const canEdit = roleConfig[userRole]?.Modules?.Leads?.Edit;
  const canDelete = roleConfig[userRole]?.Modules?.Leads?.Delete;
  const canViewDetails = roleConfig[userRole]?.Modules?.Leads?.ViewDetails;
  const canImportCSV = roleConfig[userRole]?.Modules?.Leads?.ImportCSV;
  const canReassign = roleConfig[userRole]?.Modules?.Leads?.Reassign;
  const canBlockLead = roleConfig[userRole]?.Modules?.Leads?.BlockLead;

  <div className="row">
    <div className="d-flex justify-content-end gap-3">
      <button
        type="button"
        className="btn importcsvbutton"
        onClick={() => navigate("/uploadcsv")}
        style={{ backgroundColor: "#FD8469" }}
      >
        <img
          src="./filedownload.png"
          alt="Import CSV"
          style={{ marginRight: "8px", height: "20px", width: "20px" }}
        />
        Import CSV
      </button>

      <button
        type="button"
        className="btn CreateCampaignbtn"
        onClick={() => navigate("/leadcreation")}
      >
        <FaPlus style={{ marginRight: "8px" }} /> Create Lead
      </button>
    </div>
  </div>;

  const isMenuDisabled = !canEdit && !canDelete && !canViewDetails;

  const handleEdit = async (lead) => {
    try {
      const data = await getLeadDetails(lead.lead_id);
      console.log("Lead Details:::", data);
      setleadData(data || {}); // Store fetched lead details

      console.log("Navigating with:", data);
      // navigate(`/editlead/${lead.lead_id}`, { state: { editleadData: data } });
      navigate(`/editlead/${lead.lead_id}`, { state: { leadData: data } });
    } catch (error) {
      console.error("Failed to load lead details", error);
    }
  };

  //end of According to User Role hide show module

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="d-flex justify-content-end gap-3">
          <button
            type="button"
            className="btn importcsvbutton"
            onClick={() => navigate("/uploadcsv")}
            style={{ backgroundColor: "#FD8469" }}
          >
            <img
              src="./filedownload.png"
              alt="Import CSV"
              style={{ marginRight: "8px", height: "20px", width: "20px" }}
            />
            Import CSV
          </button>

          <button
            type="button"
            className="btn CreateCampaignbtn"
            onClick={() => navigate("/leadcreation")}
          >
            <FaPlus style={{ marginRight: "8px" }} /> Create Lead
          </button>
        </div>
      </div>

      <div className="row mt-1">
        {filters.map((filter, index) => (
          <div className="row mb-3" key={index}>
            <div className="col-md-4">
              <select
                className="form-select selectinput"
                value={filter.field}
                onChange={(e) =>
                  handleFilterChange(index, "field", e.target.value)
                }
              >
                <option value="">Search By</option>
                {dropdownOptions
                  .filter(
                    (opt) =>
                      !filters.some((f) => f.field === opt.value) ||
                      opt.value === filter.field
                  )
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-md-4">
              {filter.field === "DateRange" ? (
                <div className="d-flex gap-2 flex-wrap">
                  <div className="flex-grow-1">
                    <label>Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filter.startDate}
                      onChange={(e) =>
                        handleFilterChange(index, "startDate", e.target.value)
                      }
                      onKeyDown={(e) => e.preventDefault()}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <label>End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filter.endDate}
                      onChange={(e) =>
                        handleFilterChange(index, "endDate", e.target.value)
                      }
                      onKeyDown={(e) => e.preventDefault()}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    className="form-control textinput"
                    placeholder="Enter Search Text"
                    value={filter.value}
                    onChange={(e) => {
                      const newValue = e.target.value.replace(/^\s+/, ""); // Remove leading spaces
                      handleFilterChange(index, "value", newValue);
                    }}
                    disabled={!filter.field}
                  />
                </>
              )}
            </div>

            <div className="col-md-4 d-flex align-items-end">
              {index > 0 && (
                <button
                  className="btn btn-danger"
                  onClick={() => removeFilter(index)}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="col-12 text-start">
          <button
            className="btn btn-primary mb-3"
            onClick={addFilter}
            disabled={filters.every((filter) => filter.field === "")}
          >
            Add More Filter
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div
            className="table-responsive"
            style={{ height: calculateTableHeight() }}
          >
            <table className="campaign-table">
              <thead>
                <tr>
                  <th></th>
                  <th onClick={() => handleSort("first_name")}>
                    First Name {getSortIcon("first_name")}
                  </th>
                  <th onClick={() => handleSort("last_name")}>
                    Last Name {getSortIcon("last_name")}
                  </th>
                  <th onClick={() => handleSort("campaign_name")}>
                    Campaign {getSortIcon("campaign_name")}
                  </th>
                  <th onClick={() => handleSort("lead_source")}>
                    Source {getSortIcon("lead_source")}
                  </th>
                  <th onClick={() => handleSort("current_stage")}>
                    Status {getSortIcon("current_stage")}
                  </th>
                  <th onClick={() => handleSort("creation_date")}>
                    Creation Date {getSortIcon("creation_date")}
                  </th>
                  <th onClick={() => handleSort("created_by")}>
                    Lead Owner {getSortIcon("created_by")}
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sortedLeads.length > 0 ? (
                  sortedLeads.map((lead, index) => (
                    <tr
                      key={lead.lead_id}
                      className={index % 2 === 0 ? "even-row" : "odd-row"}
                    >
                      <td>{index + 1}</td>
                      <td>{lead.first_name || "-"}</td>
                      <td>{lead.last_name || "-"}</td>
                      <td>{lead.campaign_name || "-"}</td>
                      <td>{lead.lead_source || "-"}</td>
                      <td>{lead.current_stage || "-"}</td>
                      <td>
                        {lead.creation_date
                          ? lead.creation_date.substring(0, 10)
                          : "-"}
                      </td>
                      <td>{lead.so_code || "-"}</td>
                      <td className="position-relative">
                        <button
                          className="btn btn-sm ms-2"
                          onClick={() =>
                            setMenuOpen(menuOpen === index ? null : index)
                          }
                          /* added by ankita tank on 6mar25 According to User Role hide show module */
                          disabled={isMenuDisabled}
                        >
                          <BsThreeDotsVertical
                            style={{ fontSize: "1.5em", color: "#314363" }}
                          />
                        </button>
                        {menuOpen === index && (
                          <div
                            className="dropdown-menu show position-absolute"
                            style={{ right: 0, top: "100%" }}
                          >
                            {/* added by ankita tank on 6mar25 According to User Role hide show module */}
                            {canViewDetails && (
                              <button
                                className="dropdown-item"
                                onClick={() => handleShowDetails(lead.lead_id)}
                              >
                                View Details
                              </button>
                            )}
                            {/* added by ankita tank on 6mar25 According to User Role hide show module */}
                            {canEdit && (
                              <button
                                className="dropdown-item"
                                onClick={() => handleEdit(lead)} // Pass `lead`
                              >
                                Edit
                              </button>
                            )}

                            {/* added by ankita tank on 6mar25 According to User Role hide show module */}
                            {canDelete && (
                              <button
                                className="dropdown-item"
                                onClick={() => handleDeactivate(lead.lead_id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Leads Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <leadDetailsModal
        show={showModal}
        onClose={() => setShowModal(false)}
        campaign={setselectedleadaccessdata}
      />
      {/* <Modal
        show={showDeactivateModal}
        onHide={() => setShowDeactivateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          {deactivateLead && (
            <Button variant="danger" onClick={confirmDeactivation}>
              Delete Lead
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => setShowDeactivateModal(false)}
          >
            {deactivateLead ? "Cancel" : "OK"}
          </Button>
        </Modal.Footer>
      </Modal> */}

      <Modal
        show={showDeactivateModal}
        onHide={() => setShowDeactivateModal(false)}
        centered
      >
        <Modal.Body className="text-center p-4">
          <video
            src="/deletanimation.mp4"
            autoPlay
            loop
            muted
            style={{ width: "96px", height: "96px" }}
          />

          <h2
            className="text-lg font-semibold"
            style={{ color: "#671E75", fontSize: "20px" }}
          >
            {modalMessage}
          </h2>
          {deactivateLead && (
            <Button
              variant="secondary"
              className="red-outline-button me-5"
              style={{ height: "45px", width: "150px", borderRadius: "10px" }}
              onClick={confirmDeactivation}
            >
              Confirm
            </Button>
          )}
          <Button
            variant="success"
            className="btn CreateCampaignbtn"
            type="button"
            style={{ height: "45px", width: "150px", borderRadius: "10px" }}
            onClick={() => setShowDeactivateModal(false)}
          >
            {deactivateLead ? "Cancel" : "OK"}
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Leadsummary;
