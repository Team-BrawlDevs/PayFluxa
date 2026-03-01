import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const useSessionTimer = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const expiry = decoded.exp * 1000;

      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(expiry - now, 0);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          localStorage.removeItem("access_token");
          window.location.href = "/";
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    } catch (err) {
      console.error("Session timer error", err);
    }
  }, []);

  return timeLeft;
};

export const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};