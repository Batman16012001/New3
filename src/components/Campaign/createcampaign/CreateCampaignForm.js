import React, { useEffect, useState } from "react";
import CampaignDetails from "./CampaignDetails";
import LeadCreationAccess from "./LeadCreationAccess";
import LinkToLeadForm from "./LinktoLeadForm";
import { useLocation, useNavigate } from "react-router-dom";
import { FaAngleLeft, FaUserCircle } from "react-icons/fa";

const CreateCampaignForm = () => {
  const [activeTab, setActiveTab] = useState(
    sessionStorage.getItem("activeTab") || "Campaign Information"
  );

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const location = useLocation();
  const campaign = location.state?.campaign;
  const deactivatedcampaign = campaign?.status?.toLowerCase() === "inactive";
  const isEditMode = !!campaign;

  const [campaignData, setCampaignData] = useState(campaign || {});
  const [leadAccessData, setLeadAccessData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const tabs = [
    { name: "Campaign Information", number: 1 },
    { name: "Set Lead Creators", number: 2 },
    { name: "Select Lead Form", number: 3 },
  ];

  return (
    <div className="container-fluid">
      {/* Navigation Tabs with Status Bar */}
      <div
        className="d-flex align-items-center justify-content-between position-relative"
        style={{ left: "12%" }}
      >
        {tabs.map((tab, index) => {
          const isDisabled =
            tab.name !== "Campaign Information" && !isFormSubmitted;
          const isActive = activeTab === tab.name;
          const isCompleted =
            index < tabs.findIndex((t) => t.name === activeTab);

          return (
            <div
              className="d-flex align-items-center flex-grow-1"
              key={tab.name}
            >
              {/* Step Circle */}
              <button
                className={`d-flex flex-column align-items-center text-center 
    ${
      isActive
        ? "#314363 fw-bold"
        : isDisabled
        ? "text-muted"
        : "text-secondary"
    }`}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "not-allowed",
                }}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default button behavior
                }}
              >
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center 
                    ${
                      isActive
                        ? "bg-success text-white"
                        : isCompleted
                        ? "bg-success text-white"
                        : "bg-light text-dark"
                    }`}
                  style={{
                    width: "40px",
                    height: "40px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    border: "2px solid white",
                  }}
                >
                  {tab.number}
                </div>
                <span>{tab.name}</span>
              </button>

              {/* Dotted Line Between Steps */}
              {index !== tabs.length - 1 && (
                <div
                  className="flex-grow-1"
                  style={{
                    borderTop: "2px dotted black",
                    margin: "0 10px",
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Render Tabs Conditionally */}
      <div className="tab-content mt-4">
        {activeTab === "Campaign Information" && (
          <CampaignDetails
            setIsFormSubmitted={setIsFormSubmitted}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            isEditMode={isEditMode}
            deactivatedcampaign={deactivatedcampaign}
          />
        )}
        {activeTab === "Set Lead Creators" && (
          <LeadCreationAccess
            setIsFormSubmitted={setIsFormSubmitted}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            setLeadAccessData={setLeadAccessData}
            isEditMode={isEditMode}
          />
        )}
        {activeTab === "Select Lead Form" && (
          <LinkToLeadForm
            setIsFormSubmitted={setIsFormSubmitted}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            setLeadAccessData={setLeadAccessData}
            campaignData={campaignData}
            leadAccessData={leadAccessData}
            isEditMode={isEditMode}
          />
        )}
      </div>
    </div>
  );
};

export default CreateCampaignForm;
