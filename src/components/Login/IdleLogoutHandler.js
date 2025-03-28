// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Modal } from "react-bootstrap"; // Ensure you have react-bootstrap installed

// const IDLE_TIMEOUT = 1 * 60 * 1000; // 5 minutes

// const IdleLogoutHandler = () => {
//   const navigate = useNavigate();
//   const timeoutRef = useRef(null);
//   const [showModal, setShowModal] = useState(false);

//   const logoutUser = () => {
//     setShowModal(true); // Show modal instead of alert
//   };

//   const handleLogoutConfirm = () => {
//     sessionStorage.clear(); // Clear session storage
//     setShowModal(false);
//     navigate("/"); // Redirect to login page
//   };

//   const resetTimer = () => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//     timeoutRef.current = setTimeout(logoutUser, IDLE_TIMEOUT);
//   };

//   useEffect(() => {
//     resetTimer();

//     const events = ["mousemove", "keydown", "click", "scroll"];
//     events.forEach((event) => window.addEventListener(event, resetTimer));

//     return () => {
//       events.forEach((event) => window.removeEventListener(event, resetTimer));
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, []);

//   return (
//     <>
//       {/* Logout Confirmation Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Body className="text-center p-4">
//           <h5 className="text-lg font-semibold mt-3" style={{ color: "#671E75" }}>
//             You have been logged out due to inactivity.
//           </h5>
//           <button
//             className="mt-4 px-4 py-2 rounded-lg text-white"
//             onClick={handleLogoutConfirm}
//             style={{
//               backgroundColor: "#671E75",
//               border: "none",
//               color: "#FFFFFF",
//             }}
//           >
//             OK
//           </button>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default IdleLogoutHandler;


import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap"; // Ensure you have react-bootstrap installed

const IDLE_TIMEOUT = 15 * 60 * 1000; // 5 minutes

const IdleLogoutHandler = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const isLoggedIn = () => {
    return sessionStorage.getItem("UserID") !== null; // Adjust based on your session storage key
  };

  const logoutUser = () => {
    if (isLoggedIn()) {
      setShowModal(true); // Show modal only if user is logged in
    }
  };

  const handleLogoutConfirm = () => {
    sessionStorage.clear(); // Clear session storage
    setShowModal(false);
    navigate("/"); // Redirect to login page
  };

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (isLoggedIn()) {
      timeoutRef.current = setTimeout(logoutUser, IDLE_TIMEOUT);
    }
  };

  useEffect(() => {
    resetTimer();

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Logout Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center p-4">
          <h5 className="text-lg font-semibold mt-3" style={{ color: "#671E75" }}>
            You have been logged out due to inactivity.
          </h5>
          <button
            className="mt-4 px-4 py-2 rounded-lg text-white"
            onClick={handleLogoutConfirm}
            style={{
              backgroundColor: "#671E75",
              border: "none",
              color: "#FFFFFF",
            }}
          >
            OK
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default IdleLogoutHandler;
