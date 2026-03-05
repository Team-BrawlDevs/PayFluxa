import api from "./api";

export const askCopilot = async (question: string, history: any[]) => {

  const res = await api.post("/copilot/chat", {
    question,
    history
  });

  return res.data;
};