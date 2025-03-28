import axios from "axios";
//const BASE_URL =  'http://192.168.2.198:3005/lead-management-service/campaign/getCampaignDetails/:12344'
//const BASE_URL = "http://192.168.2.198:3005/lead-management-service/campaign";
const BASE_URL = "http://192.168.2.11:3001/campaignManagement";
const userId = sessionStorage.getItem("UserID");

export const fetchCampaignSummaryDetails = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/getCampaignDetails?created_by=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign summary:", error);
    throw error;
  }
};

// services/campaignService.js

const API_BASE_URL = "http://192.168.2.11:3001/campaignManagement";

export const deactivateCampaignAPI = async (campaignId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/editCampaignDetails/${campaignId}`,
      {
        modified_by: String(userId),
        delete_campaign: "Yes",
      }
    );

    return { response };
  } catch (error) {
    console.error("Error in deactivateCampaignAPI:", error);
  }
};
