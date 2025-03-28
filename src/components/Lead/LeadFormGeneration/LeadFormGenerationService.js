import { API_BASE_URL } from "../../../environment";
const my_url = "http://192.168.2.55:5000/";

export const saveForm = async (formName, addedFields) => {
  const leadformid = `${formName
    .replace(/\s+/g, "_")
    .toLowerCase()}_${Math.floor(Math.random() * 10000)}`;

  const formStructure = {
    name: formName,
    fields: addedFields,
    createdBy: "super_admin",
    url: API_BASE_URL,
    layout: {
      columns: 2,
      rows: Math.ceil(addedFields.length / 2),
    },
    cssClasses: "grid grid-cols-2 gap-4",
  };

  console.log("Form Structure:::", JSON.stringify(formStructure));

  try {
    // const response = await fetch(API_BASE_URL+"api/leadFormManagement/saveLeadForm ", {
    const response = await fetch(
      "http://192.168.2.11:3003/leadFormManagement/saveLeadForm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formStructure),
      }
    );

    const responseData = await response.json();
    console.log("API Response:", responseData);

    if (!response.ok) {
      //alert(`Form saved successfully with formName: ${formName}`);
      console.log("Error saving form!");
    }
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    alert("Error saving form!");
  }
};

export const fetchFields = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}leadFormManagement/leadFormsFields`
    );
    const data = await response.json();
    console.log("API Response:", data);
    return data.fields || data;
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return [];
  }
};
