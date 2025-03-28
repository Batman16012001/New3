import React, { useState, useEffect } from "react";
import {
  fetchBranchList,
  fetchCampaignList,
  fetchGroupList,
  fetchReportData,
  fetchSummaryByList,
  fetchUnitList,
} from "./ReportsService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./Reports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const Reports = () => {
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [summarylist, setSummaryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const summaryOptions = summarylist;

  const campaigns = campaignList;

  const groups = groupList;

  const branches = branchList;

  const units = unitList;

  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilters((prev) => ({ ...prev, [name]: value }));
  // };

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({ ...prev, [name]: value }));

    try {
      const data = await fetchGroupList();
      setGroupList(data.data.GroupList);
      console.log(`Data fetched for group list:`, data.data.GroupList);

      if (value) {
        console.log("value", value);
        const branchData = await fetchBranchList(value);

        setBranchList(branchData.data.BranchList);
        console.log(
          `Data fetched for branch list:`,
          branchData.data.BranchList
        );
      }
    } catch (error) {
      console.error(`Error fetching group list:`, error);
    }
  };

  const handleBranchFilterChange = async (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({ ...prev, [name]: value }));

    try {
      if (value) {
        console.log("value", value);
        const unitdata = await fetchUnitList(value);

        setUnitList(unitdata.data.UnitList);
        console.log(`Data fetched for unit list:`, unitdata);
      }
    } catch (error) {
      console.error(`Error fetching units list:`, error);
    }
  };

  //Handle function for change in value of Unit
  const handleUnitsFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = async (e) => {
    const { name, value } = e.target;

    // Update filters state
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
      return updatedFilters;
    });
    // Ensure the latest state is used
    const updatedFilters = {
      ...filters,
      [name]: value,
    };
    // Check if both dates are selected before making the API call
    if (updatedFilters.startDate && updatedFilters.endDate) {
      try {
        const data = await fetchCampaignList({
          startDate: updatedFilters.startDate,
          endDate: updatedFilters.endDate,
        });

        console.log("Campaign list fetched:", data.data.CampaignList);
        setCampaignList(data.data.CampaignList);
      } catch (error) {
        console.error("Error fetching campaign list:", error);
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchReportData(filters);
      console.log("Report Data:", data);
      setReportData(data.data.reportData);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic columns based on the selected filter
  // const getDynamicColumns = (item) => {
  //   console.log("Item:", item);
  //   // const columns = ["Campaign Name"];
  //   const columns = [];

  //   if (filters.summaryBy === "Campaign_Type") {
  //     columns.push("Campaign Type");
  //   } else if (filters.summaryBy === "Campaign_Name") {
  //     columns.push("Campaign Name");
  //   } else if (filters.summaryBy === "Group") {
  //     columns.push("Group");
  //   } else if (filters.summaryBy === "Branch") {
  //     columns.push("Group", "Branch");
  //   } else if (filters.summaryBy === "Unit") {
  //     columns.push("Group", "Branch", "Unit");
  //   } else if (filters.summaryBy === "LIA") {
  //     columns.push("Group", "Branch", "Unit", "LIA");
  //   }

  //   return columns;
  // };

  const getDynamicColumns = () => {
    const columnsMap = {
      Campaign_Type: ["Campaign Type"],
      Campaign_Name: ["Campaign Name"],
      Group: ["Group"],
      Branch: ["Group", "Branch"],
      Unit: ["Group", "Branch", "Unit"],
      LIA: ["Group", "Branch", "Unit", "SO Code"],
    };

    return columnsMap[filters.summaryBy] || [];
  };

  // Dynamic data rendering based on the selected filter
  const getDynamicData = (item) => {
    // const data = [item.Campaign_Name];
    const data = [];

    if (filters.summaryBy === "Campaign_Type") {
      data.push(item.Campaign_Type);
    } else if (filters.summaryBy === "Campaign_Name") {
      data.push(item.Campaign_Name);
    } else if (filters.summaryBy === "Group") {
      data.push(item.Group_Code);
    } else if (filters.summaryBy === "Branch") {
      data.push(item.Group_Code, item.Branch_Code);
    } else if (filters.summaryBy === "Unit") {
      data.push(item.Group_Code, item.Branch_Code, item.Unit_Code);
    } else if (filters.summaryBy === "LIA") {
      data.push(
        item.Group_Code,
        item.Branch_Code,
        item.Unit_Code,
        item.so_code
      );
    }

    return data;
  };

  const isGenerateButtonDisabled = () => {
    if (!filters.summaryBy || filters.summaryBy === "Select") return true;
    if (!filters.startDate || !filters.endDate) return true;

    if (
      (filters.summaryBy === "Group" ||
        filters.summaryBy === "Branch" ||
        filters.summaryBy === "Unit" ||
        filters.summaryBy === "LIA") &&
      !filters.campaignName
    ) {
      return true;
    }

    if (
      (filters.summaryBy === "Branch" ||
        filters.summaryBy === "Unit" ||
        filters.summaryBy === "LIA") &&
      !filters.groupName
    ) {
      return true;
    }

    if (
      (filters.summaryBy === "Unit" || filters.summaryBy === "LIA") &&
      !filters.branchName
    ) {
      return true;
    }

    if (filters.summaryBy === "LIA" && !filters.unitName) {
      return true;
    }

    return false;
  };

  const totalPages = Math.ceil(reportData.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = reportData.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await fetchSummaryByList();
      setSummaryList(data.data.summary_by.DropdownValues);
      console.log(
        `Data fetched for summary list:`,
        data.data.summary_by.DropdownValues
      );
    };

    fetchSummary();
  }, []);

  const exportToExcel = () => {
    if (currentData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "Sr No",
      ...getDynamicColumns(),
      "Total Leads",
      "Total Assigned",
      "Total Approached",
      "Total Converted",
      "Total Unsuccessful",
    ];

    const excelData = currentData.map((item, index) => {
      const row = [
        startIndex + index + 1,
        ...getDynamicData(item),
        item.Total_Leads,
        item.Total_Leads_Assigned,
        item.Total_Approached_Leads,
        item.Total_Converted_Leads,
        item.Total_Unsuccessful_Leads,
      ];
      return row;
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...excelData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const excelFile = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(excelFile, "report.xlsx");
  };

  return (
    <div className="report-screen">
      {/* Filters */}
      <div className="row pb-3">
        <div className="col-4">
          <div className="row">
            <div className="col-4">
              <div className="filter-group floating-select">
                <label
                  className={filters.summaryBy ? "floating active" : "floating"}
                >
                  Summary By
                </label>
                <select
                  className="form-select selectinput"
                  name="summaryBy"
                  value={filters.summaryBy || ""}
                  onChange={handleFilterChange}
                >
                  <option value="" disabled hidden></option>
                  {summaryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-8">
              <div className="row">
                <div className="col-6">
                  <div className="filter-group floating-select">
                    <input
                      type="date"
                      name="startDate"
                      value={filters.startDate || ""}
                      onChange={handleDateChange}
                      className="dateinput"
                      placeholder=" "
                    />
                    <label className={filters.startDate ? "active" : "active"}>
                      Start Date
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="filter-group floating-select">
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate || ""}
                      onChange={handleDateChange}
                      className="dateinput"
                      placeholder=" "
                    />
                    <label className={filters.endDate ? "active" : "active"}>
                      End Date
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-3">
          {(filters.summaryBy === "Group" ||
            filters.summaryBy === "Branch" ||
            filters.summaryBy === "Unit" ||
            filters.summaryBy === "LIA") && (
            <>
              <div className="row">
                <div className="col-6">
                  <div className="filter-group floating-select">
                    {/* <label>Campaign Name:</label> */}
                    <label
                      className={
                        filters.campaignName ? "floating active" : "floating"
                      }
                    >
                      Campaign Name
                    </label>
                    <select
                      name="campaignName"
                      value={filters.campaignName || ""}
                      onChange={handleFilterChange}
                      className="form-select selectinput"
                    >
                      <option value="" hidden></option>
                      {campaigns.map((campaign) => (
                        <option
                          key={campaign.campaign_id}
                          value={campaign.campaign_id}
                        >
                          {campaign.campaign_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <div className="filter-group floating-select">
                    {/* <label>Group:</label> */}
                    <label
                      className={
                        filters.groupName ? "floating active" : "floating"
                      }
                    >
                      Group
                    </label>
                    <select
                      name="groupName"
                      value={filters.groupName || ""}
                      onChange={handleFilterChange}
                      className="form-select selectinput"
                    >
                      <option value="" hidden></option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.name}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="col-2">
          <div className="row">
            {(filters.summaryBy === "Branch" ||
              filters.summaryBy === "Unit" ||
              filters.summaryBy === "LIA") && (
              <div className="col-6">
                <>
                  <div className="filter-group floating-select">
                    <label
                      className={
                        filters.branchName ? "floating active" : "floating"
                      }
                    >
                      Branch
                    </label>
                    <select
                      name="branchName"
                      value={filters.branchName || ""}
                      onChange={handleBranchFilterChange}
                      className="form-select selectinput"
                    >
                      <option value="" hidden></option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.name}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              </div>
            )}
            {(filters.summaryBy === "Unit" || filters.summaryBy === "LIA") && (
              <div className="col-6">
                <>
                  <div className="filter-group floating-select">
                    <label
                      className={
                        filters.unitName ? "floating active" : "floating"
                      }
                    >
                      Unit
                    </label>
                    <select
                      name="unitName"
                      value={filters.unitName || ""}
                      onChange={handleUnitsFilterChange}
                      className="form-select selectinput"
                    >
                      <option value="" hidden></option>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.name}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              </div>
            )}
          </div>
        </div>
        <div className="col-3">
          <div className="row">
            <div className="col-4"></div>
            <div className="col-8">
              <div className="">
                {!isGenerateButtonDisabled() && (
                  <button
                    className={`bottombuttonReports me-5 ${
                      isGenerateButtonDisabled()
                        ? "disabled-button"
                        : "enabled-button"
                    }`}
                    onClick={fetchData}
                    disabled={isGenerateButtonDisabled()}
                  >
                    Generate Report
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-9"></div>

        <div className="col-2" style={{ textAlign: "right" }}>
          {currentData.length > 0 && (
            <div className=" pb-2 pl-2">
              <FontAwesomeIcon
                icon={faDownload}
                className="downloadReportIcon"
                onClick={exportToExcel}
              />
              <span onClick={exportToExcel} className="downloadReport">
                {"  "}
                Download
              </span>
            </div>
          )}
        </div>
        <div className="col-1"></div>
      </div>

      {/* Report Table */}
      <table className="campaign-table">
        <thead>
          <tr>
            <th>Sr No</th>
            {getDynamicColumns().map((col, index) => (
              <th key={index}>{col}</th>
            ))}
            <th>Total Leads</th>
            <th>Total Assigned</th>
            <th>Total Approached</th>
            <th>Total Converted</th>
            <th>Total Unsuccessful</th>
          </tr>
        </thead>

        <tbody>
          {currentData.length > 0 ? (
            currentData.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>{startIndex + index + 1}</td>
                {getDynamicData(item).map((data, idx) => (
                  <td key={idx}>{data}</td>
                ))}
                <td>{item.Total_Leads}</td>
                <td>{item.Total_Leads_Assigned}</td>
                <td>{item.Total_Approached_Leads}</td>
                <td>{item.Total_Converted_Leads}</td>
                <td>{item.Total_Unsuccessful_Leads}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Reports;
