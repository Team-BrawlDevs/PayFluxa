import api from "./api";

export const askCopilot = async (question: string) => {
  const res = await api.post("/analytics/copilot", {
    question: question,
  });
  return res.data;
};