import axios from "axios";

const API = "http://127.0.0.1:8000";

export const getAlerts = async () => {
  const token = localStorage.getItem("access_token");

  const res = await axios.get(`${API}/analytics/alerts`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

export const dismissAlert = async (id: number) => {
  const token = localStorage.getItem("access_token");

  await axios.delete(`http://127.0.0.1:8000/analytics/alerts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const markAlertRead = async (id: number) => {
  const token = localStorage.getItem("access_token");

  await axios.patch(`http://127.0.0.1:8000/analytics/alerts/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getUnreadAlertCount = async () => {
  const token = localStorage.getItem("access_token");

  const res = await axios.get(
    "http://127.0.0.1:8000/analytics/alerts/unread-count",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.count;
};