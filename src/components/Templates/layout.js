import React, { useState, useEffect } from "react";
import "./layout.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./template";
import TopBar from "./topbar";
import { FaAngleLeft, FaUserCircle } from "react-icons/fa";

const LayoutView = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Define mappings for navigation when clicking the back arrow
  console.log("Inside layout");
  const navigationMap = {
    "/createcampaignForm": "/campaignsummary",
    "/leadcreation": "/LeadSummary",
    "/leadFormGeneration": "/leadsformsummary",
    "/uploadcsv": "/LeadSummary",
    "/editlead/": "/LeadSummary",
    "/viewleadDetails/": "/LeadSummary",
  };

  // Handle back navigation
  const handleBackNavigation = () => {
    const path = Object.keys(navigationMap).find((key) =>
      location.pathname.startsWith(key)
    );
  
    const backPath = navigationMap[path] || "/dashboard"; // Default to dashboard
    navigate(backPath);
  };
  

  // Function to update the active tab label based on the current route
  useEffect(() => {
    const menuItems = [
      {
        key: "dashboard",
        label: "Dashboard Overview",
        path: "/dashboard",
      },
      {
        key: "campaign",
        label: "Campaign Summary",
        path: "/campaignsummary",
      },
      {
        key: "ConfigureForm",
        label: "Leads Form Generation",
        path: "/leadsformsummary",
      },
      {
        key: "leads",
        label: "Lead Summary",
        path: "/LeadSummary",
      },
      {
        key: "leadPipeline",
        label: "Lead Pipeline",
        path: "/leadPipline",
      },
      {
        key: "reports",
        label: "Reports",
        path: "/reports",
      },
      {
        key: "userManagement",
        label: "User Management",
        path: "/userManagement",
      },
      {
        key: "settings",
        label: "Settings",
        path: "/settings",
      },
      {
        key: "createcampaignform",
        label: "Create Campaign",
        path: "/createcampaignForm",
      },
      {
        key: "leadcreation",
        label: "Create Lead",
        path: "/leadcreation",
      },
      { key: "editLead", label: "Edit Lead", path: "/editlead/" },
      {
        key: "ViewLeadDetails",
        label: "View Details",
        path: "/viewleadDetails/",
      },
      {
        key: "leadFormGeneration",
        label: "Lead Form Generation",
        path: "/leadFormGeneration",
      },
      {
        key: "uploadcsv",
        label: "Upload CSV",
        path: "/uploadcsv",
      },
    ];
    const currentItem = menuItems.find(
      (item) =>
        item.path === location.pathname ||
        location.pathname.startsWith(item.path)
    );
    setActiveTab(currentItem ? currentItem.label : "");
  }, [location.pathname]);

  return (
    <div className="d-flex">
      <Sidebar
        isOpen={isOpen}
        closeSidebar={closeSidebar}
        onSelectTab={setActiveTab}
      />

      <div className="content flex-grow-1">
        <TopBar toggleSidebar={toggleSidebar} />

        <main
          className="d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "#FFF5F2",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <div className="childrensdiv bg-white d-flex flex-column">
            <div className="row">
              <div className="col-12 col-md-12 col-lg-12 p-4">
                {/* Common Header Section */}
                <div className="row d-flex align-items-center justify-content-between">
                  <div className="col-12 col-md-8 d-flex align-items-center">
                    <FaAngleLeft
                      onClick={handleBackNavigation}
                      style={{
                        fontSize: "2.5em",
                        color: "#314363",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                    />
                    <h4 className="mb-0 fw-medium" style={{ color: "#314363" }}>
                      {activeTab}
                    </h4>
                  </div>
                  <div className="col-12 col-md-4 d-flex align-items-center justify-content-end mt-3 mb-4">
                    <div className="d-flex align-items-center">
                      <div className="ms-3 me-3 text-end">
                        <p className="mb-0 fw-bold">Ravi Sutharsan</p>
                        <p className="mb-0">Campaign Manager</p>
                      </div>
                      <FaUserCircle
                        style={{ fontSize: "2.5em", color: "#314363" }}
                      />
                    </div>
                  </div>
                </div>
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutView;
