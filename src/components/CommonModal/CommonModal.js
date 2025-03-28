import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CommonModal.css";

const CommonModal = ({
  isOpen,
  onClose,
  message,
  actionType,
  navigateTo,
  status,
}) => {
  const navigate = useNavigate();
  const handleClose = () => {
    onClose(); // Close the modal
    // Only navigate if the message is NOT "Please select a lead form name"
  if (navigateTo && message !== "Please select a lead form name") {
    navigate(navigateTo);
  }
  };
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Body className="text-center p-4">
        {status === 200 ||
          (status === "success" && (
            <img src="/greentick.gif" alt="Success" width="103" height="103" />
          ))}

        <h2 className="text-lg font-semibold">{message}</h2>
        <button
          className="modalOk mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={handleClose}
        >
          OK
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default CommonModal;
