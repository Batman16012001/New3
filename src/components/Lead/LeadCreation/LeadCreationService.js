import { API_BASE_URL } from "../../../environment";
import axios from "axios";

const BASE_URL = "http://192.168.2.11:3001/campaignManagement";
const API_URL = "http://192.168.2.11:3004/leadManagement/viewLeads/";

export const fetchCampaignNameDetails = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/getCampaignDetails?created_by=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign summary:", error);
    throw error;
  }
};

export const fetchLeadFormSummaryDetails = async () => {
  try {
    const response = await fetch(
      "http://192.168.2.11:3003/leadFormManagement/getLeadFormLists?created_by=super_admin"
    );

    const data = await response.json();
    console.log("API Data:", data);

    if (data) {
      return [...data.data].sort(
        (a, b) =>
          new Date(b.creation_date).getTime() -
          new Date(a.creation_date).getTime()
      );
    } else {
      throw new Error("Invalid data format received from API");
    }
  } catch (e) {
    console.error("Error while fetching:", e);
  }
};

export const createLeadForm = async (createpayload) => {
  try {
    const response = await fetch(
      "http://192.168.2.11:3004/leadManagement/leadCreation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createpayload),
      }
    );

    const data = await response.json();
    console.log("API Create Lead Data:", data);
    return data; // Return data instead of the response
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error so it gets caught in the try-catch block above
  }
};

export const updateLeadForm = async (editpayload) => {
  try {
    const response = await fetch(
      "http://192.168.2.11:3004/leadManagement/editLeadDetails",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editpayload),
      }
    );

    const data = await response.json();
    console.log("API update Lead Data:", data);
    return data; // Return data instead of the response
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error so it gets caught in the try-catch block above
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
