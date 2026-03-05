import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Step 1: Register
  const handleRegister = async () => {
    try {
      await api.post("/auth/register", null, {
        params: {
          email,
          password,
          phone_number: phoneNumber,
          role: "customer",
        },
      });

      setShowOtp(true);
      setError("");
      setMessage("OTP sent to your phone");
    } catch (err) {
      setError("Registration failed");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      await api.post("/auth/verify-otp", null, {
        params: {
          email,
          otp,
        },
      });

      setMessage("Phone verified successfully!");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError("Invalid or expired OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white p-8 shadow-md w-96 border border-border">
        <h2 className="text-2xl mb-6 text-primary text-center">
          Create Customer Account
        </h2>

        {!showOtp && (
          <>
            <input
              className="w-full mb-4 p-2 border border-border"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full mb-4 p-2 border border-border"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="w-full mb-4 p-2 border border-border"
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            {error && (
              <div className="text-red-500 text-sm mb-3">{error}</div>
            )}
            {message && (
              <div className="text-green-600 text-sm mb-3">{message}</div>
            )}

            <button
              onClick={handleRegister}
              className="w-full bg-primary text-white p-2"
            >
              Create Account
            </button>
          </>
        )}

        {showOtp && (
          <>
            <p className="text-sm text-gray-600 mb-3 text-center">
              Enter the OTP sent to your phone
            </p>

            <input
              className="w-full mb-4 p-2 border border-border"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            {error && (
              <div className="text-red-500 text-sm mb-3">{error}</div>
            )}
            {message && (
              <div className="text-green-600 text-sm mb-3">{message}</div>
            )}

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-primary text-white p-2"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}