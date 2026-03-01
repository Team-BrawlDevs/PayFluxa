import api from "./api";

export const getHighRiskBorrowers = async () => {
  const res = await api.get("/admin/analytics/portfolio");
  return res.data.high_risk_users;
};

export const getBorrowerProfile = async (userId: number) => {
  const res = await api.get(`/admin/analytics/borrower/${userId}`);
  return res.data;
};