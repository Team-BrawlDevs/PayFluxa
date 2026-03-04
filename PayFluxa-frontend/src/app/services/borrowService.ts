import api from "./api";

export const getBorrowingReadiness = async () => {
  const res = await api.get("/analytics/borrowing-readiness");
  return res.data;
};