import api from "./api";

export const getMyEmis = async () => {
  const res = await api.get("/customer/emis");
  return res.data;
};
export const getLoanBook = async () => {
  const res = await api.get("/admin/loan-book");
  return res.data;
};