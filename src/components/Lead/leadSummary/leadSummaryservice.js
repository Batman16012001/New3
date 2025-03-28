import axios from "axios";
//const BASE_URL =  'http://192.168.2.198:3005/lead-management-service/campaign/getCampaignDetails/:12344'
//const BASE_URL = "http://192.168.2.198:3005/lead-management-service/campaign";
const BASE_URL = "http://192.168.2.11:3004/leadManagement";

const API_URL = "http://192.168.2.11:3004/leadManagement/viewLeads/";

export const fetchLeadSummaryDetails = async (userId) => {
  try {
    // const response = await axios.get(`${BASE_URL}/getLeads/${userId}`);
    const response = await axios.get(`${BASE_URL}/getLeads/000001?deleted=No`);
    return response.data;
  } catch (error) {
    console.error("Error fetching LEAD summary:", error);
    throw error;
  }
};

export const fnSoftDeleteLead = async (lead_id, Flag) => {
  try {
    const response = await axios.put(`${BASE_URL}/deleteLead/${lead_id}`, {
      modified_by: "000001",
      delete_lead: Flag,
    });

    console.log("Updated data:", response.data);
  } catch (error) {
    console.error("Error updating data", error);
  }
};

export const getLeadDetails = async (lead_id) => {
  try {
    const response = await axios.get(API_URL + lead_id);
    return response.data;
  } catch (error) {
    console.error("Error fetching lead details:", error);
    throw error;
  }
};
