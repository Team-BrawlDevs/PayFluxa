import api from "./api";

export const getInvestmentAdvisor = async () => {
  const res = await api.get("/investment/advisor");
  return res.data;
};