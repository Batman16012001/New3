import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  campaignDataredux: {}, // No need for sessionStorage; redux-persist will handle persistence
  commingfromleadorcampaign: "", // To store from where the user is coming
  leadFormName: "", // To retrieve the lead form name when going through a campaign
  selectedFormType: "",
  selectedleadaccessdata: "", // Ensure consistency in naming
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setCampaignDataredux: (state, action) => {
      state.campaignDataredux = action.payload; // Directly set the payload instead of merging
    },
    setcommingfrom: (state, action) => {
      state.commingfromleadorcampaign = action.payload;
    },
    setLeadFormName: (state, action) => {
      state.leadFormName = action.payload;
    },
    setSelectedFormType: (state, action) => {
      state.selectedFormType = action.payload;
    },
    setselectedleadaccessdata: (state, action) => {
      state.selectedleadaccessdata = action.payload;
    },
  },
});

export const {
  setCampaignDataredux,
  setcommingfrom,
  setLeadFormName,
  setSelectedFormType,
  setselectedleadaccessdata,
} = campaignSlice.actions;

export default campaignSlice.reducer;
