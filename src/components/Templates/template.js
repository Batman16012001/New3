import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Nav } from "react-bootstrap";
import { Link, Navigate, useLocation } from "react-router-dom";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation(); // Get the current route

  // added by ankita tank on 4mar25 According to User Role hide show module
  const userRole = sessionStorage.getItem("UserRole");
  console.log("User Role is a", userRole);
  const roleConfig = JSON.parse(
    sessionStorage.getItem("UserRoleBasedJson") || "{}"
  );
  console.log("Role Config", roleConfig);
  const modules = roleConfig[userRole]?.Modules || {};
  // end here

  return (
    <div
      className={`sidebar ${isOpen ? "open" : ""}`}
      style={{ backgroundColor: "#FFF5F2" }}
    >
      {/* Sidebar Content */}
      <div className="sidebar-content d-flex flex-column  vh-100 p-3">
        {/* Logo */}
        <div className="fw-bold fs-5 mb-4" style={{ padding: "10px" }}>
          <img
            src={`${process.env.PUBLIC_URL}/AccelLeadZ.png`}
            style={{ maxWidth: "30px", height: "auto", marginRight: "10px" }}
          />
          <span>AccelLeadZ</span>
        </div>

        {/* Navigation Items */}
        <Nav className="flex-column">
          {/* added by ankita tank on 4mar25 According to User Role hide showmodule */}
          {modules.Dashboard?.Visible && (
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/dashboard"
                className={`nav-link-custom ${
                  location.pathname === "/dashboard" ? "active" : ""
                }`}
                onClick={closeSidebar}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${
                    location.pathname === "/dashboard"
                      ? "DashboardActive.png"
                      : "Dashboard.png"
                  }`}
                  style={{
                    maxWidth: "20px",
                    height: "auto",
                    marginRight: "10px",
                  }}
                />
                Dashboard
              </Nav.Link>
            </Nav.Item>
          )}
          {/* added by ankita tank on 4mar25 According to User Role hide showmodule */}
          {modules.Campaign && (
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/campaignsummary"
                className={`nav-link-custom ${
                  ["/campaignsummary", "/createcampaignForm"].includes(
                    location.pathname
                  )
                    ? "active"
                    : ""
                }`}
                onClick={closeSidebar}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${
                    ["/campaignsummary", "/createcampaignForm"].includes(
                      location.pathname
                    )
                      ? "CampaignActive.png"
                      : "Campaign.png"
                  }`}
                  style={{
                    maxWidth: "20px",
                    height: "auto",
                    marginRight: "10px",
                  }}
                />
                Campaign
              </Nav.Link>
            </Nav.Item>
          )}
          {/* added by ankita tank on 4mar25 According to User Role hide showmodule */}
          {modules.ConfigureForm && (
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/leadsformsummary"
                className={`nav-link-custom ${
                  ["/leadsformsummary", "/leadFormGeneration"].includes(
                    location.pathname
                  )
                    ? "active"
                    : ""
                }`}
                onClick={closeSidebar}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${
                    ["/leadsformsummary", "/leadFormGeneration"].includes(
                      location.pathname
                    )
                      ? "ConfigureFormActive.png"
                      : "ConfigureForm.png"
                  }`}
                  style={{
                    maxWidth: "20px",
                    height: "auto",
                    marginRight: "10px",
                  }}
                />
                Configure Form
              </Nav.Link>
            </Nav.Item>
          )}
          {/* added by ankita tank on 4mar25 According to User Role hide showmodule */}
          {modules.Leads && (
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/LeadSummary"
                className={`nav-link-custom ${
                  ["/LeadSummary", "/leadcreation", "/uploadcsv"].includes(
                    location.pathname
                  ) ||
                  location.pathname.startsWith("/editlead/") ||
                  location.pathname.startsWith("/viewleadDetails/")
                    ? "active"
                    : ""
                }`}
                onClick={closeSidebar}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${
                    ["/LeadSummary", "/leadcreation", "/uploadcsv"].includes(
                      location.pathname
                    ) ||
                    location.pathname.startsWith("/editlead/") ||
                    location.pathname.startsWith("/viewleadDetails/")
                      ? "LeadActive.png"
                      : "Lead.png"
                  }`}
                  style={{
                    maxWidth: "20px",
                    height: "auto",
                    marginRight: "10px",
                  }}
                />
                Leads Summary
              </Nav.Link>
            </Nav.Item>
          )}
          {/* added by ankita tank on 4mar25 According to User Role hide showmodule */}
          {/* {modules.LeadPipeline?.Visible && (
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/leadPipline"
                className={`nav-link-custom ${
                  location.pathname === "/leadPipline" ? "active" : ""
                }`}
                
                onClick={closeSidebar}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${
                    location.pathname === "/leadPipline"
                      ? "LeadPiplineActive.png"
                      : "LeadPipline.png"
                  }`}
                  style={{
                    maxWidth: "20px",
                    height: "auto",
                    marginRight: "10px",
                  }}
                />
                Lead Pipeline
              </Nav.Link>
            </Nav.Item>
          )} */}
          {/* added by ankita tank on 4mar25 According to User Role hide showmodule */}
          {modules.Reports?.Visible && (
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/reports"
                className={`nav-link-custom ${
                  location.pathname === "/reports" ? "active" : ""
                }`}
                onClick={closeSidebar}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${
                    location.pathname === "/reports"
                      ? "ReportsActive.png"
                      : "Reports.png"
                  }`}
                  style={{
                    maxWidth: "20px",
                    height: "auto",
                    marginRight: "10px",
                  }}
                />
                Reports
              </Nav.Link>
            </Nav.Item>
          )}
          {/* added by ankita tank on 4mar25 According to User Role hide showmodule */}
          {modules.UserManagement?.Visible && (
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/userManagement"
                className={`nav-link-custom ${
                  location.pathname === "/userManagement" ? "active" : ""
                }`}
                onClick={closeSidebar}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${
                    location.pathname === "/userManagement"
                      ? "UserManagementActive.png"
                      : "UserManagement.png"
                  }`}
                  style={{
                    maxWidth: "20px",
                    height: "auto",
                    marginRight: "10px",
                  }}
                />
                User Management
              </Nav.Link>
            </Nav.Item>
          )}
          {/* added by ankita tank on 4mar25 According to User Role hide showmodule */}
          {modules.Settings?.Visible && (
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/settings"
                className={`nav-link-custom ${
                  location.pathname === "/settings" ? "active" : ""
                }`}
                onClick={closeSidebar}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${
                    location.pathname === "/settings"
                      ? "SettingsActive.png"
                      : "Settings.png"
                  }`}
                  style={{
                    maxWidth: "20px",
                    height: "auto",
                    marginRight: "10px",
                  }}
                />
                Settings
              </Nav.Link>
            </Nav.Item>
          )}

          <Nav.Item className="logout-item d-flex justify-content-center align-items-center">
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link-custom logout-link mt-2${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              <img
                src={"/logout.png"}
                style={{
                  maxWidth: "17px",
                  height: "auto",
                  marginRight: "10px",
                }}
              />
              Logout
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
