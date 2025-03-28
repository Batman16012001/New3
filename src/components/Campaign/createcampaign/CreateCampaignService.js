import axios from "axios";

export const fetchLeadUsers = async () => {
  try {
    const response = await axios.get(
      "http://192.168.2.11:3002/configurableItems/getConfigurableItems?module=campaignCreation"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign users:", error);
    return {}; // Return an empty object to avoid errors if fetch fails
  }
};

export const fetchLeadDropdowns = async () => {
  try {
    const response = await axios.get(
      "http://192.168.2.11:3002/configurableItems/getAllProvinceData"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign users:", error);
    return {}; // Return an empty object to avoid errors if fetch fails
  }
};

export const fetchHOUsersDropdowns = async () => {
  try {
    const response = await axios.get(
      "http://192.168.2.11:3002/configurableItems/selectHO"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign head office users:", error);
    return {}; // Return an empty object to avoid errors if fetch fails
  }
};

export const fetchLOPSUsersDropdowns = async () => {
  try {
    const response = await axios.get(
      "http://192.168.2.11:3002/configurableItems/selectLOPS"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign head office users:", error);
    return {}; // Return an empty object to avoid errors if fetch fails
  }
};

export const fetchHOBDropdowns = async (branch_code) => {
  try {
    const response = await axios.get(
      `http://192.168.2.11:3002/configurableItems/getHOBbyBranchCode/${branch_code}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign head office users:", error);
    return {}; // Return an empty object to avoid errors if fetch fails
  }
};

export const fetchUnitHeadDropdowns = async (branch_code) => {
  try {
    const response = await axios.get(
      `http://192.168.2.11:3002/configurableItems/getUnitHeadByHOBid/${branch_code}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign head office users:", error);
    return {}; // Return an empty object to avoid errors if fetch fails
  }
};

export const fetchLiasDropdowns = async (branch_code) => {
  try {
    const response = await axios.get(
      `http://192.168.2.11:3002/configurableItems/getLIAbyUnitHeadID/${branch_code}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign head office users:", error);
    return {}; // Return an empty object to avoid errors if fetch fails
  }
};

export const fetchBrokersListDropdowns = async () => {
  try {
    const response = await axios.get(
      "http://192.168.2.11:3002/configurableItems/getScWithBrokers"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign Brokers users:", error);
    return {}; // Return an empty object to avoid errors if fetch fails
  }
};

export const fetchDesignationListDropdowns = async () => {
  try {
    const response = await axios.get(
      "http://192.168.2.11:3002/configurableItems/getDesignation"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign Brokers users:", error);
    return {}; // Return an empty object to avoid errors if fetch fails
  }
};

export const fetchDepartmentListDropdowns = async () => {
  try {
    const response = await axios.get(
      "http://192.168.2.11:3002/configurableItems/getDepartment"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign Brokers users:", error);
    return {}; // Return an empty object to avoid errors if fetch fails
  }
};
