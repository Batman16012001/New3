import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faArrowLeft,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import {
  signinResponse,
  roleBasedLoginApi,
} from "../../components/Login/LoginPageService";
import ForgotPassword from "./ForgotPassword";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [isOtpValidated, setIsOtpValidated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage Modal

  const navigate = useNavigate();

  const loginFormik = useFormik({
    initialValues: {
      user_id: "",
      password: "",
    },
    validationSchema: Yup.object({
      user_id: Yup.string()
        .matches(/^\d+$/, "User ID must contain only numbers")
        .min(6, "User ID must be at least 6 digits")
        .required("Enter a User ID"),
      password: Yup.string()
        .matches(
          /^(?=.*[aeiouAEIOU])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
          "Password must be at least 8 characters, include a number, a special character"
        )
        .required("Enter a Password"),
    }),
    onSubmit: async (values) => {
      console.log("Login values:", values);

      try {
        const user_id = loginFormik.values.user_id;
        const password = loginFormik.values.password;
        const response = await signinResponse(user_id, password);
        console.log("Login Successful:", response);
        sessionStorage.setItem("UserID", user_id);
        sessionStorage.setItem("JobTitle", response.job_title);
        sessionStorage.setItem("UserRole", response.user_role);
        // added by ankita tank on 4mar25 store user role for role based login
        sessionStorage.setItem("UserRole", response.user_role);

        console.log("User Role is a", response.user_role);

        try {
          const responseRoleBasedLogin = await roleBasedLoginApi(
            response.user_role
          );
          console.log("response of Role Based Login:", responseRoleBasedLogin);

          sessionStorage.setItem(
            "UserRoleBasedJson",
            JSON.stringify(responseRoleBasedLogin)
          );

          console.log(
            "response of Role Based Login store in sessionStorage set item",
            responseRoleBasedLogin
          );
        } catch (roleError) {
          console.error("Role Based Login Error:", roleError);
          setOtpMessage(
            "Failed to retrieve role-based login information. Try again."
          );
          setIsModalOpen(true);
          return;
        }
        // end of code

        setOtpMessage(response.message || "Failed to Sign in. Try again.");
        setIsModalOpen(true);

        navigate("/dashboard");
      } catch (error) {
        console.error("Login Error:", error);
        setIsModalOpen(true);
        if (error.response && error.response.data) {
          const { message, details } = error.response.data;

          // Handle different types of `details`
          let errorMessage = "";

          if (Array.isArray(details)) {
            // If details is an array, replace field names and join messages
            errorMessage = details
              .map(
                (msg) =>
                  msg
                    .replace("user_id", "User ID")
                    .replace("otp", "OTP")
                    .replace("password", "Password")
                    .replace("must NOT have more than", "must NOT exceed") // Also replacing OTP for better readability
              )
              .join("\n");
          } else if (typeof details === "string") {
            // If details is a string, replace field names
            errorMessage = details
              .replace("user ID", "User ID")
              .replace("user_id", "User ID")
              .replace("otp", "OTP")
              .replace("password", "Password")
              .replace("must NOT have more than", "must NOT exceed");
          } else {
            // If no details, fallback to message
            errorMessage = message || "Login Error";
          }

          //errorMessage = message || "Failed to reset password. Try again.";

          setOtpMessage(errorMessage);
        } else {
          setOtpMessage("Login Error");
        }

        setIsModalOpen(true);
      }
    },
  });

  return (
    <div className="login-container">
      <div>
        <img
          src="/LMSbackground.png"
          alt="Lead Management Portal"
          class="background-container"
        />
      </div>

      <div className="background-wrapper p-2">
        <div className="login-left">
          <img
            src="/loginleftimage.png"
            alt="Lead Management Portal"
            className="lead-image"
          />
        </div>

        <div className="login-right mr-4 p-5">
          <div className="login-title-wrapper">
            <img src="/login.png" alt="login-title" />
          </div>

          <form className="login-form" onSubmit={loginFormik.handleSubmit}>
            {/* User ID Field */}
            <div className="row login-screen">
              <div className="col-md-12 input-group">
                <label htmlFor="user_id">User ID :</label>
                <div className="password-input-container">
                  <input
                    type="text"
                    id="user_id"
                    name="user_id"
                    placeholder="User ID"
                    value={loginFormik.values.user_id}
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    className={loginFormik.errors.user_id ? "input-error" : ""}
                  />
                </div>
                <p className="error-message">
                  {loginFormik.touched.user_id && loginFormik.errors.user_id}
                </p>
              </div>

              {/* Password Field */}
              <div className=" col-md-12  input-group password-field mt-5">
                <label htmlFor="password">Password :</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={loginFormik.values.password}
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    className={loginFormik.errors.password ? "input-error" : ""}
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                <p className="error-message">
                  {loginFormik.touched.password && loginFormik.errors.password}
                </p>
              </div>
            </div>

            {/* Forgot Password */}
            <p
              className="forgot-password mt-4"
              style={{ textAlign: "right", width: "100%" }}
            >
              <a href="#" onClick={() => navigate("/forgotpassword")}>
                Forgot Password?
              </a>
            </p>

            {/* Login Button */}
            <button type="submit" className="login-button mt-3 w-100">
              LOGIN
            </button>
          </form>
        </div>
      </div>

      {/* Bootstrap Modal for OTP Alert */}
      {/* <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
        <Modal.Body>{otpMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}

      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
        <Modal.Body className="text-center p-4">
          {/* Red Warning Icon */}
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size="3x"
            style={{ color: "#7a0014" }}
          />

          {/* Error Message */}
          <h5
            className="text-lg font-semibold mt-3"
            style={{ color: "#671E75" }}
          >
            {otpMessage || "Something went wrong."}
          </h5>

          {/* OK Button */}
          <button
            className="mt-4 px-4 py-2 rounded-lg text-white"
            onClick={() => setIsModalOpen(false)}
            style={{ backgroundColor: "#671E75", border: "none" }}
          >
            OK
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LoginPage;
