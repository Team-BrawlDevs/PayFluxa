import api from "./api";

export const getAllCases = async () => {
  const res = await api.get("/admin/restructuring/cases");
  return res.data;
};

export const getCaseDetails = async (caseId: string) => {
  const res = await api.get(`/admin/restructuring/${caseId}`);
  return res.data;
};

export const approveCase = async (caseId: string, comments: string) => {
  const res = await api.post(
    `/admin/restructuring/${caseId}/approve`,
    null,
    { params: { comments } }
  );
  return res.data;
};

export const rejectCase = async (caseId: string, comments: string) => {
  const res = await api.post(
    `/admin/restructuring/${caseId}/reject`,
    null,
    { params: { comments } }
  );
  return res.data;
};