import api from "./api";

export const runSimulation = async (payload: any) => {
  const res = await api.post("/analytics/simulate", payload);
  return res.data;
};