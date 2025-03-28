import axios from "axios";

const BASE_URL =
  "http://192.168.2.51:3006/lead-management-service/report/getReportData";

export const fetchReportData = async (filters) => {
  const {
    summaryBy,
    startDate,
    endDate,
    groupName,
    campaignName,
    branchName,
    unitName,
  } = filters;

  const queryParams = new URLSearchParams({
    summary_by: summaryBy,
    start_date: startDate,
    end_date: endDate,
    group_name: groupName,
    campaign_name: campaignName,
    branch_name: branchName,
    unit_name: unitName,
  }).toString();

  const url = `${BASE_URL}?${queryParams}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching report data:", error);
    throw error;
  }
};

export const fetchCampaignList = async (filters) => {
  const { startDate, endDate } = filters;

  const queryParams = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  }).toString();

  const url = `http://192.168.2.52:3006/lead-management-service/report/getReportCampaignList?${queryParams}`;
  console.log("url--->", url);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign list:", error);
    throw error;
  }
};

export const fetchGroupList = async () => {
  const url = `http://192.168.2.52:3006/lead-management-service/report/getReportGroupList`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching group list:", error);
    throw error;
  }
};

export const fetchBranchList = async (filters) => {
  const url = `http://192.168.2.52:3006/lead-management-service/report/getReportBranchList?group_code=${filters}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching branch list:", error);
    throw error;
  }
};

export const fetchUnitList = async (filters) => {
  const url = `http://192.168.2.52:3006/lead-management-service/report/getReportUnitList?branch_code=${filters}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching unit list:", error);
    throw error;
  }
};

export const fetchSummaryByList = async () => {
  const url = `http://192.168.2.52:3002/configurableItems/getConfigurableItems?module=reports`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching unit list:", error);
    throw error;
  }
};
