import api from "./api";

export const getHealthScore = async () => {
  const res = await api.get("/analytics/health-score");
  return res.data;
};

export const getRisk = async () => {
  const res = await api.get("/analytics/risk-profile");
  return res.data;
};

export const getMonteCarlo = async () => {
  const res = await api.get("/analytics/monte-carlo");
  return res.data;
};

export const getAlerts = async () => {
  const res = await api.get("/analytics/insights");
  return res.data.insights;   // <-- important
};

export const getUser = async()=>{
  const res = await api.get("/account/my-account");
  return res.data;
}