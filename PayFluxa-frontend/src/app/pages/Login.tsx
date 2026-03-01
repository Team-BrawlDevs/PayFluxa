import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { login } from "../services/authService";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleFromQuery = searchParams.get("role");

  const handleLogin = async () => {
    try {
      const role = await login(email, password);

      if (role === "customer") {
        navigate("/customer/dashboard");
      } else if (role === "admin") {
        navigate("/bank/portfolio");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white p-8 shadow-md w-96 border border-border">
        <h2 className="text-2xl mb-6 text-primary text-center">
          {roleFromQuery === "admin" ? "Bank Login" : "Customer Login"}
        </h2>

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

        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

        <button
          onClick={handleLogin}
          className="w-full bg-primary text-white p-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}
