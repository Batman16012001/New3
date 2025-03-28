import axios from "axios";

const API_URL = "http://192.168.2.11:3004/leadManagement/viewLeads/";

const BASE_URL = "http://192.168.2.11:3002/configurableitems";
//const lead_id = "LD1740816375156WigHZ";
let userId = sessionStorage.getItem("UserID");

export const getLeadDetails = async (lead_id) => {
  try {
    const response = await axios.get(API_URL + lead_id);
    return response.data;
  } catch (error) {
    console.error("Error fetching lead details:", error);
    throw error;
  }
};

// export const OperateLead = async (leadId) => {
//   let payload = {
//     modified_by: String(userId ? userId : "12345"),
//     delete_lead: "Yes",
//   };
//   try {
//     const response = await axios.put(
//       `http://192.168.2.11:3004/leadManagement/deleteLead/${leadId}`,
//       payload
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error blocking lead:", error);
//     throw error;
//   }
// };

export const OperateLead = async (leadId, isBlocking, remark, userId) => {
  let payload = {
    lead_id: leadId,
    modified_by: String(userId || "12345"),
    current_stage: isBlocking ? "lead_lost" : "sourced",
    sub_stage: isBlocking ? "delete" : "",
    stage_remarks: remark,
    flag: "Block Lead",
  };

  console.log("OperateLead Payload:::", payload);

  try {
    const response = await axios.put(
      "http://192.168.2.11:3004/leadManagement/editLeadDetails",
      //192.168.2.11:3004/leadManagement/editLeadDetails
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

export const fetchBranches = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getBranchByDistrict`);
    return response.data.data; // Returns the array of branches
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw error;
  }
};

export const fetchSoCodes = async (branchCode) => {
  console.log("BranchCode::::", branchCode);
  try {
    const response = await axios.get(`${BASE_URL}/getSoBranch/${branchCode}`);
    return response.data.data; // Returns the array of SO codes
  } catch (error) {
    console.error("Error fetching SO codes:", error);
    throw error;
  }
};

export const updatedetails = async (data) => {
  console.log("dtaa got::", data);
  try {
    const response = await axios.put(
      "http://192.168.2.11:3004/leadManagement/maunalLeadReassign",
      data
    );
    return response;
  } catch (error) {
    console.log("Error while updating:::", error);
  }
};
