import React from "react";
import { Modal, Button } from "react-bootstrap";

const LeadDetailsModal = ({ show, onClose, campaign }) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Campaign Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {campaign ? (
                    <div>
                        {/* <p><strong>Campaign Name:</strong> {campaign.campaign_name}</p>
                        <p><strong>Campaign Type:</strong> {campaign.campaign_type}</p>
                        <p><strong>Start Date:</strong> {campaign.start_date.substring(0, 10)}</p>
                        <p><strong>End Date:</strong> {campaign.end_date.substring(0, 10)}</p>
                        <p><strong>Campaign Cost:</strong> {campaign.campaign_cost}</p>
                        <p><strong>Status:</strong> {campaign.status}</p>
                        <p><strong>Created By:</strong> {campaign.created_by} </p> */}
                    </div>
                ) : (
                    <p>No Campaign Information available</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LeadDetailsModal;