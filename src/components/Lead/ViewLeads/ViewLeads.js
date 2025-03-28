import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Modal,
  Form,
} from "react-bootstrap";
import { blockLead, getLeadDetails, OperateLead } from "./ViewLeadsService";
//import { Pencil, XCircle, ArrowRightCircle } from "react-bootstrap-icons";
//import "./ViewLeadDetails.css"; // Import styles
import "./ViewLeads.css";
import { FaAngleLeft, FaUserCircle } from "react-icons/fa";
import LeadsProgressBar from "./LeadsProgressBar";
import { data, useParams,useNavigate } from "react-router-dom";
import ReassignModal from "./ReassignModal";

const ViewLeadDetails = () => {
  const [key, setKey] = useState("personalDetails");
  const [leadData, setLeadData] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState("");
  const { leadID } = useParams();
  const navigate = useNavigate();

  console.log("leadID from useParams:", leadID);
  const modifiedby = sessionStorage.getItem("UserID");

  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const data = await getLeadDetails(leadID);
        console.log("Lead Details:::", data);
        setLeadData(data);
      } catch (error) {
        console.error("Failed to load lead details");
      }
    };

    fetchLeadData();
  }, []);

  if (!leadData) return <p>Loading...</p>;
  let leadName =
    leadData.data.title +
    "." +
    " " +
    leadData.data.first_name +
    " " +
    leadData.data.last_name;

  // const handleOperateLead = async (remark) => {
  //   setIsBlocking(true);
  //   console.log("Remark:::", remark);
  //   try {
  //     const response = await OperateLead(leadID);
  //     console.log("Response:::", response);
  //     setShowBlockModal(false); // Close the block confirmation modal
  //     if (response.status === "success") {
  //       setShowSuccessModal(true); // Open success modal
  //     }
  //   } catch (error) {
  //     alert("Failed to block lead. Try again.");
  //   } finally {
  //     setIsBlocking(false);
  //   }
  // };

  const handleOperateLead = async (remark) => {
    setIsBlocking(true);
    console.log("Remark:::", remark);

    // Determine action: Block or Unblock
    const isBlockingLead =
      leadData.data?.sub_stage === null ||
      leadData.data?.sub_stage === "Not interested";

    try {
      const response = await OperateLead(
        leadID,
        isBlockingLead,
        remark,
        modifiedby
      );
      console.log("Response:::", response);

      setShowBlockModal(false); // Close the block/unblock modal

      if (response.status === "success") {
        setShowSuccessModal(true); // Show success modal
      } else {
        alert("Failed to update lead. Try again.");
      }
    } catch (error) {
      alert("Failed to update lead. Try again.");
    } finally {
      setIsBlocking(false);
    }
  };

  const handleReassign = async () => {
    setShowModal(true);
  };

  const handleEditClick = () => {
    navigate(`/editlead/${leadID}`, { state: { leadData } });
  };

  return (
    <>
      <Container style={{ marginTop: "5rem" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-3">
            <img src="/user.png" className="me-2" width="30" />
            {leadName || "N/A"}
          </h4>
          <div>
            <Button
              variant="maroon"
              className="me-2"
              style={{ color: "white" }}
              onClick={handleReassign}
            >
              Reassign
            </Button>
            <Button
              className="me-2"
              style={{ backgroundColor: "#FD8469" }}
              onClick={() => setShowBlockModal(true)}
            >
              {leadData.data?.sub_stage === null ||
              leadData.data?.sub_stage === "Not interested"
                ? "Block Lead"
                : leadData.data?.current_stage === "lead_lost" &&
                  leadData.data?.sub_stage === "delete"
                ? "Unblock Lead"
                : "Default"}
            </Button>
            <img
              src="/Edit.png"
              alt="Edit"
              style={{ cursor: "pointer" }}
              onClick={handleEditClick}
            />
          </div>
        </div>

        <Tabs
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3 custom-tabs"
        >
          <Tab eventKey="personalDetails" title="Personal Details">
            <Card className="p-3 data-card Leaddata">
              <Row className="data-row">
                <Col md={4} className="d-flex flex-column">
                  <strong>Title</strong> {leadData.data.title || "N/A"}
                </Col>
                <Col md={4} className="d-flex flex-column">
                  <strong>First Name</strong>{" "}
                  {leadData.data.first_name || "N/A"}
                </Col>
                <Col md={4} className="d-flex flex-column">
                  <strong>Last Name</strong> {leadData.data.last_name || "N/A"}
                </Col>
              </Row>
              <Row className="data-row">
                <Col md={4} className="d-flex flex-column">
                  <strong>DOB</strong> {leadData.data.dob || "N/A"}
                </Col>
                <Col md={4} className="d-flex flex-column">
                  <strong>NIC Number</strong> {leadData.data.nic || "N/A"}
                </Col>
                <Col md={4} className="d-flex flex-column">
                  <strong>Marital Status</strong>{" "}
                  {leadData.data.marital_status || "N/A"}
                </Col>
              </Row>
              <Row className="data-row">
                <Col md={4} className="d-flex flex-column">
                  <strong>Occupation</strong>{" "}
                  {leadData.data.occupation || "N/A"}
                </Col>
                <Col md={4} className="d-flex flex-column">
                  <strong>Annual Income</strong>{" "}
                  {leadData.data.monthly_income || "-"}
                </Col>
              </Row>
            </Card>
          </Tab>

          <Tab eventKey="contactDetails" title="Contact Details">
            <Card className="p-3 data-card Leaddata">
              <Row className="data-row">
                <Col md={6} className="d-flex flex-column">
                  <strong>Phone</strong> {leadData.data.mobile_no || "N/A"}
                </Col>
                <Col md={6} className="d-flex flex-column">
                  <strong>Email</strong> {leadData.data.email || "N/A"}
                </Col>
              </Row>
              <Row className="data-row">
                <Col md={12} className="d-flex flex-column">
                  <strong>Address:</strong>{" "}
                  {leadData.data.address_line1 || "N/A"}
                </Col>
              </Row>
            </Card>
          </Tab>

          <Tab eventKey="soDetails" title="SO Details">
            <Card className="p-3 data-card Leaddata">
              <Row className="data-row">
                <Col md={6} className="d-flex flex-column">
                  <strong>Sales Officer</strong>{" "}
                  {leadData.data?.soDetails
                    ? leadData.data.soDetails.fullName
                    : "SO details are not present"}
                </Col>
                <Col md={6} className="d-flex flex-column">
                  <strong>Designation</strong>{" "}
                  {/* {leadData.data.soDetails.jobTitle || "N/A"} */}
                  {leadData.data?.soDetails
                    ? leadData.data.soDetails.jobTitle
                    : "SO details are not present"}
                </Col>
              </Row>
            </Card>
          </Tab>

          <Tab eventKey="campaignDetails" title="Campaign Details">
            <Card className="p-3 data-card Leaddata">
              <Row className="data-row">
                <Col md={4} className="d-flex flex-column">
                  <strong>Campaign Name</strong>{" "}
                  {/* {leadData.data.campaignDetails.campaignName || "N/A"} */}
                  {leadData.data?.campaignDetails
                    ? leadData.data.campaignDetails.campaignName
                    : "Campaign Details are not present"}
                </Col>
                <Col md={4} className="d-flex flex-column">
                  <strong>Campaign Status</strong>{" "}
                  {/* {leadData.data.campaignDetails.status || "N/A"} */}
                  {leadData.data?.campaignDetails
                    ? leadData.data.campaignDetails.status
                    : "Campaign Details are not present"}
                </Col>
                <Col md={4} className="d-flex flex-column">
                  <strong>Campaign Type</strong>{" "}
                  {/* {leadData.data.campaignDetails.campaignType || "N/A"} */}
                  {leadData.data?.campaignDetails
                    ? leadData.data.campaignDetails.campaignType
                    : "Campaign Details are not present"}
                </Col>
                <Col md={4} className="d-flex flex-column">
                  <strong>Campaign Cost</strong>{" "}
                  {/* {leadData.data.campaignDetails.campaignCost || "N/A"} */}
                  {leadData.data?.campaignDetails
                    ? leadData.data.campaignDetails.campaignCost
                    : "Campaign Details are not present"}
                </Col>
                <Col md={4} className="d-flex flex-column">
                  <strong>Region</strong>{" "}
                  {/* {leadData.data.campaignDetails.provinceName || "N/A"} */}
                  {leadData.data?.campaignDetails
                    ? leadData.data.campaignDetails.provinceName
                    : "Campaign Details are not present"}
                </Col>
              </Row>
            </Card>
          </Tab>

          <Tab eventKey="leadStatus" title="Lead Status">
            <Card className="p-3 data-card Leaddata">
              <Row className="data-row">
                <Col md={6} className="d-flex flex-column">
                  <strong>Sourced</strong> {leadData.data.lead_source || "N/A"}
                </Col>
                <Col md={6} className="d-flex flex-column">
                  <strong>Expected Closure</strong>{" "}
                  {leadData.data.expected_closure || "-"}
                </Col>
                <Col md={12}>
                  <LeadsProgressBar leadStages={leadData.data.leadStages} />
                </Col>
              </Row>
            </Card>
          </Tab>

          <Tab eventKey="history" title="History">
            <Card className="p-3 data-card Leaddata">
              <Row className="data-row">
                <Col md={12}>
                  <div>
                    <p style={{ color: "#314363" }}>
                      {leadData.data.title} {leadData.data.initials}{" "}
                      {leadData.data.first_name} {leadData.data.last_name}, a{" "}
                      {leadData.data.occupation || "professional"} from{" "}
                      {leadData.data.district}, was born on {leadData.data.dob}.{" "}
                      {leadData.data.marital_status &&
                        `Currently, they are ${leadData.data.marital_status}.`}
                      They have a monthly income of{" "}
                      {leadData.data.monthly_income} and can be contacted via
                      mobile ({leadData.data.mobile_no}) or email (
                      {leadData.data.email}). This lead (ID:{" "}
                      <strong>{leadData.data.lead_id}</strong>) was created
                      under the campaign{" "}
                      <strong>{leadData.data.campaign_id}</strong> from{" "}
                      {leadData.data.lead_channel} via{" "}
                      {leadData.data.lead_source}. Currently, the lead is in the
                      "<strong>{leadData.data.current_stage}</strong>" stage.
                      Their address is {leadData.data.address_line1}, near the{" "}
                      {leadData.data.nearest_branch} branch.
                      {leadData.data.remark && `Note: ${leadData.data.remark}`}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card>
          </Tab>
        </Tabs>
      </Container>
      <Modal
        show={showBlockModal}
        onHide={() => setShowBlockModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {leadData.data?.sub_stage === null ||
            leadData.data?.sub_stage === "Not interested"
              ? "Block this Lead?"
              : leadData.data?.current_stage === "lead_lost" &&
                leadData.data?.sub_stage === "delete"
              ? "Unblock this Lead?"
              : "Lead Action"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {leadData.data?.sub_stage === null ||
            leadData.data?.sub_stage === "Not interested"
              ? "Are you sure you want to block this lead?"
              : leadData.data?.current_stage === "lead_lost" &&
                leadData.data?.sub_stage === "delete"
              ? "Are you sure you want to unblock this lead?"
              : "Confirm your action on this lead."}
          </p>

          {/* Remark Textarea */}
          <Form.Group controlId="remark">
            <Form.Label>Remark</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your remark..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleOperateLead(remark)}
            disabled={isBlocking}
          >
            {isBlocking ? "Blocking..." : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h5>Lead Blocked Successfully!</h5>
        </Modal.Body>
      </Modal>

      <ReassignModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        leadId={leadID}
        modifiedBy={modifiedby}
      ></ReassignModal>
    </>
  );
};

export default ViewLeadDetails;
