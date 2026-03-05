import { createBrowserRouter, Navigate } from "react-router";
import { CustomerLayout } from "./layouts/CustomerLayout";
import { BankLayout } from "./layouts/BankLayout";
import { Welcome } from "./pages/Welcome";
import { CustomerDashboard } from "./pages/customer/Dashboard";
import { FinancialTwin } from "./pages/customer/FinancialTwin";
import { Simulation } from "./pages/customer/Simulation";
import { Copilot } from "./pages/customer/Copilot";
import { BorrowingReadiness } from "./pages/customer/BorrowingReadiness";
import { Alerts } from "./pages/customer/Alerts";
import { PortfolioDashboard } from "./pages/bank/PortfolioDashboard";
import { BorrowerRisk } from "./pages/bank/BorrowerRisk";
import { Restructuring } from "./pages/bank/Restructuring";
import { PolicySimulation } from "./pages/bank/PolicySimulation";
import { AuditLogs } from "./pages/bank/AuditLogs";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import InvestmentAdvisor from "./pages/customer/InvestmentAdvisor";
import { Register } from "./pages/Register";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path:"/register",
    element:<Register />,
  },
  {
    path: "/customer",
    element: (
      <ProtectedRoute requiredRole="customer">
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/customer/dashboard" replace /> },
      { path: "dashboard", element: <CustomerDashboard /> },
      { path: "financial-twin", element: <FinancialTwin /> },
      { path: "simulation", element: <Simulation /> },
      { path: "copilot", element: <Copilot /> },

      { path: "investment-advisor", element: <InvestmentAdvisor /> },

      { path: "borrowing-readiness", element: <BorrowingReadiness /> },
      { path: "alerts", element: <Alerts /> },
    ],
  },
  {
    path: "/bank",
    element: (
      <ProtectedRoute requiredRole="admin">
        <BankLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/bank/portfolio" replace /> },
      { path: "portfolio", element: <PortfolioDashboard /> },
      { path: "borrower-risk", element: <BorrowerRisk /> },
      { path: "restructuring", element: <Restructuring /> },
      { path: "policy-simulation", element: <PolicySimulation /> },
      { path: "audit-logs", element: <AuditLogs /> },
    ],
  },
]);
