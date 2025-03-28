import axios from "axios";

const BASE_URL = "http://192.168.2.11:3001/campaignManagement";

export const fetchCampaignNameDetails = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/getCampaignDetails?created_by=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign summary:", error);
    throw error;
  }
};