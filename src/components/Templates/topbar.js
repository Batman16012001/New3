import React from "react";
import { FaBars, FaBell, FaCog, FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const TopBar = ({ toggleSidebar }) => {
  const location = useLocation();

  const pageTitles = {
    "/campaignsummary": "Campaign Summary",
    "/leadsformsummary": "Lead Form Summary",
    "/leadFormGeneration": "Lead Form Generation",
    "/createcampaignForm": "Create Campaign",
    "/formfields": "Leads Form Fields",
    "/contacts": "Contacts Module",
    "/pipelines": "Manage Pipelines",
    "/dashboard": "Dashboard",
  };

  const currentPage = pageTitles[location.pathname] || "Dashboard";

  return (
    <div
      className="topbar d-flex justify-content-between align-items-center"
      style={{ float: "right" }}
    >
      <button className="btn d-md-none" onClick={toggleSidebar}>
        <FaBars size={24} />
      </button>
    </div>
  );
};

export default TopBar;
