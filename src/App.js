// import logo from './logo.svg';
// import './App.css';

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import LeadFormGeneration from "./components/Lead/LeadFormGeneration/LeadFormGeneration";
import LayoutView from "./components/Templates/layout";
import LeadFormSummary from "./components/Lead/LeadFormSummary/LeadFormSummary";
import CampaignSummary from "./components/Campaign/campaignsummary/campaignsummary";
import LoginPage from "./components/Login/LoginPage";
import CreateCampaignForm from "./components/Campaign/createcampaign/CreateCampaignForm";
import Dashboard from "./components/Dashboard/Dashboard";
import CampaignDetails from "./components/Campaign/createcampaign/CampaignDetails";
import LinkToLeadForm from "./components/Campaign/createcampaign/LinktoLeadForm";
import ForgotPassword from "./components/Login/ForgotPassword";

import ViewLeadDetails from "./components/Lead/ViewLeads/ViewLeads";

// import ViewLeadDetails from './components/Lead/ViewLeads/ViewLeads';
import Leadsummary from "./components/Lead/leadSummary/leadSummary";
import LeadCreation from "./components/Lead/LeadCreation/LeadCreation";
import UploadCsv from "./components/Lead/UploadCsv/UploadCsv";
import IdleLogoutHandler from "./components/Login/IdleLogoutHandler"; // Import new component
import Reports from "./components/Reports/Reports";

const App = () => {
  return (
    <Router>
      <IdleLogoutHandler /> {/* Add IdleLogoutHandler Here */}
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <LayoutView>
              <Dashboard />
            </LayoutView>
          }
        />
        <Route
          path="/createcampaignForm"
          element={
            <LayoutView>
              <CreateCampaignForm />
            </LayoutView>
          }
        />
        <Route
          path="/campaignsummary"
          element={
            <LayoutView>
              <CampaignSummary />
            </LayoutView>
          }
        ></Route>
        <Route
          path="/leadsformsummary"
          element={
            <LayoutView>
              <LeadFormSummary />
            </LayoutView>
          }
        ></Route>
        <Route
          path="/leadFormGeneration"
          element={
            <LayoutView>
              <LeadFormGeneration />
            </LayoutView>
          }
        ></Route>
        <Route
          path="/createcampaignform"
          element={<CreateCampaignForm />}
        ></Route>
        <Route path="/linktoleadform" element={<LinkToLeadForm />}></Route>

        <Route
          path="/viewleadDetails/:leadID"
          element={
            <LayoutView>
              <ViewLeadDetails />
            </LayoutView>
          }
        ></Route>

        <Route
          path="/LeadSummary"
          element={
            <LayoutView>
              <Leadsummary />
            </LayoutView>
          }
        ></Route>
        <Route
          path="/leadcreation"
          element={
            <LayoutView>
              <LeadCreation />
            </LayoutView>
          }
        ></Route>
        <Route
          path="/editlead/:leadID"
          element={
            <LayoutView>
              <LeadCreation />
            </LayoutView>
          }
        ></Route>
        <Route
          path="/uploadcsv"
          element={
            <LayoutView>
              <UploadCsv />
            </LayoutView>
          }
        ></Route>
        <Route
          path="/reports"
          element={
            <LayoutView>
              <Reports />
            </LayoutView>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
