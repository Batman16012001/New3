import React, { useState,useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Button } from "react-bootstrap";
import { userIdResponse, otpGenerationResponse,forgotpasswordResponse } from "../../components/Login/LoginPageService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faAngleLeft,faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otpMessage, setOtpMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Manage Modal
    const [showNewPassword, setShowNewPassword] = useState(false);
    const navigate = useNavigate();
    const [showResetForm, setShowResetForm] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    const handleUserIdValidation = async () => {
        try {
          const user_id = forgotFormik.values.user_id;
          console.log("User ID Validation Started:", user_id);
      
          // Validate User ID
          const response = await userIdResponse(user_id);
          console.log("User ID Validated:", response);
      
          // Generate OTP only if validation passes
          const otpResponse = await otpGenerationResponse(user_id);
          console.log("OTP Sent:", otpResponse);
      
          // Use success message from OTP response
          setOtpMessage(otpResponse?.emailResult || "OTP sent successfully");
          setIsOtpSent(true);
          return true;
        } catch (error) {
          console.error("User ID Validation Error:", error);
      
          let errorMessage = "Failed to reset password. Try again.";
        //   if (error.response?.data) {
        //     const { message, details } = error.response.data;
        //     errorMessage = details || message || errorMessage;
        //   }
          if (error.response && error.response.data) {
            const { message, details } = error.response.data;
      
            // Handle different types of `details`
            let errorMessage = "";
      
            if (Array.isArray(details)) {
              // If details is an array, replace field names and join messages
              errorMessage = details
                .map((msg) =>
                  msg
                    .replace("new_password", "New Password")
                    .replace("confirm_password", "Confirm New Password")
                    .replace("user_id", "User ID")
                    .replace("otp", "OTP") // Also replacing OTP for better readability
                    .replace("must NOT have more than", "must NOT exceed")
                )
                .join("\n");
            } else if (typeof details === "string") {
              // If details is a string, replace field names
              errorMessage = details
                .replace("new_password", "New Password")
                .replace("confirm_password", "Confirm New Password")
                .replace("user_id", "User ID")
                .replace("otp", "OTP")
                .replace("must NOT have more than", "must NOT exceed");
          } else {
              // If no details, fallback to message
              errorMessage = message || "Failed Try again.";
          }
      
          setOtpMessage(errorMessage);  // Set the error message properly
          setIsOtpSent(false);
          setIsModalOpen(true);  // Ensure the modal opens
          return errorMessage;
        }
    }
      };
      
    const handleResetPassword = async () => {
      try {
        const user_id = forgotFormik.values.user_id;
        const otp = forgotFormik.values.otp;
        const new_password = forgotFormik.values.new_password;
        const confirm_password = forgotFormik.values.confirm_password;
    
        console.log("User ID:", user_id);
        console.log("OTP:", otp);
        console.log("New Password:", new_password);
        console.log("Confirm Password:", confirm_password);
    
        const response = await forgotpasswordResponse(user_id, otp, new_password, confirm_password);
        console.log("Password Reset Successful:", response);
    
        // Show success message
        setOtpMessage("Password Saved Successfully");
        setIsModalOpen(true);
    
        setTimeout(() => {
            navigate('/');
        }, 2000);
      } catch (error) {
        console.error("Password Reset Error:", error);
    
        if (error.response && error.response.data) {
          const { message, details } = error.response.data;
    
          // Handle different types of `details`
          let errorMessage = "";
    
          if (Array.isArray(details)) {
            // If details is an array, replace field names and join messages
            errorMessage = details
              .map((msg) =>
                msg
                  .replace("new_password", "New Password")
                  .replace("confirm_password", "Confirm New Password")
                  .replace("user_id", "User ID")
                  .replace("otp", "OTP") // Also replacing OTP for better readability
                  .replace("must NOT have more than", "must NOT exceed")
              )
              .join("\n");
          } else if (typeof details === "string") {
            // If details is a string, replace field names
            errorMessage = details
              .replace("new_password", "New Password")
              .replace("confirm_password", "Confirm New Password")
              .replace("user_id", "User ID")
              .replace("otp", "OTP")
              .replace("must NOT have more than", "must NOT exceed");;
          } else {
            // If no details, fallback to message
            errorMessage = message || "Failed to reset password. Try again.";
          }
    
          setOtpMessage(errorMessage);
        } else {
          setOtpMessage("Failed to reset password. Try again.");
        }
    
        setIsModalOpen(true);
      }
    };

    const forgotFormik = useFormik({
        initialValues: {
          user_id: "",
          otp: "",
          new_password: "",
          confirm_password: "",
        },
        validateOnChange: false, 
        validateOnBlur: false, 
        validationSchema: Yup.object({
          user_id: Yup.string().required("Enter a User ID"),
          otp: isOtpSent ? Yup.string().required("Enter the OTP") : Yup.string(),
          new_password: isOtpSent
            ? Yup.string().required("Enter a new password") .matches(/^(?=.*[aeiouAEIOU])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, 
              "Password must be at least 8 characters, include a number, a special character"
            )
            : Yup.string(),
          confirm_password: isOtpSent
            ? Yup.string()
                .oneOf([Yup.ref("new_password")], "Password must match with New Password") .matches(/^(?=.*[aeiouAEIOU])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, 
                  "Password must be at least 8 characters, include a number, a special character"
                )
                .required("Enter confirm new password")
            : Yup.string(),
        }),
        onSubmit: async (values) => {
          if (!isOtpSent) {
            setShowResetForm(false);
            const otpResponse = await handleUserIdValidation(); // Validate User ID and generate OTP
        
            // Reset form fields
            forgotFormik.setFieldValue("otp", "");
            forgotFormik.setFieldValue("new_password", "");
            forgotFormik.setFieldValue("confirm_password", "");
            //forgotFormik.setFieldValue("user_id", ""); // Reset user_id
        
            if (otpResponse === true) { 
              setTimeout(() => {
                setShowResetForm(true);
              }, 1500);
            } else {
              setOtpMessage(otpResponse); // Set modal error message
              setIsModalOpen(true); // Open modal
            }
          } else {
            await handleResetPassword(); // Reset Password
        
          }
        },        
        
      });

      useEffect(() => {
        let interval;
    
        if (isOtpSent) {
          setTimer(30); // Reset timer
          setIsResendDisabled(true);
    
          interval = setInterval(() => {
            setTimer((prev) => {
              if (prev === 1) {
                clearInterval(interval);
                setIsResendDisabled(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
    
        return () => clearInterval(interval); // Cleanup on unmount or before restarting
      }, [isOtpSent]);
    
      const handleResendOTP = async () => {
        try {
          const user_id = forgotFormik.values.user_id;
          const otpResponse = await otpGenerationResponse(user_id);
          setOtpMessage(otpResponse.emailResult || "OTP resent successfully");
          setIsModalOpen(true);
          setIsOtpSent(false); // Reset to trigger useEffect again
          setTimeout(() => setIsOtpSent(true), 10); // Ensure useEffect runs properly
    
        } catch (error) {
          console.error("Password Reset Error:", error);
          const errorMessage =
            error.response?.data?.details ||
            error.response?.data?.message ||
            "Failed to create lead. Please try again.";
    
          setOtpMessage(errorMessage);
          setIsModalOpen(true);
        }
      };

      
  return (
    <div className="forgotpassword-container d-flex justify-content-center align-items-center vh-100">
        <div className="logo">
            <img src="/Eceylife-logo.png" alt="Eceylife-logo" className="logo-image" />
        </div>
        
        <div className="p-4 forgotcard">
            {/* Header - Conditionally change text */}
            <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon 
                    icon={faAngleLeft} 
                    onClick={() => {
                        if (isOtpSent) 
                          {
                            setIsOtpSent(false);
                            forgotFormik.setFieldValue("user_id", "");
                           } // Go back to Forgot Password screen
                        else if (showResetForm) setShowResetForm(false);
                        else navigate("/");
                    }} 
                    className="me-2" 
                    style={{ cursor: "pointer",color: "#314363" }} 
                />
                <h5 className="m-0 " style={{ fontSize: "1.15rem",color: "#314363"}}>
                    {showResetForm ? "Create New Password" : isOtpSent ? "OTP Sent to Email ID" : "Forgot Password"}
                </h5>
            </div>

            {/* Conditional Rendering */}
            {showResetForm ? (
                <>
                    <div className="d-flex flex-column align-items-center justify-content-center text-center mt-3" >
                        <img src="/forgotpassword.png" alt="lock" className="" style={{ width: "116px", height: "116px" }} />
                        <p className="mt-3" style={{ color: "#314363" }}>
                            Your New Password Must be Different From the Previous Password
                        </p>
                    </div>

                    {/* Password Reset Form */}
                    <form onSubmit={forgotFormik.handleSubmit}>
                        <div className="forgot-screen">
                            <div className="input-group mt-2">
                                <label htmlFor="otp">OTP received through SMS</label>
                                <div className="password-input-container">
                                    <input
                                        type="text"
                                        id="otp"
                                        name="otp"
                                        className="input-field"
                                        value={forgotFormik.values.otp}
                                        onChange={forgotFormik.handleChange}
                                        onBlur={forgotFormik.handleBlur}
                                        style={{ color: '#314363' }}
                                    />
                                </div>
                                {forgotFormik.touched.otp && forgotFormik.errors.otp && (
                                    <p className="errormessage ">{forgotFormik.errors.otp}</p>
                                )}
                            </div>
                            <div className="resend-otp mt-1 d-flex justify-content-end">

                                <p 
                                    className="resend-btn" 
                                    onClick={handleResendOTP} 
                                    disabled={isResendDisabled}
                                    style={{cursor: isResendDisabled ? 'not-allowed' : 'pointer' }}
                                >
                                    {isResendDisabled ? `Resend OTP ${timer}s` : "Resend OTP"}
                                </p>
                            </div>


                            <div className="password-field input-group mb-5">
                                <label htmlFor="new_password">New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        id="new_password"
                                        name="new_password"
                                        value={forgotFormik.values.new_password}
                                        onChange={forgotFormik.handleChange}
                                        onBlur={forgotFormik.handleBlur}
                                        className={forgotFormik.errors.new_password ? "input-error" : ""}
                                        style={{ color: '#314363' }}
                                    />
                                    <FontAwesomeIcon
                                        icon={showNewPassword ? faEyeSlash : faEye}
                                        className="eye-icon"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    />
                                </div>
                                {forgotFormik.touched.new_password && forgotFormik.errors.new_password && (
                                    <p className="errormessage ">{forgotFormik.errors.new_password}</p>
                                )}
                            </div>

                            <div className="password-field input-group mt-5">
                                <label htmlFor="confirm_password">Confirm New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirm_password"
                                        name="confirm_password"
                                        value={forgotFormik.values.confirm_password}
                                        onChange={forgotFormik.handleChange}
                                        // onChange={(e) => {
                                        //     forgotFormik.handleChange(e);
                                        //     forgotFormik.validateField("confirm_password"); // Manually validate
                                        //   }}
                                        className={forgotFormik.errors.confirm_password ? "input-error" : ""}
                                        onBlur={forgotFormik.handleBlur}
                                        style={{ color: '#314363' }}
                                    />
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                        className="eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                    />
                                </div>
                                {forgotFormik.touched.confirm_password && forgotFormik.errors.confirm_password && (
                                    <p className="errormessage ">{forgotFormik.errors.confirm_password}</p>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="generateotp-button mt-5 w-100">
                            Reset Password
                        </button>
                    </form>
                </>
            ) : !isOtpSent ? (
                <>
                    <div className="text-center mt-5">
                        <img src="/forgotpassword.png" alt="lock" className="mb-5" style={{ width: "116px", height: "116px" }} />
                        <h5 style={{ color: "#314363" }}>Please enter your User ID</h5>
                    </div>

                    <form onSubmit={forgotFormik.handleSubmit}>
                        <div className="input-group mt-5">
                            <label htmlFor="user_id">User ID</label>
                            <div className="password-input-container">
                                <input
                                    type="text"
                                    id="user_id"
                                    name="user_id"
                                    value={forgotFormik.values.user_id}
                                    onChange={forgotFormik.handleChange}
                                    onBlur={forgotFormik.handleBlur}
                                    className="input-field"
                                    style={{ color: ' #314363' }}
                                />
                            </div>
                            {forgotFormik.touched.user_id && forgotFormik.errors.user_id && (
                                <p className="errormessage ">{forgotFormik.errors.user_id}</p>
                            )}
                        </div>

                        {/* OTP Generation Button */}
                        {!isOtpSent && (
                            <button type="submit" className="generateotp-button mt-5 w-100">
                                GENERATE OTP
                            </button>
                        )}
                    </form>
                </>
            ) : (
                <div
                    className="d-flex flex-column align-items-center justify-content-center text-center mt-5"
                    style={{ minHeight: '350px' }}
                >
                    <video
                    src="/OTPAnimation.mp4"
                    autoPlay
                    loop
                    muted
                    style={{ width: '146px', height: '150px' }}
                    />
                    <p className="mt-3" style={{ color: '#314363' }}>
                   The OTP has been sent to your registered mobile number via text message.
                    </p>
                </div>
            )}
        </div>


        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
          <Modal.Body className="text-center p-4">
            {otpMessage === "Password Saved Successfully" || otpMessage ===  "Email sent successfully" ? (
              <img src="/greentick.gif" alt="Success" width="103" height="103" />
            ) : (
              <FontAwesomeIcon icon={faTriangleExclamation} size="3x" style={{ color: "#7a0014" }} />
            )}

            <h5 className="text-lg font-semibold mt-3" style={{ color: "#671E75" }}>
              {otpMessage || "Something went wrong."}
            </h5>

            <button
              className="mt-4 px-4 py-2 rounded-lg text-white"
              onClick={() => setIsModalOpen(false)}
              style={{ backgroundColor: "#671E75", border: "none", color: "#FFFFFF" }}
            >
              OK
            </button>
          </Modal.Body>
        </Modal>

            </div>
          );
};

export default ForgotPassword;
