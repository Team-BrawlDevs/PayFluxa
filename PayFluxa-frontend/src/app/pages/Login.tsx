import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { login, verifyLoginOtp } from "../services/authService";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleFromQuery = searchParams.get("role");

  // Step 1: Login (email + password)
  const handleLogin = async () => {
    try {
      await login(email, password);

      // OTP sent → show OTP input
      setShowOtp(true);
      setError("");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const role = await verifyLoginOtp(email, otp);

      if (role === "customer") {
        navigate("/customer/dashboard");
      } else if (role === "admin") {
        navigate("/bank/portfolio");
      }
    } catch (err) {
      setError("Invalid or expired OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white p-8 shadow-md w-96 border border-border">
        <h2 className="text-2xl mb-6 text-primary text-center">
          {roleFromQuery === "admin" ? "Bank Login" : "Customer Login"}
        </h2>

        {/* EMAIL + PASSWORD FORM */}
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

            {error && (
              <div className="text-red-500 text-sm mb-3">{error}</div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-primary text-white p-2"
            >
              Login
            </button>
          </>
        )}

        {/* OTP FORM */}
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