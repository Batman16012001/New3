



export const fetchLeadFormSummaryDetails = async () => {
  try {
    const response = await fetch("http://192.168.2.11:3003/leadFormManagement/getLeadFormLists?created_by=super_admin");// there should be loginid in place of super_admin
     //http://192.168.2.11:3003/leadFormManagement/getLeadFormLists?created_by=super_admin

    const data = await response.json();
    console.log("API Data:", data);

    if (data) {
      return [...data.data].sort(
        (a, b) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
    );
    } else {
      throw new Error("Invalid data format received from API");
    }
  } catch (e) {
    console.error("Error while fetching:", e);
    
  } 
};



  