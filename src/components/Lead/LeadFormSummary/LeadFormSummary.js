import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaPlus,
  FaAngleLeft,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUserCircle,
} from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { fetchLeadFormSummaryDetails } from "./LeadFormSummaryService";
import { setcommingfrom } from "../../store/campaignSlice";
import { useDispatch } from "react-redux";

const LeadFormSummary = () => {
  const [leadData, setLeadData] = useState([]); // API Data
  const [filters, setFilters] = useState([{ field: "", value: "" }]); // Multiple Filters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedForm, setSelectedForm] = useState(null); // Stores selected form JSON
  const [showModal, setShowModal] = useState(false); // Modal state

  //added by ankita tank on 1mar25 sort functionality
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch Lead Forms from API
  useEffect(() => {
    const getLeadForms = async () => {
      try {
        const sortedData = await fetchLeadFormSummaryDetails();
        console.log("Sorted Data :::: ", sortedData);
        setLeadData(sortedData);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    getLeadForms();
  }, []);

  // Handle Filter Change
  // const handleFilterChange = (index, key, value) => {
  //   const newFilters = [...filters];
  //   newFilters[index][key] = value;
  //   setFilters(newFilters);
  // };

  const handleFilterChange = (index, key, value) => {
    const newFilters = [...filters];

    if (key === "field") {
      newFilters[index] = { field: value, value: "" }; // Reset value when changing field
    } else {
      newFilters[index][key] = value;
    }

    setFilters(newFilters);
  };

  // Add Filter
  // const addFilter = () => {
  //   setFilters([...filters, { field: "", value: "" }]);
  // };

  const addFilter = () => {
    const availableFields = ["lead_form_name", "creation_date", "created_by"];
    const selectedFields = filters.map((f) => f.field);

    // Find the first available field that isn't selected
    const newField = availableFields.find(
      (field) => !selectedFields.includes(field)
    );

    // If all fields are used, do nothing
    if (!newField) return;

    setFilters([...filters, { field: newField, value: "" }]);
  };

  // Remove Filter
  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  // Handle Form Preview
  const handlePreview = (jsonData) => {
    try {
      const parsedData = JSON.parse(jsonData); // Parse JSON string
      setSelectedForm(parsedData);
      setShowModal(true);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  const handleCreateNew = () => {
    dispatch(setcommingfrom("lead"));
    navigate("/leadFormGeneration");
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  //added by ankita tank on 1mar25 sort functionality
  const sortedLeads = [...leadData].sort((a, b) => {
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
  // End of sort functionality

  // Filtered Leads
  const filteredLeads = sortedLeads.filter((lead) => {
    return filters.every(({ field, value }) => {
      if (!value.trim()) return true;

      if (field === "creation_date") {
        // Directly compare formatted string values to avoid Date object conversion issues
        return lead.creation_date.split("T")[0] === value;
      }

      return (
        lead[field] && lead[field].toLowerCase().includes(value.toLowerCase())
      );
    });
  });

  // added by ankita tank on 4mar25 According to User Role hide show module
  const userRole = sessionStorage.getItem("UserRole");
  console.log("User Role is a", userRole);
  const roleConfig = JSON.parse(
    sessionStorage.getItem("UserRoleBasedJson") || "{}"
  );
  console.log("Role Config", roleConfig);

  const canCreateLeadForm =
    roleConfig[userRole]?.Modules?.ConfigureForm?.CreateLeadForm;

  //end of According to User Role hide show module

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12 text-end">
          <button
            type="button"
            className="btn CreateCampaignbtn"
            onClick={handleCreateNew}
            disabled={!canCreateLeadForm} // added by ankita tank on 5mar25 According to User Role hide show module
          >
            <FaPlus style={{ marginRight: "8px" }} /> Create Lead Form
          </button>
        </div>
      </div>

      <div className="row">
        {filters.map((filter, index) => (
          <div className="row mb-3" key={index}>
            <div className="col-md-4">
              {/* <select
                className="form-select selectinput"
                value={filter.field}
                onChange={(e) =>
                  handleFilterChange(index, "field", e.target.value)
                }
              >
                <option value="">Search By</option>
                <option
                  value="lead_form_name"
                  disabled={filters.some((f) => f.field === "lead_form_name")}
                >
                  Lead Form Name
                </option>
                <option
                  value="creation_date"
                  disabled={filters.some((f) => f.field === "creation_date")}
                >
                  Creation Date
                </option>
                <option
                  value="created_by"
                  disabled={filters.some((f) => f.field === "created_by")}
                >
                  Form Owner
                </option>
              </select> */}
              <select
                className="form-select selectinput"
                value={filter.field}
                onChange={(e) =>
                  handleFilterChange(index, "field", e.target.value)
                }
              >
                <option value="">Search By</option>
                {["lead_form_name", "creation_date", "created_by"]
                  .filter(
                    (field) =>
                      !filters.some((f, i) => i !== index && f.field === field)
                  ) // Remove already selected fields
                  .map((field) => (
                    <option key={field} value={field}>
                      {field === "lead_form_name"
                        ? "Lead Form Name"
                        : field === "creation_date"
                        ? "Creation Date"
                        : "Form Owner"}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-md-4">
              {filter.field === "creation_date" ? (
                <input
                  type="date"
                  className="form-control"
                  value={filter.value}
                  onChange={(e) =>
                    handleFilterChange(index, "value", e.target.value)
                  }
                  onKeyDown={(e) => e.preventDefault()}
                />
              ) : (
                <input
                  type="text"
                  className="form-control textinput"
                  placeholder="Enter Search Text"
                  value={filter.value}
                  onChange={(e) =>
                    handleFilterChange(index, "value", e.target.value)
                  }
                  disabled={!filter.field}
                />
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
            disabled={filters.length >= 3}
          >
            Add More Filter
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="row">
        <div className="col-12">
          <div className="table-responsive" style={{ height: "64vh" }}>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <table className="campaign-table">
                <thead>
                  <tr>
                    <th></th>
                    <th onClick={() => handleSort("lead_form_ID")}>
                      Lead Form ID {getSortIcon("lead_form_ID")}
                    </th>
                    <th onClick={() => handleSort("lead_form_name")}>
                      Lead Form Name {getSortIcon("lead_form_name")}
                    </th>
                    <th onClick={() => handleSort("creation_date")}>
                      Creation Date {getSortIcon("creation_date")}
                    </th>
                    <th onClick={() => handleSort("created_by")}>
                      Form Owner {getSortIcon("created_by")}
                    </th>
                    <th>Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "even-row" : "odd-row"}
                      >
                        <td>{index + 1}</td>
                        <td>{lead.lead_form_ID}</td>
                        <td>{lead.lead_form_name}</td>
                        <td>{lead.creation_date.split("T")[0]}</td>
                        <td>{lead.created_by}</td>
                        <td>
                          <button
                            className="btn btn-sm"
                            onClick={() => handlePreview(lead.lead_form_JSON)}
                          >
                            <FaEye
                              style={{
                                fontSize: "1.5em",
                                color: "#314363",
                              }}
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No results found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Lead Form Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedForm ? (
            <form>
              <div className="row">
                {selectedForm.map((field, index) => (
                  <div key={field.id} className="col-md-6 mb-3 text-start">
                    <label className="form-label">
                      {field.text}{" "}
                      {field.required === "yes" && (
                        <span className="text-danger">*</span>
                      )}
                    </label>
                    {field.datatype === "select" ? (
                      <select className="form-select">
                        {field.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.datatype === "text" ? "text" : "number"}
                        className="form-control"
                        placeholder={`Enter ${field.text}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </form>
          ) : (
            <p>No data available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeadFormSummary;
