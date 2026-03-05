// src/app/services/authService.ts

import api from "./api";

export const getCurrentUserProfile = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const getMyAccount = async () => {
  const res = await api.get("/account/my-account");
  console.log(res.data["account_number"]);
  return res.data;
};

/**
 * Step 1: Login with email + password
 * This only triggers OTP from backend
 */
export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", null, {
    params: { email, password },
  });

  return response.data;
};

/**
 * Step 2: Verify login OTP
 * This returns JWT token and role
 */
export const verifyLoginOtp = async (email: string, otp: string) => {
  const response = await api.post("/auth/verify-login-otp", null, {
    params: { email, otp },
  });

  const { access_token, role } = response.data;

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("role", role);

  return role;
};

/**
 * Logout
 */
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
};