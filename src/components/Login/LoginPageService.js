import axios from "axios";

// Useridvalidations
export const userIdResponse = async (user_id) => {
  try {
    console.log("Validating User ID...");

    const userIdUrl = `http://192.168.2.11:3000/auth/useridValidation/${user_id}`;

    const response = await axios.get(userIdUrl, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": navigator.userAgent,
        "X-Forwarded-For": "192.168.1.100",
      },
    });

    console.log(navigator.userAgent);
    return response.data;
  } catch (error) {
    console.error(
      "User ID validation failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// OTP validation
export const otpGenerationResponse = async (user_id) => {
  try {
    console.log("Making otp generation request...");
    const otpGenerationUrl = `http://192.168.2.11:3000/auth/generateOTP`;
    const response = await axios.post(
      otpGenerationUrl,
      { user_id },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": navigator.userAgent,
          "X-Forwarded-For": "192.168.1.100",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to OTP generation:", error);
    throw error;
  }
};

// Reset Password
export const forgotpasswordResponse = async (
  user_id,
  otp,
  new_password,
  confirm_password
) => {
  try {
    console.log("Making otp validation request...");
    const forgotpasswordUrl = `http://192.168.2.11:3000/auth/forgetPassword`;
    const response = await axios.post(
      forgotpasswordUrl,
      {
        user_id,
        otp,
        new_password,
        confirm_password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": navigator.userAgent,
          "X-Forwarded-For": "192.168.1.100",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to Reset Password:", error);
    throw error;
  }
};

// Login
export const signinResponse = async (user_id, password) => {
  try {
    console.log("Making login request...");
    const signinUrl = `http://192.168.2.11:3000/auth/login`;
    const response = await axios.post(
      signinUrl,
      { user_id, password },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": navigator.userAgent,
          "X-Forwarded-For": "192.168.1.100",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to login:", error);
    throw error;
  }
};

// added by ankita tank on 6mar25 Role Based Login API Call for User Role Based Login
export const roleBasedLoginApi = async (user_role) => {
  try {
    console.log("role Based Login Api get request ...");

    const roleBasedLoginUrl = ` http://192.168.2.11:3002/configurableitems/getUserRole?user_role=${user_role}`;
    console.log("roleBasedLoginUrl", roleBasedLoginUrl);

    const response = await axios.get(roleBasedLoginUrl, {
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": "192.168.1.100",
      },
    });
    return response.data.result[0]["Roles"];
  } catch (error) {
    console.error(
      "User ID validation failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};
