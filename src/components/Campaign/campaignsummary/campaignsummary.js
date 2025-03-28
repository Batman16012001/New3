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
import { useNavigate } from "react-router-dom";
import {
  deactivateCampaignAPI,
  fetchCampaignSummaryDetails,
} from "./camapignsummaryservice";
import {
  setCampaignDataredux,
  setcommingfrom,
  setLeadFormName,
  setSelectedFormType,
  setselectedleadaccessdata,
} from "../../store/campaignSlice";
import { useDispatch } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import CampaignDetailsModal from "./campaignsdetailsmodal";
import "./campaignsummary.css";

const CampaignSummary = () => {
  const [menuOpen, setMenuOpen] = useState(null); // Track open menu
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const navigate_to_leadsummary = useNavigate();
  const [leadData, setleadData] = useState({ campaigns: [] });

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateCampaign, setDeactivateCampaign] = useState(null);

  const [modalMessage, setModalMessage] = useState("");
  const [deactivatedcampaign, setdeactivatedcampaign] = useState(false);

  //added by ankita tank on 1mar25 sort functionality
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const dispatch = useDispatch();
  const fieldMapping = {
    CampaignName: "campaign_name",
    CampaignType: "campaign_type",
    StartDate: "start_date",
    EndDate: "end_date",
    CampaignCost: "campaign_cost",
    Status: "status",
  };

  const handleShowDetails = (campaign) => {
    setSelectedCampaign(campaign);
    setShowModal(true);
  };

  const hanldeEditCampaign = (campaign) => {
    dispatch(setCampaignDataredux(campaign));
    dispatch(setselectedleadaccessdata(campaign));
    //dispatch(setSelectedFormType(""));
    console.log("Data after dispatching from edit:::");
    sessionStorage.setItem("activeTab", "Campaign Information");

    navigate("/createcampaignForm", {
      state: { campaign, deactivatedcampaign },
    });
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

        if (data.CampaignSummaryDropdown?.filterOptions) {
          let options = data.CampaignSummaryDropdown.filterOptions.filter(
            (opt) =>
              !["StartDate", "EndDate", "CampaignCost"].includes(opt.value)
          ); // Removed CampaignCost
          options.push({ value: "DateRange", label: "Date Range" }); // Added DateRange filter
          setDropdownOptions(options);
        }
      } catch (error) {
        console.error("Error loading dropdowns:", error);
      }
    };

    // Fetch campaign summary data
    const loadSummaryData = async () => {
      try {
        const data = await fetchCampaignSummaryDetails(userid);
        console.log("Campaign Data::::", data);
        setleadData(data.data || { campaigns: [] });
      } catch (error) {
        //setError("Failed to load campaign data.");
        console.log("Error fetching campaign data:", error);
      } finally {
        //setLoading(false);
      }
    };

    fetchDropdownOptions();
    loadSummaryData();
  }, []); // Added `userId` as a dependency

  // const handleFilterChange = (index, key, value) => {
  //   const newFilters = [...filters];
  //   newFilters[index][key] = value;
  //   setFilters(newFilters);
  // };

  const handleFilterChange = (index, key, value) => {
    const newFilters = [...filters];

    if (key === "field") {
      newFilters[index] = { field: value, value: "" }; // Reset value when changing field
    } else if (key === "startDate" || key === "endDate") {
      newFilters[index][key] = value.split("-").reverse().join("/"); // Convert YYYY-MM-DD to DD/MM/YYYY
    } else {
      newFilters[index][key] = value;
    }

    setFilters(newFilters);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-"); // Split YYYY-MM-DD
    return `${day}/${month}/${year}`; // Convert to DD/MM/YYYY
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

  const toTimestamp = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return 0; // Prevent errors
    dateStr = dateStr.trim(); // Remove spaces

    const parts = dateStr.split("/");
    if (parts.length !== 3) return 0; // Ensure valid format

    const [day, month, year] = parts.map(Number); // Convert to numbers
    if (!day || !month || !year) return 0; // Ensure valid numbers

    return new Date(year, month - 1, day).getTime(); // Convert to timestamp
  };

  // ✅ Debugging test cases
  console.log(toTimestamp("01/03/2025")); // Should return a valid timestamp
  console.log(toTimestamp("12/03/2025")); // Should return a valid timestamp
  console.log(toTimestamp("")); // Should return 0
  console.log(toTimestamp("invalid")); // Should return 0

  //added by ankita tank on 1mar25 sort functionality
  const filteredLeads = (leadData.campaigns || []).filter((lead) => {
    let isMatching = true;

    filters.forEach(({ field, value, startDate, endDate }) => {
      if (field === "DateRange" && startDate && endDate) {
        const filterStart = toTimestamp(startDate);
        const filterEnd = toTimestamp(endDate);
        const campaignStart = toTimestamp(lead.start_date);
        const campaignEnd = toTimestamp(lead.end_date);

        console.log("Filter Start:", filterStart, "Filter End:", filterEnd);
        console.log(
          "Campaign Start:",
          campaignStart,
          "Campaign End:",
          campaignEnd
        );

        // Ensure the campaign is fully inside the selected date range
        if (!(campaignStart >= filterStart && campaignEnd <= filterEnd)) {
          isMatching = false;
        }
      } else if (value.trim()) {
        const mappedField = fieldMapping[field] || field;
        if (!lead[mappedField]?.toLowerCase().includes(value.toLowerCase())) {
          isMatching = false;
        }
      }
    });

    return isMatching;
  });

  // Convert DD/MM/YYYY to timestamp
  // const toTimestamp = (dateStr) => {
  //   if (!dateStr || typeof dateStr !== "string") return 0;
  //   const [day, month, year] = dateStr.split("/").map(Number);
  //   return new Date(year, month - 1, day).getTime();
  // };

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
  //end of sort functionality

  const navigatetocampaignsummary = () => {
    dispatch(setcommingfrom("campaign"));
    dispatch(setSelectedFormType(""));
    dispatch(setCampaignDataredux({}));
    dispatch(setselectedleadaccessdata(""));
    dispatch(setLeadFormName(""));
    sessionStorage.setItem("activeTab", "Campaign Information");
    navigate("/createcampaignForm");
  };

  const handleDeactivate = (campaign) => {
    if (campaign.status === "Inactive") {
      setModalMessage("The campaign is already inactive.");
      setDeactivateCampaign(null);
    } else if (campaign.status === "Upcoming") {
      setModalMessage("The campaign is not active yet.");
      setDeactivateCampaign(null);
    } else {
      setModalMessage("Are you sure you want to deactivate the campaign?");
      setDeactivateCampaign(campaign);
    }
    setShowDeactivateModal(true);
  };

  const confirmDeactivation = async () => {
    if (deactivateCampaign) {
      try {
        const result = await deactivateCampaignAPI(
          deactivateCampaign.campaign_id
        );
        console.log("Deactivation API Response:", result);

        if (result.response.data.status === "success") {
          // ✅ Ensure correct response check
          setdeactivatedcampaign(true);
          setleadData((prevData) => {
            const updatedCampaigns = prevData.campaigns.map((camp) =>
              camp.campaign_id === deactivateCampaign.campaign_id
                ? { ...camp, status: "Inactive" } // ✅ Updates state correctly
                : camp
            );

            return { ...prevData, campaigns: updatedCampaigns }; // ✅ Ensure new state object
          });
        } else {
          alert("Failed to deactivate campaign!");
        }
      } catch (error) {
        console.error("Error deactivating campaign:", error);
      }
    }
    setShowDeactivateModal(false);
  };

  const handleViewLeads = (campaignName) => {
    navigate_to_leadsummary("/LeadSummary", { state: { campaignName } });
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

  const canCreateCampaign =
    roleConfig[userRole]?.Modules?.Campaign?.CreateCampaign;
  const canEditCampaign = roleConfig[userRole]?.Modules?.Campaign?.Edit;
  const canDeactivateCampaign =
    roleConfig[userRole]?.Modules?.Campaign?.Deactivate;
  const canShowCampaignInformation =
    roleConfig[userRole]?.Modules?.Campaign?.ShowCampaignInformation;
  const isMenuDisabled =
    !canEditCampaign && !canDeactivateCampaign && !canShowCampaignInformation;

  //end of According to User Role hide show module

  const handleCopyLink = (campaign) => {
    const url = campaign.campaign_url;
    console.log("URL:", url);
    if (url) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("URL copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy URL:", err);
        });
    } else {
      alert("No URL available to copy.");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12 text-end">
          <button
            type="button"
            className="btn CreateCampaignbtn"
            onClick={navigatetocampaignsummary}
            disabled={!canCreateCampaign} // added by ankita tank on 5mar25 According to User Role hide show module
          >
            <FaPlus style={{ marginRight: "8px" }} /> Create Campaign
          </button>
        </div>
      </div>

      <div className="row">
        {filters.map((filter, index) => (
          <div className="row mb-3" key={index}>
            <label></label>
            <div className="col-md-4">
              <select
                className="form-select selectinput mt-2"
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
                      value={
                        filter.startDate
                          ? filter.startDate.split("/").reverse().join("-")
                          : ""
                      }
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
                      value={
                        filter.endDate
                          ? filter.endDate.split("/").reverse().join("-")
                          : ""
                      }
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
                    className="form-control textinput selectinput mt-2"
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
                  <th onClick={() => handleSort("campaign_type")}>
                    Campaign Type {getSortIcon("campaign_type")}
                  </th>
                  <th onClick={() => handleSort("campaign_name")}>
                    Campaign Name {getSortIcon("campaign_name")}
                  </th>
                  <th onClick={() => handleSort("start_date")}>
                    Start Date {getSortIcon("start_date")}
                  </th>
                  <th onClick={() => handleSort("end_date")}>
                    End Date {getSortIcon("end_date")}
                  </th>
                  <th onClick={() => handleSort("campaign_cost")}>
                    Campaign Cost {getSortIcon("campaign_cost")}
                  </th>
                  <th onClick={() => handleSort("status")}>
                    Status {getSortIcon("status")}
                  </th>
                  <th>Leads</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map((campaign, index) => {
                  const currentDate = new Date().toISOString().split("T")[0]; // Get today's date

                  const convertToISO = (dateStr) => {
                    if (!dateStr) return "";
                    const [day, month, year] = dateStr.split("/"); // Split "20/03/2025"
                    return `${year}-${month}-${day}`; // Convert to "2025-03-20"
                  };
                  const startDateISO = convertToISO(campaign.start_date);
                  const endDateISO = convertToISO(campaign.end_date);

                  // Determine status dynamically
                  let status;
                  // if (currentDate >= startDate && currentDate <= endDate) {
                  //   status = "Active";
                  // } else if (currentDate < startDate) {
                  //   status = "Upcoming";
                  // } else {
                  //   status = "Inactive";
                  // }
                  if (campaign.status === "Inactive") {
                    status = "Inactive"; // Manually deactivated campaigns remain Inactive
                  } else if (currentDate > endDateISO) {
                    status = "Inactive"; // If endDate is passed, make it inactive
                  } else if (
                    currentDate >= startDateISO &&
                    currentDate <= endDateISO
                  ) {
                    status = "Active"; // Active campaign
                  } else {
                    status = "Upcoming"; // If it hasn't started yet
                  }

                  let dotColor;
                  if (status === "Inactive") dotColor = "red";
                  else if (status === "Active") dotColor = "green";
                  else if (status === "Upcoming") dotColor = "orange";
                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "even-row" : "odd-row"}
                    >
                      <td>{index + 1}</td>
                      <td>{campaign.campaign_type}</td>
                      <td>{campaign.campaign_name}</td>
                      <td>{campaign.start_date}</td>
                      <td>{campaign.end_date}</td>
                      <td>{`Rs. ${new Intl.NumberFormat("en-US").format(
                        campaign.campaign_cost
                      )}`}</td>
                      <td>
                        <span
                          className="status-dot"
                          style={{
                            backgroundColor: dotColor,
                            display: "inline-block",
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            marginRight: "5px",
                          }}
                        ></span>
                        {status}
                      </td>
                      <td className="position-relative">
                        <button
                          className="btn btn-sm"
                          onClick={() =>
                            handleViewLeads(campaign.campaign_name)
                          }
                        >
                          <FaEye
                            style={{ fontSize: "1.5em", color: "#314363" }}
                          />
                        </button>
                        <button
                          className="btn btn-sm ms-2"
                          onClick={() =>
                            setMenuOpen(menuOpen === index ? null : index)
                          }
                          /* added by ankita tank on 5mar25 According to User Role hide show module */
                          disabled={isMenuDisabled}
                        >
                          <BsThreeDotsVertical
                            style={{ fontSize: "1.5em", color: "#314363" }}
                          />
                        </button>

                        {menuOpen === index && (
                          <div
                            className="dropdown-menu show position-absolute"
                            style={{
                              right: 0,
                              top: "100%",
                              borderRadius: "15px",
                            }}
                          >
                            {/* added by ankita tank on 5mar25 According to User Role hide show module */}
                            {canEditCampaign && (
                              <button
                                className="dropdown-item"
                                onClick={() => hanldeEditCampaign(campaign)}
                              >
                                Edit
                              </button>
                            )}
                            {/* added by ankita tank on 5mar25 According to User Role hide show module */}
                            {canDeactivateCampaign && (
                              <button
                                className="dropdown-item"
                                k
                                onClick={() => handleDeactivate(campaign)}
                              >
                                Deactivate
                              </button>
                            )}
                            {/* added by ankita tank on 5mar25 According to User Role hide show module */}
                            {canShowCampaignInformation && (
                              <button
                                className="dropdown-item"
                                onClick={() => handleShowDetails(campaign)}
                              >
                                Show Campaign Information
                              </button>
                            )}
                            <button
                              className="dropdown-item"
                              onClick={() => handleCopyLink(campaign)}
                            >
                              Copy URL
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CampaignDetailsModal
        show={showModal}
        onClose={() => setShowModal(false)}
        campaign={selectedCampaign}
      />
      <Modal
        show={showDeactivateModal}
        onHide={() => setShowDeactivateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Deactivate Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          {deactivateCampaign && (
            <Button variant="danger" onClick={confirmDeactivation}>
              Deactivate
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => setShowDeactivateModal(false)}
          >
            {deactivateCampaign ? "Cancel" : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CampaignSummary;
