import api from "./api";

export const getAuditLogs = async () => {
  const res = await api.get("/admin/audit-logs");
  return res.data;
};