import "./CreateCampaignForm.css";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import axios from "axios";
import {
  fetchLeadUsers,
  fetchLeadDropdowns,
  fetchHOUsersDropdowns,
  fetchLOPSUsersDropdowns,
  fetchHOBDropdowns,
  fetchUnitHeadDropdowns,
  fetchLiasDropdowns,
  fetchBrokersListDropdowns,
  fetchDesignationListDropdowns,
  fetchDepartmentListDropdowns,
} from "./CreateCampaignService.js";
import Select from "react-select";
import { Form, Button, Card, Row, Col, Table, Modal } from "react-bootstrap";
import { setselectedleadaccessdata } from "../../store/campaignSlice.js";

const LeadCreationAccess = ({
  setIsFormSubmitted,
  setActiveTab,
  activeTab,
  setLeadAccessData,
  isEditMode,
}) => {
  // console.log("Active Tab:",activeTab);
  const [users, setUsers] = useState([]);
  const [leadForms, setLeadForms] = useState([]);
  const [leadFormsDropdown, setLeadFormsDropdown] = useState([]);
  const [branchLookup, setBranchLookup] = useState([]);

  // Options Data
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState({});
  const [branchOptions, setBranchOptions] = useState({});
  // const [hobOptions, setHobOptions] = useState([]);
  const [hoOptions, setHoOptions] = useState([]);
  const [lopsOptions, setLopsOptions] = useState([]);
  const [brokersOptions, setBrokersOptions] = useState([]); //shubham
  const [designationOptions, setDesignationOptions] = useState([]); //shubham
  const [departmentOptions, setDepartmentOptions] = useState([]); //shubham
  const [uniHeadOption, setUniHeadOption] = useState([]);
  const [liasOption, setLIASOption] = useState([]);

  // Selected Values
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState({});
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedHO, setSelectedHO] = useState([]);
  const [selectedLOPS, setSelectedLOPS] = useState([]);

  const [selectedBrokers, setSelectedBrokers] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);

  // const [selectedUnitHead,setSelectedUnitHead] = useState([]);
  const [selectedLIAS, setSelectedLIAS] = useState([]);

  //shubham
  const [branchSelectOptions, setBranchSelectOptions] = useState([]);
  const [hobOptions, setHobOptions] = useState([]);
  const [unitHeadOptions, setUnitHeadOptions] = useState([]);
  const [liaOptions, setLiaOptions] = useState([]);

  const [selectedHob, setSelectedHob] = useState([]);
  const [selectedUnitHead, setSelectedUnitHead] = useState([]);
  const [selectedLia, setSelectedLia] = useState([]);

  const [getActiveTab, setActiveTabName] = useState([]);

  const leadaccessDataRedux = useSelector(
    (state) => state.campaign.selectedleadaccessdata
  );

  console.log("leadaccessDataRedux->>", leadaccessDataRedux);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      leadCreationAccess: [], // Checkbox values
      provinceSelection: [],
      districtSelection: [],
      branchSelection: [],
      hobSelection: [],
      unitHeadSelection: [],
      liaSelection: [],
      hoSelection: [],
      lopsSelection: [],
      brokerSelection: [],
      designationSelection: [],
      departmentSelection: [],
    },

    validationSchema: Yup.object().shape({
      leadCreationAccess: Yup.array()
        .min(1, "Select at least one user")
        .required("Required"),
      provinceSelection: Yup.array().when("leadCreationAccess", {
        is: (leadCreationAccess) => leadCreationAccess.includes("Sales_Office"),
        then: (schema) =>
          schema.min(1, "Select at least one province").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      districtSelection: Yup.array().when("leadCreationAccess", {
        is: (leadCreationAccess) => leadCreationAccess.includes("Sales_Office"),
        then: (schema) =>
          schema.min(1, "Select at least one district").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      branchSelection: Yup.array().when("leadCreationAccess", {
        is: (leadCreationAccess) => leadCreationAccess.includes("Sales_Office"),
        then: (schema) =>
          schema.min(1, "Select at least one branch").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      hobSelection: Yup.array().when("leadCreationAccess", {
        is: (leadCreationAccess) => leadCreationAccess.includes("Sales_Office"),
        then: (schema) =>
          schema.min(1, "Select at least one HOB").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      unitHeadSelection: Yup.array().when("leadCreationAccess", {
        is: (leadCreationAccess) => leadCreationAccess.includes("Sales_Office"),
        then: (schema) =>
          schema.min(1, "Select at least one Unit Head").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      liaSelection: Yup.array().when("leadCreationAccess", {
        is: (leadCreationAccess) => leadCreationAccess.includes("Sales_Office"),
        then: (schema) =>
          schema.min(1, "Select at least one LIA").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      hoSelection: Yup.array().when("leadCreationAccess", {
        is: (leadCreationAccess) => leadCreationAccess.includes("Head_Office"),
        then: (schema) =>
          schema.min(1, "Select at least one Head Office").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      designationSelection: Yup.array().when("leadCreationAccess", {
        is: (leadCreationAccess) => leadCreationAccess.includes("Head_Office"),
        then: (schema) =>
          schema.min(1, "Select at least one Designation").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      departmentSelection: Yup.array().when("leadCreationAccess", {
        is: (leadCreationAccess) => leadCreationAccess.includes("Head_Office"),
        then: (schema) =>
          schema.min(1, "Select at least one Department").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      lopsSelection: Yup.array().when("leadCreationAccess", {
        is: (leadCreationAccess) => leadCreationAccess.includes("Head_Office"),
        then: (schema) =>
          schema.min(1, "Select at least one Life OPS").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      brokerSelection: Yup.array().when("leadCreationAccess", {
        is: (leadCreationAccess) => leadCreationAccess.includes("Broker"),
        then: (schema) =>
          schema.min(1, "Select at least one Broker").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),

    onSubmit: (values) => {
      //  e.preventDefault();
      console.log("Form submitted successfully", values);
      // setIsFormSubmitted(true);

      const selectedData = {
        lead_creation_access: getActiveTab,
        provinces: selectedProvinces,
        districts: selectedDistricts,
        branches: selectedBranches,
        hobs: selectedHob.map((hob) => hob.value),
        unitHeads: selectedUnitHead.map((uh) => uh.value),
        lias: selectedLia.map((lia) => lia.value),
      };

      console.log("Collected JSON Data:", selectedData);

      console.log("Changing Active Tab to 'Link to Lead Form'");
      setActiveTab("Link to Lead Form");
      setLeadAccessData(values);
    },
  });

  const handleNextClick = async () => {
    console.log("Selected Data:", {
      leadCreationAccess: formik.values.leadCreationAccess,
      selectedProvinces,
      selectedDistricts,
      selectedBranches,
      selectedHob,
      selectedUnitHead,
      selectedLia,
      selectedHO,
      selectedLOPS,
      selectedBrokers,
      selectedDesignation,
      selectedDepartment,
    });
    const selectedData = {
      leadCreationAccess: formik.values.leadCreationAccess,
      selectedProvinces,
      selectedDistricts,
      selectedBranches,
      selectedHob,
      selectedUnitHead,
      selectedLia,
      selectedHO,
      selectedLOPS,
      selectedBrokers,
      selectedDesignation,
      selectedDepartment,
    };

    formik.handleSubmit();

    // setActiveTab("Select Lead Form");

    const errors = await formik.validateForm();
    console.log("Validation Errors:", errors);

    if (Object.keys(errors).length === 0) {
      dispatch(setselectedleadaccessdata(selectedData));
      console.log("Data after dispatching:::", selectedData);

      setActiveTab("Select Lead Form");
    }
  };

  const handlePreviousClick = () => {
    setActiveTab("Campaign Information");
  };

  useEffect(() => {
    //important
    if (
      leadaccessDataRedux &&
      Object.keys(leadaccessDataRedux).length > 0 &&
      JSON.stringify(formik.values.leadCreationAccess) !==
        JSON.stringify(leadaccessDataRedux.leadCreationAccess)
    ) {
      // formik.setValues({
      //   ...formik.values,
      //   leadCreationAccess: leadaccessDataRedux.leadCreationAccess || [],
      //   provinceSelection: leadaccessDataRedux.selectedProvinces || [],
      //   districtSelection: Object.values(
      //     leadaccessDataRedux.selectedDistricts || {}
      //   ).flat(),
      //   branchSelection: Object.values(
      //     leadaccessDataRedux.selectedBranches || {}
      //   ).flat(),
      //   hobSelection:
      //     leadaccessDataRedux.selectedHob.map((option) => option.value) || [],
      //   unitHeadSelection:
      //     leadaccessDataRedux.selectedUnitHead.map((option) => option.value) ||
      //     [],
      //   liaSelection:
      //     leadaccessDataRedux.selectedLia.map((option) => option.value) || [],
      //   hoSelection: leadaccessDataRedux.selectedHO || [],
      //   lopsSelection: leadaccessDataRedux.selectedLOPS || [],
      //   brokerSelection: leadaccessDataRedux.selectedBrokers || [],
      //   designationSelection: leadaccessDataRedux.selectedDesignation || [],
      //   departmentSelection: leadaccessDataRedux.selectedDepartment || [],
      // });

      formik.setValues({
        ...formik.values,
        leadCreationAccess: leadaccessDataRedux.leadCreationAccess || [],
        provinceSelection: leadaccessDataRedux.selectedProvinces || [],
        districtSelection:
          Object.values(leadaccessDataRedux.selectedDistricts || {}).flat() ||
          [],
        branchSelection:
          Object.values(leadaccessDataRedux.selectedBranches || {}).flat() ||
          [],
        hobSelection: (leadaccessDataRedux.selectedHob || []).map(
          (option) => option.value
        ),
        unitHeadSelection: (leadaccessDataRedux.selectedUnitHead || []).map(
          (option) => option.value
        ),
        liaSelection: (leadaccessDataRedux.selectedLia || []).map(
          (option) => option.value
        ),
        hoSelection: leadaccessDataRedux.selectedHO || [],
        lopsSelection: leadaccessDataRedux.selectedLOPS || [],
        brokerSelection: leadaccessDataRedux.selectedBrokers || [],
        designationSelection: leadaccessDataRedux.selectedDesignation || [],
        departmentSelection: leadaccessDataRedux.selectedDepartment || [],
      });
      console.log("Setting formik values:", formik.values);

      // const initialSelectedValues = formik.values.hobSelection || [];
      // const initialSelectedOptions = hobOptions.filter((option) =>
      //   initialSelectedValues.includes(option.value)
      // );
      // console.log("initialSelectedOptions");
      // setSelectedHob(initialSelectedOptions);

      setSelectedProvinces(leadaccessDataRedux.selectedProvinces || []);
      setSelectedDistricts(leadaccessDataRedux.selectedDistricts || {});
      setSelectedBranches(leadaccessDataRedux.selectedBranches || {});

      setSelectedHob(leadaccessDataRedux.selectedHob || []);
      setSelectedUnitHead(leadaccessDataRedux.selectedUnitHead || []);
      setSelectedLia(leadaccessDataRedux.selectedLia || []);

      setSelectedHO(leadaccessDataRedux.selectedHO || []);
      setSelectedLOPS(leadaccessDataRedux.selectedLOPS || []);

      setSelectedBrokers(leadaccessDataRedux.selectedBrokers || []);
      setSelectedDesignation(leadaccessDataRedux.selectedDesignation || []);
      setSelectedDepartment(leadaccessDataRedux.selectedDepartment || []);

      setHobOptions(leadaccessDataRedux.selectedHob || []);
      setUnitHeadOptions(leadaccessDataRedux.selectedUnitHead || []);
      setLiaOptions(leadaccessDataRedux.selectedLia || []);

      console.log("selectedHob State:", leadaccessDataRedux.selectedHob);
      console.log(
        "selectedUnitHead State:",
        leadaccessDataRedux.selectedUnitHead
      );
      console.log("selectedLia State:", leadaccessDataRedux.selectedLia);
    }
    // important end

    const fetchLeadCreationUsers = async () => {
      try {
        const sortedData = await fetchLeadUsers();
        setLeadForms(sortedData.data);
        console.log("API User Response:", sortedData);

        if (sortedData.data?.leadCreationAccess?.DropdownValues) {
          setUsers(sortedData.data.leadCreationAccess.DropdownValues);
        }
      } catch (error) {
        console.error("Error fetching lead users:", error);
      }
    };

    //shubham
    const fetchDropdowns = async () => {
      try {
        const dropdownData = await fetchLeadDropdowns();
        console.log("API Dropdown Response:", dropdownData);

        const provinceData = dropdownData.data.provinces || [];

        // Create lookup objects
        const branchLookup = {};
        const branchOptions = [];
        const districtMap = {};

        const mappedProvinces = provinceData.map((province) => ({
          value: province.provinceName,
          label: province.provinceName,
          districts: province.districts.map((district) => {
            // Store district data
            if (!districtMap[province.provinceName])
              districtMap[province.provinceName] = [];
            districtMap[province.provinceName].push({
              value: district.districtName,
              label: district.districtName,
            });

            district.branches.forEach((branch) => {
              branchLookup[branch.branchName] = branch.branchCode;
              branchOptions.push({
                value: branch.branchCode,
                label: branch.branchName,
                district: district.districtName,
              });
            });

            return {
              value: district.districtName,
              label: district.districtName,
              branches: district.branches.map((branch) => ({
                value: branch.branchCode,
                label: branch.branchName,
              })),
            };
          }),
        }));

        console.log("Branch Lookup:", branchLookup);
        console.log("Branch Options:", branchOptions);

        setProvinceOptions(mappedProvinces);
        setBranchLookup(branchLookup);
        setBranchSelectOptions(branchOptions);
        setDistrictOptions(districtMap);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    const fetchHODropdowns = async () => {
      try {
        const dropdownDataHO = await fetchHOUsersDropdowns();
        console.log("API Head Office Dropdown Response:", dropdownDataHO);

        const formattedData = dropdownDataHO.data.map((user) => ({
          value: user.user_id,
          label: user.full_name,
        }));

        setHoOptions(formattedData.length > 0 ? formattedData : []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    // Designation
    const fetchDesignationDropdowns = async () => {
      try {
        const dropdownDataDesignation = await fetchDesignationListDropdowns();
        console.log(
          "API Designation Dropdown Response:",
          dropdownDataDesignation
        );

        const formattedData = dropdownDataDesignation.data.map((user) => ({
          value: user.job_title,
          label: user.job_title,
        }));

        setDesignationOptions(formattedData.length > 0 ? formattedData : []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    // Departments
    const fetchDepartmentsDropdowns = async () => {
      try {
        const dropdownDataDepartment = await fetchDepartmentListDropdowns();
        console.log(
          "API Department Dropdown Response:",
          dropdownDataDepartment
        );

        const formattedData = dropdownDataDepartment.data.map((user) => ({
          value: user.hrgroup,
          label: user.hrgroup,
        }));

        setDepartmentOptions(formattedData.length > 0 ? formattedData : []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    const fetchLOPSDropdowns = async () => {
      try {
        const dropdownDataLifeOPS = await fetchLOPSUsersDropdowns();
        console.log("API Life OPS Dropdown Response:", dropdownDataLifeOPS);

        const formattedData = dropdownDataLifeOPS.data.map((user) => ({
          value: user.user_id,
          label: user.full_name,
        }));

        setLopsOptions(formattedData.length > 0 ? formattedData : []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    //Broker
    const fetchBrokersDropdowns = async () => {
      try {
        const dropdownDataBrokers = await fetchBrokersListDropdowns();
        console.log("API Life OPS Dropdown Response:", dropdownDataBrokers);

        const formattedData = dropdownDataBrokers.data.map((user) => ({
          value: user.user_id,
          label: user.full_name,
        }));

        setBrokersOptions(formattedData.length > 0 ? formattedData : []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchLeadCreationUsers();
    if (formik.values.leadCreationAccess.includes("Sales_Office")) {
      fetchDropdowns();
    }
    if (formik.values.leadCreationAccess.includes("Head_Office")) {
      fetchHODropdowns();
      fetchDesignationDropdowns();
      fetchDepartmentsDropdowns();
      fetchLOPSDropdowns();
    }
    if (formik.values.leadCreationAccess.includes("Broker")) {
      fetchBrokersDropdowns();
    }
  }, [formik.values.leadCreationAccess, leadaccessDataRedux]);

  //Shubham code start
  //province
  const getProvinceOptionsWithSelectAll = (options) => [
    { value: "select_all", label: "All" },
    ...options.map((option) => ({ value: option.value, label: option.label })),
  ];

  const handleProvinceChange = (selectedOptions) => {
    const allValues = provinceOptions.map((option) => option.value);
    const selectedValues = selectedOptions.map((option) => option.value);

    if (selectedValues.includes("select_all")) {
      if (selectedProvinces.length === allValues.length) {
        // Deselect all
        setSelectedProvinces([]);
        setSelectedDistricts({});
        setSelectedBranches({});

        // Update Formik values
        formik.setFieldValue("provinceSelection", []);
        formik.setFieldValue("districtSelection", []);
        formik.setFieldValue("branchSelection", []);
      } else {
        // Select all
        setSelectedProvinces(allValues);
        formik.setFieldValue("provinceSelection", allValues);
      }
    } else {
      // Find deselected provinces
      const deselectedProvinces = selectedProvinces.filter(
        (p) => !selectedValues.includes(p)
      );

      // Remove associated districts and branches
      const updatedDistricts = { ...selectedDistricts };
      const updatedBranches = { ...selectedBranches };

      deselectedProvinces.forEach((province) => {
        if (updatedDistricts[province]) {
          const removedDistricts = updatedDistricts[province];

          // Remove associated branches of removed districts
          Object.keys(updatedBranches).forEach((district) => {
            if (removedDistricts.includes(district)) {
              delete updatedBranches[district];
            }
          });

          delete updatedDistricts[province];
        }
      });

      setSelectedProvinces(selectedValues);
      setSelectedDistricts(updatedDistricts);
      setSelectedBranches(updatedBranches);

      // Update Formik values
      formik.setFieldValue("provinceSelection", selectedValues);
      formik.setFieldValue(
        "districtSelection",
        Object.values(updatedDistricts).flat()
      );
      formik.setFieldValue(
        "branchSelection",
        Object.values(updatedBranches).flat()
      );
    }
  };

  const customOption = ({ data, innerRef, innerProps, selectOption }) => {
    const isAllSelected = selectedProvinces.length === provinceOptions.length;
    const isChecked =
      data.value === "select_all"
        ? isAllSelected
        : selectedProvinces.includes(data.value);

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="d-flex align-items-center px-2 py-1"
        onClick={(e) => {
          e.stopPropagation();
          selectOption(data);
        }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          readOnly
          className="form-check-input me-2"
        />
        <label className="form-check-label">{data.label}</label>
      </div>
    );
  };

  const customSingleValue = ({ data }) => <div>{data.label}</div>;

  const handleDistrictChange = (selectedOptions) => {
    const allDistricts = getDistrictOptionsWithSelectAll().slice(1);
    const selectedValues = selectedOptions.map((option) => option.value);

    if (selectedValues.includes("select_all")) {
      if (selectedValues.length === allDistricts.length + 1) {
        setSelectedDistricts({});
        setSelectedBranches({});
        formik.setFieldValue("districtSelection", []);
        formik.setFieldValue("branchSelection", []);
      } else {
        const newSelection = {};
        selectedProvinces.forEach((province) => {
          newSelection[province] = (districtOptions[province] || []).map(
            (d) => d.value
          );
        });

        setSelectedDistricts(newSelection);
        formik.setFieldValue(
          "districtSelection",
          Object.values(newSelection).flat()
        );
      }
    } else {
      const previousDistricts = Object.values(selectedDistricts).flat();
      const deselectedDistricts = previousDistricts.filter(
        (d) => !selectedValues.includes(d)
      );

      const updatedBranches = { ...selectedBranches };
      deselectedDistricts.forEach((district) => {
        delete updatedBranches[district];
      });

      const newSelection = {};
      selectedOptions.forEach((option) => {
        if (!newSelection[option.province]) newSelection[option.province] = [];
        newSelection[option.province].push(option.value);
      });

      setSelectedDistricts(newSelection);
      setSelectedBranches(updatedBranches);

      // Update Formik values
      formik.setFieldValue(
        "districtSelection",
        Object.values(newSelection).flat()
      );
      formik.setFieldValue(
        "branchSelection",
        Object.values(updatedBranches).flat()
      );
    }
  };

  const customDistrictOption = ({
    data,
    innerRef,
    innerProps,
    selectOption,
  }) => {
    const allDistricts = getDistrictOptionsWithSelectAll().slice(1);
    const isAllSelected =
      Object.values(selectedDistricts).flat().length === allDistricts.length;
    const isChecked =
      data.value === "select_all"
        ? isAllSelected
        : Object.values(selectedDistricts).flat().includes(data.value);

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="d-flex align-items-center px-2 py-1"
        onClick={(e) => {
          e.stopPropagation();
          selectOption(data);
        }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          readOnly
          className="form-check-input me-2"
        />
        <label className="form-check-label">{data.label}</label>
      </div>
    );
  };

  const customDistrictSingleValue = ({ data }) => <div>{data.label}</div>;

  const getDistrictOptionsWithSelectAll = () => {
    const options = selectedProvinces.flatMap((province) => {
      const districts = districtOptions[province] || [];
      return districts.map((option) => ({
        value: option.value,
        label: option.label,
        province,
      }));
    });

    return [
      { value: "select_all", label: "All" }, // "All" option at the top
      ...options,
    ];
  };

  //for branches

  const getBranchOptionsWithSelectAll = () => {
    const filteredBranches = branchSelectOptions.filter((option) =>
      Object.values(selectedDistricts).flat().includes(option.district)
    );

    return [
      { value: "select_all", label: "All", district: "all" },
      ...filteredBranches,
    ];
  };

  const handleBranchSelection = (selectedOptions) => {
    formik.setFieldValue(
      "branchSelection",
      selectedOptions.map((option) => option.value)
    );

    const allBranches = branchSelectOptions.filter((option) =>
      Object.values(selectedDistricts).flat().includes(option.district)
    );
    const allBranchValues = allBranches.map((option) => option.value);
    const selectedValues = selectedOptions.map((option) => option.value);

    let updatedBranches = {};
    let branchCodes = [];

    if (selectedValues.includes("select_all")) {
      if (selectedValues.length === allBranchValues.length + 1) {
        updatedBranches = {};
        branchCodes = [];
      } else {
        allBranches.forEach((option) => {
          if (!updatedBranches[option.district]) {
            updatedBranches[option.district] = [];
          }
          updatedBranches[option.district].push(option.value);
          branchCodes.push(option.value);
        });
      }
    } else {
      selectedOptions.forEach((option) => {
        if (!updatedBranches[option.district]) {
          updatedBranches[option.district] = [];
        }
        updatedBranches[option.district].push(option.value);
        branchCodes.push(option.value);
      });
    }

    setSelectedBranches(updatedBranches);
    fetchBranchRelatedData(branchCodes);

    const availableHobOptions = hobOptions.map((option) => option.value);
    const availableUnitHeadOptions = unitHeadOptions.map(
      (option) => option.value
    );
    const availableLiaOptions = liaOptions.map((option) => option.value);

    setSelectedHob((prev = []) =>
      (prev || []).filter((option) =>
        availableHobOptions.includes(option.value)
      )
    );
    setSelectedUnitHead((prev = []) =>
      (prev || []).filter((option) =>
        availableUnitHeadOptions.includes(option.value)
      )
    );
    setSelectedLia((prev = []) =>
      (prev || []).filter((option) =>
        availableLiaOptions.includes(option.value)
      )
    );

    formik.setFieldValue(
      "selectedHob",
      (formik.values.selectedHob || []).filter((value) =>
        availableHobOptions.includes(value)
      )
    );
    formik.setFieldValue(
      "selectedUnitHead",
      (formik.values.selectedUnitHead || []).filter((value) =>
        availableUnitHeadOptions.includes(value)
      )
    );
    formik.setFieldValue(
      "selectedLia",
      (formik.values.selectedLia || []).filter((value) =>
        availableLiaOptions.includes(value)
      )
    );
  };

  const customBranchOption = ({ data, innerRef, innerProps, selectOption }) => {
    const allBranches = getBranchOptionsWithSelectAll().slice(1);
    const isAllSelected =
      Object.values(selectedBranches).flat().length === allBranches.length;
    const isChecked =
      data.value === "select_all"
        ? isAllSelected
        : Object.values(selectedBranches).flat().includes(data.value);

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="d-flex align-items-center px-2 py-1"
        onClick={(e) => {
          e.stopPropagation();
          selectOption(data);
        }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          readOnly
          className="form-check-input me-2"
        />
        <label className="form-check-label">{data.label}</label>
      </div>
    );
  };

  const customBranchSingleValue = ({ data }) => <div>{data.label}</div>;

  // fetch by branch code api
  const fetchBranchRelatedData = async (branchCodes) => {
    console.log("Branch Codes -->", branchCodes);
    if (!branchCodes || branchCodes.length === 0) return;

    let hobDropdownOptions = [];
    let unitHeadDropdownOptions = [];
    let liaDropdownOptions = [];

    for (const branch_code of branchCodes) {
      try {
        // Fetch HOB Data
        const hobResponse = await fetchHOBDropdowns(branch_code);
        console.log("hobResponse-->", hobResponse);

        if (hobResponse?.status === "success" && hobResponse?.data) {
          hobDropdownOptions = [
            ...hobDropdownOptions,
            ...hobResponse.data.map((item) => ({
              value: item.user_id,
              label: item.full_name,
            })),
          ];
        }

        // Fetch Unit Head Data
        const unitHeadResponse = await fetchUnitHeadDropdowns(branch_code);
        console.log("unitHeadResponse-->", unitHeadResponse);

        if (unitHeadResponse?.status === "success" && unitHeadResponse?.data) {
          unitHeadDropdownOptions = [
            ...unitHeadDropdownOptions,
            ...unitHeadResponse.data.map((item) => ({
              value: item.user_id,
              label: item.full_name,
            })),
          ];
        }

        // Fetch LIA Data
        const liaResponse = await fetchLiasDropdowns(branch_code);
        console.log("liaResponse-->", liaResponse);

        if (liaResponse?.status === "success" && liaResponse?.data) {
          liaDropdownOptions = [
            ...liaDropdownOptions,
            ...liaResponse.data.map((item) => ({
              value: item.user_id,
              label: item.full_name,
            })),
          ];
        }
      } catch (error) {
        console.error(`Error fetching data for branch ${branch_code}:`, error);
      }
    }

    setHobOptions(hobDropdownOptions);
    setUnitHeadOptions(unitHeadDropdownOptions);
    setLiaOptions(liaDropdownOptions);
  };

  //HOB, United Head, LIA

  const getHobOptionsWithSelectAll = () => [
    { value: "select_all", label: "All" },
    ...hobOptions,
  ];

  const getUnitHeadOptionsWithSelectAll = () => [
    { value: "select_all", label: "All" },
    ...unitHeadOptions,
  ];

  const getLiaOptionsWithSelectAll = () => [
    { value: "select_all", label: "All" },
    ...liaOptions,
  ];

  const CustomOption = ({
    data,
    innerRef,
    innerProps,
    selectOption,
    isSelected,
    selectProps,
  }) => {
    const selectedValues = selectProps.value.map((option) => option.value);

    const isAllSelected =
      data.value === "select_all"
        ? selectedValues.length === selectProps.options.length - 1
        : isSelected;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="d-flex align-items-center px-2 py-1"
        onClick={(e) => {
          e.stopPropagation();
          selectOption(data);
        }}
      >
        <input
          type="checkbox"
          checked={isAllSelected}
          readOnly
          className="form-check-input me-2"
        />
        <label className="form-check-label">{data.label}</label>
      </div>
    );
  };

  const handleHobChange = (selectedOptions) => {
    const allHobValues = hobOptions.map((option) => option.value);
    const selectedValues = selectedOptions.map((option) => option.value);

    if (selectedValues.includes("select_all")) {
      const newSelection =
        selectedValues.length === allHobValues.length + 1 ? [] : hobOptions;
      setSelectedHob(newSelection);
      formik.setFieldValue(
        "hobSelection",
        newSelection.map((option) => option.value)
      );
    } else {
      const filteredSelection = selectedOptions.filter((option) =>
        allHobValues.includes(option.value)
      );
      setSelectedHob(filteredSelection);
      formik.setFieldValue(
        "hobSelection",
        filteredSelection.map((option) => option.value)
      );
    }
  };

  const handleUnitHeadChange = (selectedOptions) => {
    const allUnitHeadValues = unitHeadOptions.map((option) => option.value);
    const selectedValues = selectedOptions.map((option) => option.value);

    if (selectedValues.includes("select_all")) {
      const newSelection =
        selectedValues.length === allUnitHeadValues.length + 1
          ? []
          : unitHeadOptions;
      setSelectedUnitHead(newSelection);
      formik.setFieldValue(
        "unitHeadSelection",
        newSelection.map((option) => option.value)
      );
    } else {
      const filteredSelection = selectedOptions.filter((option) =>
        allUnitHeadValues.includes(option.value)
      );
      setSelectedUnitHead(filteredSelection);
      formik.setFieldValue(
        "unitHeadSelection",
        filteredSelection.map((option) => option.value)
      );
    }
  };

  const handleLiaChange = (selectedOptions) => {
    const allLiaValues = liaOptions.map((option) => option.value);
    const selectedValues = selectedOptions.map((option) => option.value);

    if (selectedValues.includes("select_all")) {
      const newSelection =
        selectedValues.length === allLiaValues.length + 1 ? [] : liaOptions;
      setSelectedLia(newSelection);
      formik.setFieldValue(
        "liaSelection",
        newSelection.map((option) => option.value)
      );
    } else {
      const filteredSelection = selectedOptions.filter((option) =>
        allLiaValues.includes(option.value)
      );
      setSelectedLia(filteredSelection);
      formik.setFieldValue(
        "liaSelection",
        filteredSelection.map((option) => option.value)
      );
    }
  };

  const handleUserCheckboxChange = (value) => {
    const currentAccess = formik.values.leadCreationAccess || [];

    let updatedAccess;
    if (currentAccess.includes(value)) {
      updatedAccess = currentAccess.filter((item) => item !== value);
    } else {
      updatedAccess = [...currentAccess, value];
    }

    formik.setFieldValue("leadCreationAccess", updatedAccess);

    if (leadaccessDataRedux && Object.keys(leadaccessDataRedux).length > 0) {
      dispatch(
        setselectedleadaccessdata({
          ...leadaccessDataRedux,
          leadCreationAccess: updatedAccess,
        })
      );
    }
  };

  //end code

  // User creation

  //shubham Head office

  const getOptionsWithSelectAll = (options) => [
    { value: "select_all", label: "All" },
    ...options.map((option) => ({ value: option.value, label: option.label })),
  ];

  const handleSelectChange = (selectedOptions, type) => {
    const allValues =
      type === "ho"
        ? hoOptions.map((option) => option.value)
        : lopsOptions.map((option) => option.value);

    const selectedValues = selectedOptions.map((option) => option.value);

    if (selectedValues.includes("select_all")) {
      if (selectedValues.length === allValues.length + 1) {
        if (type === "ho") {
          setSelectedHO([]);
          formik.setFieldValue("hoSelection", []);
        } else {
          setSelectedLOPS([]);
          formik.setFieldValue("lopsSelection", []);
        }
      } else {
        if (type === "ho") {
          setSelectedHO(allValues);
          formik.setFieldValue("hoSelection", allValues);
        } else {
          setSelectedLOPS(allValues);
          formik.setFieldValue("lopsSelection", allValues);
        }
      }
    } else {
      if (type === "ho") {
        setSelectedHO(selectedValues);
        formik.setFieldValue("hoSelection", selectedValues);
      } else {
        setSelectedLOPS(selectedValues);
        formik.setFieldValue("lopsSelection", selectedValues);
      }
    }
  };

  const customHeadOfficeOption = ({
    data,
    isSelected,
    innerRef,
    innerProps,
    selectOption,
  }) => {
    const isAllSelected =
      data.value === "select_all" &&
      hoOptions.length > 0 &&
      selectedHO.length === hoOptions.length;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="custom-option d-flex align-items-center px-2 py-1"
        onClick={(e) => {
          e.stopPropagation();
          selectOption(data);
        }}
      >
        <input
          type="checkbox"
          checked={data.value === "select_all" ? isAllSelected : isSelected}
          readOnly
          className="form-check-input me-2"
        />
        <label>{data.label}</label>
      </div>
    );
  };

  const customLOPSOption = ({
    data,
    isSelected,
    innerRef,
    innerProps,
    selectOption,
    selectProps,
  }) => {
    const isHO = selectProps.name === "ho";
    const allOptions = isHO ? hoOptions : lopsOptions;
    const selectedValues = isHO ? selectedHO : selectedLOPS;

    const isAllSelected =
      data.value === "select_all" &&
      allOptions.length > 0 &&
      selectedValues.length === allOptions.length;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="custom-option d-flex align-items-center px-2 py-1"
        onClick={(e) => {
          e.stopPropagation();
          selectOption(data);
        }}
      >
        <input
          type="checkbox"
          checked={data.value === "select_all" ? isAllSelected : isSelected}
          readOnly
          className="form-check-input me-2"
        />
        <label>{data.label}</label>
      </div>
    );
  };

  //Brokers
  const getBrokerOptionsWithSelectAll = (options) => [
    { value: "select_all", label: "All" },
    ...options.map((option) => ({ value: option.value, label: option.label })),
  ];

  const handleBrokerSelectChange = (selectedOptions, type) => {
    const allValues = brokersOptions.map((option) => option.value);
    const selectedValues = selectedOptions.map((option) => option.value);

    if (selectedValues.includes("select_all")) {
      if (selectedValues.length === allValues.length + 1) {
        setSelectedBrokers([]);
        formik.setFieldValue("brokerSelection", []);
      } else {
        setSelectedBrokers(allValues);
        formik.setFieldValue("brokerSelection", allValues);
      }
    } else {
      setSelectedBrokers(selectedValues);
      formik.setFieldValue("brokerSelection", selectedValues);
    }
  };

  const customBrokersOption = ({
    data,
    isSelected,
    innerRef,
    innerProps,
    selectOption,
    selectProps,
  }) => {
    const allOptions = brokersOptions;
    const selectedValues = selectedBrokers;
    const isAllSelected =
      data.value === "select_all" &&
      allOptions.length > 0 &&
      selectedValues.length === allOptions.length;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="custom-option d-flex align-items-center px-2 py-1"
        onClick={(e) => {
          e.stopPropagation();
          selectOption(data);
        }}
      >
        <input
          type="checkbox"
          checked={data.value === "select_all" ? isAllSelected : isSelected}
          readOnly
          className="form-check-input me-2"
        />
        <label>{data.label}</label>
      </div>
    );
  };

  //Designation
  const getDesignationOptionsWithSelectAll = (options) => [
    { value: "select_all", label: "All" },
    ...options.map((option) => ({ value: option.value, label: option.label })),
  ];

  // Handle Designation Select Change & API Call on Blur

  const handleDesignationSelectChange = (selectedOptions) => {
    const allValues = designationOptions.map((option) => option.value);
    const selectedValues = selectedOptions.map((option) => option.value);

    if (selectedValues.includes("select_all")) {
      if (selectedValues.length === allValues.length + 1) {
        setSelectedDesignation([]);
        formik.setFieldValue("designationSelection", []);
      } else {
        setSelectedDesignation(allValues);
        formik.setFieldValue("designationSelection", allValues);
      }
    } else {
      setSelectedDesignation(selectedValues);
      formik.setFieldValue("designationSelection", selectedValues);
    }
  };
  const customDesignationOption = ({
    data,
    isSelected,
    innerRef,
    innerProps,
    selectOption,
    selectProps,
  }) => {
    const allOptions = designationOptions;
    const selectedValues = selectedDesignation;
    const isAllSelected =
      data.value === "select_all" &&
      allOptions.length > 0 &&
      selectedValues.length === allOptions.length;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="custom-option d-flex align-items-center px-2 py-1"
        onClick={(e) => {
          e.stopPropagation();
          selectOption(data);
        }}
      >
        <input
          type="checkbox"
          checked={data.value === "select_all" ? isAllSelected : isSelected}
          readOnly
          className="form-check-input me-2"
        />
        <label>{data.label}</label>
      </div>
    );
  };

  // Department
  const getDepartmentOptionsWithSelectAll = (options) => [
    { value: "select_all", label: "All" },
    ...options.map((option) => ({ value: option.value, label: option.label })),
  ];

  // Handle Department Select Change & API Call on Blur

  const handleDepartmentSelectChange = (selectedOptions) => {
    const allValues = departmentOptions.map((option) => option.value);
    const selectedValues = selectedOptions.map((option) => option.value);

    if (selectedValues.includes("select_all")) {
      if (selectedValues.length === allValues.length + 1) {
        setSelectedDepartment([]);
        formik.setFieldValue("departmentSelection", []);
      } else {
        setSelectedDepartment(allValues);
        formik.setFieldValue("departmentSelection", allValues);
      }
    } else {
      setSelectedDepartment(selectedValues);
      formik.setFieldValue("departmentSelection", selectedValues);
    }
  };

  const customDepartmentOption = ({
    data,
    isSelected,
    innerRef,
    innerProps,
    selectOption,
  }) => {
    const allOptions = departmentOptions;
    const selectedValues = selectedDepartment;
    const isAllSelected =
      data.value === "select_all" &&
      allOptions.length > 0 &&
      selectedValues.length === allOptions.length;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="custom-option d-flex align-items-center px-2 py-1"
        onClick={(e) => {
          e.stopPropagation();
          selectOption(data);
        }}
      >
        <input
          type="checkbox"
          checked={data.value === "select_all" ? isAllSelected : isSelected}
          readOnly
          className="form-check-input me-2"
        />
        <label>{data.label}</label>
      </div>
    );
  };

  // Fetch HO Data from API based on Department or Designation Selection

  const fetchHOData = async () => {
    try {
      if (selectedDepartment.length === 0 && selectedDesignation.length === 0) {
        return;
      }

      let queryParams = [];
      if (selectedDepartment.length > 0) {
        queryParams.push(
          `department=${encodeURIComponent(selectedDepartment.join(","))}`
        );
      }
      if (selectedDesignation.length > 0) {
        queryParams.push(
          `designation=${encodeURIComponent(selectedDesignation.join(","))}`
        );
      }

      const apiUrl = `http://192.168.2.11:3002/configurableitems/selectHO?${queryParams.join(
        "&"
      )}`;
      console.log("API URL:", apiUrl);

      const response = await axios.get(apiUrl);
      console.log("API HO Response:", response);

      if (response.data?.status === "success") {
        const newOptions = response.data.data.map((item) => ({
          value: item.user_id,
          label: item.full_name,
        }));
        setHoOptions(newOptions);
      }
    } catch (error) {
      console.error("Error fetching Head Office data:", error);
    }
  };

  // Common function for both Department and Designation blur events
  const handleDepartDesignBlur = () => {
    fetchHOData();
  };

  const handleHOSelectChange = (selectedOptions) => {
    const allValues = hoOptions.map((option) => option.value);
    const selectedValues = selectedOptions.map((option) => option.value);

    if (selectedValues.includes("select_all")) {
      if (selectedValues.length === allValues.length + 1) {
        setSelectedHO([]);
        formik.setFieldValue("hoSelection", []);
      } else {
        setSelectedHO(allValues);
        formik.setFieldValue("hoSelection", allValues);
      }
    } else {
      setSelectedHO(selectedValues);
      formik.setFieldValue("hoSelection", selectedValues);
    }
  };

  //end Head office

  return (
    <div className="container text-center">
      {activeTab === "Set Lead Creators" && (
        <form
          className="hidden-scroll"
          onSubmit={formik.handleSubmit}
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            height: "64vh",
            width: "75vw",
          }}
        >
          {/* User Role Selection */}
          <div className="row leadusers justify-content-center">
            <div className="leadCreationHeader">
              <div className="text-center">
                <h6 className="mb-2 fw-medium" style={{ color: "#7A0114" }}>
                  Please select the authorized person to create leads under the
                  new campaign.
                </h6>
              </div>
            </div>
            <div className="grey-box mx-auto w-75 text-center p-3">
              <div className="form-check leaduserslabel pt-3 d-flex justify-content-center flex-wrap">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div key={user.id} className="form-check mx-2">
                      <div className="row">
                        <div className="col-12">
                          <img
                            src={`/${user.label}.png`}
                            alt={user.label}
                            className="user-checkbox-img"
                          />
                        </div>
                      </div>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`user-${user.id}`}
                        checked={
                          Array.isArray(formik.values.leadCreationAccess) &&
                          formik.values.leadCreationAccess.includes(user.value)
                        }
                        onChange={() => handleUserCheckboxChange(user.value)}
                        onBlur={formik.handleBlur}
                        disabled={isEditMode}
                      />
                      <label
                        className="form-check-label"
                        // htmlFor={`user-${user.id}`}
                      >
                        {user.label}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No Data</p>
                )}
              </div>
            </div>
            {formik.touched.leadCreationAccess &&
              formik.errors.leadCreationAccess && (
                <div className="text-danger">
                  {formik.errors.leadCreationAccess}
                </div>
              )}
          </div>

          <div className="row justify-content-center">
            {formik.values.leadCreationAccess.includes("Sales_Office") && (
              <>
                {/* Province Dropdown shubham */}
                {provinceOptions.length > 0 && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Select Province <span className="text-danger">*</span>
                    </label>
                    <Select
                      isMulti
                      options={getProvinceOptionsWithSelectAll(provinceOptions)}
                      value={getProvinceOptionsWithSelectAll(
                        provinceOptions
                      ).filter((option) =>
                        selectedProvinces.includes(option.value)
                      )}
                      onChange={handleProvinceChange}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      components={{
                        Option: customOption,
                        SingleValue: customSingleValue,
                      }}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      isDisabled={isEditMode}
                    />
                    {formik.touched.provinceSelection &&
                      formik.errors.provinceSelection &&
                      selectedProvinces.length === 0 && (
                        <div className="text-danger">
                          {formik.errors.provinceSelection}
                        </div>
                      )}
                  </div>
                )}

                {/* District Dropdown */}
                {selectedProvinces.length > 0 && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Select District<span className="text-danger">*</span>
                    </label>
                    <Select
                      isMulti
                      options={getDistrictOptionsWithSelectAll()}
                      value={getDistrictOptionsWithSelectAll().filter(
                        (option) =>
                          Object.values(selectedDistricts)
                            .flat()
                            .includes(option.value)
                      )}
                      onChange={handleDistrictChange}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      components={{
                        Option: customDistrictOption,
                        SingleValue: customDistrictSingleValue,
                      }}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      isDisabled={isEditMode}
                    />
                    {formik.touched.districtSelection &&
                      formik.errors.districtSelection &&
                      Object.keys(selectedDistricts).length === 0 && (
                        <div className="text-danger">
                          {formik.errors.districtSelection}
                        </div>
                      )}
                  </div>
                )}

                {/* Branch Dropdown */}
                {Object.keys(selectedDistricts).length > 0 && (
                  <div className="col-md-6 dropdown">
                    <label className="form-label">
                      Select Branch <span className="text-danger">*</span>
                    </label>
                    <Select
                      isMulti
                      options={getBranchOptionsWithSelectAll()}
                      value={branchSelectOptions.filter((option) =>
                        Object.values(selectedBranches)
                          .flat()
                          .includes(option.value)
                      )}
                      onChange={handleBranchSelection}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      components={{
                        Option: customBranchOption,
                        SingleValue: customBranchSingleValue,
                      }}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      isDisabled={isEditMode}
                    />
                    {formik.touched.branchSelection &&
                      formik.errors.branchSelection &&
                      Object.keys(selectedBranches).length === 0 && (
                        <div className="text-danger">
                          {formik.errors.branchSelection}
                        </div>
                      )}
                  </div>
                )}

                {/* HOB Dropdown */}
                {Object.keys(selectedBranches).length > 0 && (
                  <div className="col-md-6 dropdown">
                    <label className="form-label">
                      Select HOB <span className="text-danger">*</span>
                    </label>
                    <Select
                      isMulti
                      options={getHobOptionsWithSelectAll()}
                      value={selectedHob.filter((option) =>
                        getHobOptionsWithSelectAll().some(
                          (hob) => hob.value === option.value
                        )
                      )}
                      onChange={handleHobChange}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      components={{ Option: CustomOption }}
                      isDisabled={
                        isEditMode || Object.keys(selectedBranches).length === 0
                      }
                    />
                    {formik.touched.hobSelection &&
                      formik.errors.hobSelection &&
                      selectedHob.length === 0 && (
                        <div className="text-danger">
                          {formik.errors.hobSelection}
                        </div>
                      )}
                  </div>
                )}

                {/* Unit Head Dropdown */}
                {Object.keys(selectedBranches).length > 0 && (
                  <div className="col-md-6 dropdown">
                    <label className="form-label">
                      Select Unit Head <span className="text-danger">*</span>{" "}
                    </label>
                    <Select
                      isMulti
                      options={getUnitHeadOptionsWithSelectAll()}
                      value={selectedUnitHead.filter((option) =>
                        getUnitHeadOptionsWithSelectAll().some(
                          (unit) => unit.value === option.value
                        )
                      )}
                      onChange={handleUnitHeadChange}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      components={{ Option: CustomOption }}
                      isDisabled={
                        isEditMode || Object.keys(selectedBranches).length === 0
                      }
                    />
                    {formik.touched.unitHeadSelection &&
                      formik.errors.unitHeadSelection &&
                      selectedUnitHead.length === 0 && (
                        <div className="text-danger">
                          {formik.errors.unitHeadSelection}
                        </div>
                      )}
                  </div>
                )}

                {/* LIA Dropdown */}
                {Object.keys(selectedBranches).length > 0 && (
                  <div className="col-md-6 dropdown">
                    <label className="form-label">
                      Select LIA <span className="text-danger">*</span>{" "}
                    </label>
                    <Select
                      isMulti
                      options={getLiaOptionsWithSelectAll()}
                      // value={selectedLia}
                      value={selectedLia.filter((option) =>
                        getLiaOptionsWithSelectAll().some(
                          (lia) => lia.value === option.value
                        )
                      )}
                      onChange={handleLiaChange}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      components={{ Option: CustomOption }}
                      isDisabled={
                        isEditMode || Object.keys(selectedBranches).length === 0
                      }
                    />
                    {formik.touched.liaSelection &&
                      formik.errors.liaSelection &&
                      selectedLia.length === 0 && (
                        <div className="text-danger">
                          {formik.errors.liaSelection}
                        </div>
                      )}
                  </div>
                )}

                {/*code end */}
              </>
            )}
          </div>

          <div className="row mt-5">
            {formik.values.leadCreationAccess.includes("Head_Office") && (
              <>
                {/* Departments Multi-Select Dropdown */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Select Departments <span className="text-danger">*</span>
                  </label>

                  <Select
                    isMulti
                    options={getDepartmentOptionsWithSelectAll(
                      departmentOptions
                    )}
                    value={getDepartmentOptionsWithSelectAll(
                      departmentOptions
                    ).filter((option) =>
                      selectedDepartment.includes(option.value)
                    )}
                    onChange={handleDepartmentSelectChange}
                    onBlur={handleDepartDesignBlur} // Common blur handler
                    className="basic-multi-select"
                    classNamePrefix="select"
                    hideSelectedOptions={false}
                    closeMenuOnSelect={false}
                    components={{ Option: customDepartmentOption }}
                    isDisabled={isEditMode}
                  />

                  {formik.touched.departmentSelection &&
                    formik.errors.departmentSelection &&
                    selectedDepartment.length === 0 && (
                      <div className="text-danger">
                        {formik.errors.departmentSelection}
                      </div>
                    )}
                </div>

                {/* Designations Multi-Select Dropdown */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Select Designation <span className="text-danger">*</span>
                  </label>

                  <Select
                    isMulti
                    options={getDesignationOptionsWithSelectAll(
                      designationOptions
                    )}
                    value={getDesignationOptionsWithSelectAll(
                      designationOptions
                    ).filter((option) =>
                      selectedDesignation.includes(option.value)
                    )}
                    onChange={handleDesignationSelectChange}
                    onBlur={handleDepartDesignBlur} // Common blur handler
                    className="basic-multi-select"
                    classNamePrefix="select"
                    hideSelectedOptions={false}
                    closeMenuOnSelect={false}
                    components={{ Option: customDesignationOption }}
                    isDisabled={isEditMode}
                  />

                  {formik.touched.designationSelection &&
                    formik.errors.designationSelection &&
                    selectedDesignation.length === 0 && (
                      <div className="text-danger">
                        {formik.errors.designationSelection}
                      </div>
                    )}
                </div>

                {/* HO Multi-Select Dropdown */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Select Head Office <span className="text-danger">*</span>
                  </label>
                  <Select
                    isMulti
                    options={getOptionsWithSelectAll(hoOptions)}
                    value={getOptionsWithSelectAll(hoOptions).filter((option) =>
                      selectedHO.includes(option.value)
                    )}
                    onChange={handleHOSelectChange}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    hideSelectedOptions={false}
                    closeMenuOnSelect={false}
                    components={{ Option: customHeadOfficeOption }}
                    isDisabled={isEditMode}
                  />
                  {formik.touched.hoSelection &&
                    formik.errors.hoSelection &&
                    selectedHO.length === 0 && (
                      <div className="text-danger">
                        {formik.errors.hoSelection}
                      </div>
                    )}
                </div>

                {/* LOPS Multi-Select Dropdown */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Select Life OPS <span className="text-danger">*</span>
                  </label>
                  <Select
                    isMulti
                    options={getOptionsWithSelectAll(lopsOptions)}
                    value={getOptionsWithSelectAll(lopsOptions).filter(
                      (option) => selectedLOPS.includes(option.value)
                    )}
                    // onChange={(selectedOptions) => setSelectedLOPS(selectedOptions.map(option => option.value))}
                    onChange={(selectedOptions) =>
                      handleSelectChange(selectedOptions, "lops")
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                    hideSelectedOptions={false}
                    closeMenuOnSelect={false}
                    components={{ Option: customLOPSOption }}
                    isDisabled={isEditMode}
                  />

                  {formik.touched.lopsSelection &&
                    formik.errors.lopsSelection &&
                    selectedLOPS.length === 0 && (
                      <div className="text-danger">
                        {formik.errors.lopsSelection}
                      </div>
                    )}
                </div>
              </>
            )}
          </div>

          <div className="row mt-5">
            {formik.values.leadCreationAccess.includes("Broker") && (
              <>
                {/* Brokers Multi-Select Dropdown */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Select Brokers <span className="text-danger">*</span>
                  </label>
                  <Select
                    isMulti
                    options={getBrokerOptionsWithSelectAll(brokersOptions)}
                    value={getBrokerOptionsWithSelectAll(brokersOptions).filter(
                      (option) => selectedBrokers.includes(option.value)
                    )}
                    onChange={(selectedOptions) =>
                      handleBrokerSelectChange(selectedOptions)
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                    hideSelectedOptions={false}
                    closeMenuOnSelect={false}
                    components={{ Option: customBrokersOption }}
                    isDisabled={isEditMode}
                  />
                  {formik.touched.brokerSelection &&
                    formik.errors.brokerSelection &&
                    selectedBrokers.length === 0 && (
                      <div className="text-danger">
                        {formik.errors.brokerSelection}
                      </div>
                    )}
                </div>
              </>
            )}
          </div>

          <div className="fixed-bottom d-flex justify-content-end mb-5 me-5">
            <Button
              variant="secondary"
              className="red-outline-button"
              onClick={handlePreviousClick}
              style={{ width: "10%", marginRight: "55%" }}
            >
              Previous
            </Button>
            <Button
              type="button"
              className="bottombuttons me-5"
              onClick={handleNextClick}
              style={{ width: "10%" }}
            >
              Next
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LeadCreationAccess;
