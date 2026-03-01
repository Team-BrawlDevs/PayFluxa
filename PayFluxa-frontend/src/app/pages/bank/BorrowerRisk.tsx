import { useEffect, useState } from "react";
import axios from "axios";
import { StatusChip } from "../../components/StatusChip";
import { GaugeChart } from "../../components/GaugeChart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Calendar, TrendingDown, AlertTriangle } from "lucide-react";

export function BorrowerRisk() {
  const [highRiskUsers, setHighRiskUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [borrowerData, setBorrowerData] = useState<any>(null);

  const token = localStorage.getItem("access_token");

  /* ================= FETCH HIGH RISK USERS ================= */

  useEffect(() => {
    const fetchHighRisk = async () => {
      const res = await axios.get(
        "http://127.0.0.1:8000/admin/analytics/portfolio",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setHighRiskUsers(res.data.high_risk_users || []);
    };

    fetchHighRisk();
  }, []);

  /* ================= FETCH BORROWER DETAILS ================= */

  const loadBorrower = async (userId: number) => {
    const res = await axios.get(
      `http://127.0.0.1:8000/analytics/admin/analytics/borrower/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    setSelectedUser(userId);
    setBorrowerData(res.data);
  };

  /* ================= IF NO USER SELECTED ================= */

  if (!selectedUser) {
    return (
      <div className="space-y-6">
        <h2>High Risk Borrowers</h2>

        {highRiskUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No high risk borrowers found.
          </p>
        ) : (
          <div className="space-y-4">
            {highRiskUsers.map((user) => (
              <div
                key={user.user_id}
                onClick={() => loadBorrower(user.user_id)}
                className="p-4 border border-border cursor-pointer hover:bg-secondary/30 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">
                      User ID: {user.user_id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Risk Score: {user.risk_score}
                    </div>
                  </div>
                  <AlertTriangle className="text-red-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ================= BORROWER PROFILE VIEW ================= */

  return (
    <div className="space-y-8">
      <button
        onClick={() => {
          setSelectedUser(null);
          setBorrowerData(null);
        }}
        className="text-sm underline"
      >
        ← Back to High Risk List
      </button>

      <div className="bg-white border border-border shadow-sm p-6">
        <h2 className="mb-1">Borrower Risk Profile</h2>

        <div className="flex items-center gap-3">
          <StatusChip status={borrowerData?.risk_level?.toLowerCase()}>
            {borrowerData?.risk_level}
          </StatusChip>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white border border-border shadow-sm p-6">
          <GaugeChart
            value={borrowerData?.health_score || 0}
            label="Resilience Score"
          />
        </div>

        <div className="bg-white border border-border shadow-sm p-4">
          <div className="text-sm text-muted-foreground mb-2">
            Stress Probability
          </div>
          <div className="text-2xl text-[#F59E0B]">
            {borrowerData?.stress_probability_percentage || 0}%
          </div>
        </div>

        <div className="bg-white border border-border shadow-sm p-4">
          <div className="text-sm text-muted-foreground mb-2">EMI Burden</div>
          <div className="text-2xl">
            {borrowerData?.financials?.emi_burden_ratio || 0}%
          </div>
        </div>

        <div className="bg-white border border-border shadow-sm p-4">
          <div className="text-sm text-muted-foreground mb-2">
            Buffer Strength
          </div>
          <div className="text-2xl">
            {borrowerData?.financials?.buffer_months || 0} months
          </div>
        </div>
      </div>

      {/* Trend */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-4">Resilience Score Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={borrowerData?.trend || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#1E3A8A" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
