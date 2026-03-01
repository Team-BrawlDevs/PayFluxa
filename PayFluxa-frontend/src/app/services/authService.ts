// src/app/services/authService.ts

import api from "./api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", null, {
    params: { email, password },
  });

  const { access_token, role } = response.data;

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("role", role);

  return role;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
};