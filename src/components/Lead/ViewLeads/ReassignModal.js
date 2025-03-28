import React, { useEffect, useState } from "react";
import { fetchBranches, fetchSoCodes, updatedetails } from "./ViewLeadsService";
import { Button, Form, Modal } from "react-bootstrap";
import CommonModal from "../../CommonModal/CommonModal";

const ReassignModal = ({ show, handleClose, leadId, modifiedBy }) => {
  console.log("Received leadId in Modal:", leadId); // Debugging
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [soCodes, setSoCodes] = useState([]);
  const [selectedSoCode, setSelectedSoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalmessage, setmodalmessage] = useState("");
  const [showCommonModal, setShowCommonModal] = useState(false);
  const [apiStatusCode, setapiStatusCode] = useState();

  useEffect(() => {
    if (show) {
      loadBranches();
    }
  }, [show]);

  const loadBranches = async () => {
    try {
      const data = await fetchBranches();
      setBranches(data);
    } catch (error) {
      console.error("Failed to load branches");
    }
  };

  const handleBranchChange = async (branchCode) => {
    setSelectedBranch(branchCode);
    setSelectedSoCode(""); // Reset SO code when branch changes

    try {
      const data = await fetchSoCodes(branchCode);
      console.log("Data::", data);
      setSoCodes(data);
    } catch (error) {
      console.error("Failed to load SO codes");
    }
  };

  const handleSave = async () => {
    if (!selectedBranch || !selectedSoCode) return;

    setIsLoading(true);

    const payload = {
      lead_id: leadId, // Passed from parent
      modified_by: modifiedBy, // Passed from parent
      so_code: selectedSoCode,
    };

    try {
      const resonsedata = await updatedetails(payload);
      console.log("Response data:::", resonsedata);
      if (resonsedata.status === 200) {
        setmodalmessage(resonsedata.data.message);
        setapiStatusCode(200);
        setShowCommonModal(true);
      } else if (resonsedata.status === 201) {
        setmodalmessage(resonsedata.data.message);
        setapiStatusCode(201);
        setShowCommonModal(true);
      }
    } catch (e) {
      console.log("Error while saving:::", e);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Reassign Lead</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row">
            {/* Branch Selection */}
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Select Branch</Form.Label>
                <Form.Select
                  value={selectedBranch}
                  onChange={(e) => handleBranchChange(e.target.value)}
                >
                  <option value="">Select</option>
                  {branches.map((branch) => (
                    <option key={branch.branch_code} value={branch.branch_code}>
                      {branch.branch_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            {/* SO Code Selection */}
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Select SO Code</Form.Label>
                <Form.Select
                  value={selectedSoCode}
                  onChange={(e) => setSelectedSoCode(e.target.value)}
                  disabled={!selectedBranch}
                >
                  <option value="">Select</option>
                  {soCodes.map((so) => (
                    <option key={so.user_id} value={so.user_id}>
                      {so.branch_code}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          disabled={!selectedBranch || !selectedSoCode || isLoading}
          onClick={handleSave}
        >
          Save
        </Button>
      </Modal.Footer>
      <CommonModal
        isOpen={showCommonModal}
        onClose={() => setShowCommonModal(false)}
        message={modalmessage}
        actionType="success"
        navigateTo={"/LeadSummary"}
        status={apiStatusCode}
      />
    </Modal>
  );
};

export default ReassignModal;
