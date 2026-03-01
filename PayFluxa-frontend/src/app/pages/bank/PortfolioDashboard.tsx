import { useEffect, useState } from "react";
import axios from "axios";
import { KPICard } from "../../components/KPICard";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ZAxis,
} from "recharts";
import { TrendingUp, Users, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

interface PortfolioResponse {
  total_users: number;
  total_accounts: number;
  total_system_balance: number;
  average_health_score: number;
  risk_distribution: Record<string, number>;
  high_risk_users: { user_id: number; risk_score: number }[];
  average_stress_probability_percentage: number;
  stress_distribution: Record<string, number>;
}

/* ================= COMPONENT ================= */

export function PortfolioDashboard() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");

      const response = await axios.get<PortfolioResponse>(
        "http://127.0.0.1:8000/admin/analytics/portfolio",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setData(response.data);
    };

    fetchData();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  /* ================= Transform Data ================= */

  const riskDistribution = Object.entries(data.risk_distribution).map(
    ([name, value]) => ({
      name,
      value,
      color:
        name === "LOW"
          ? "#10B981"
          : name === "MEDIUM"
            ? "#F59E0B"
            : name === "HIGH"
              ? "#DC2626"
              : "#7C3AED",
    }),
  );

  const stressDistribution = Object.entries(data.stress_distribution).map(
    ([range, count]) => ({
      range,
      count,
    }),
  );

  /* ================= RENDER ================= */

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Portfolio Risk Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Comprehensive overview of borrower portfolio risk and resilience
          metrics
        </p>
      </div>

      {/* KPI Cards (Same Design) */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          title="Average Resilience Score"
          value={data.average_health_score.toString()}
          subtitle="Portfolio-wide"
        />

        <KPICard title="High Risk Borrowers">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/bank/borrower-risk")}
          >
            <AlertTriangle size={32} className="text-[#DC2626]" />
            <div>
              <div className="text-2xl">{data.high_risk_users.length}</div>
              <div className="text-xs text-muted-foreground">
                Out of {data.total_users} users
              </div>
            </div>
          </div>
        </KPICard>

        <KPICard
          title="Avg. Stress Probability"
          value={`${data.average_stress_probability_percentage}%`}
          subtitle="Next 6 months"
        />

        <KPICard
          title="Total System Balance"
          value={`₹${data.total_system_balance.toLocaleString("en-IN")}`}
          subtitle="All accounts"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Stress Distribution */}
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">Stress Probability Distribution</h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stressDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="range" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="count">
                {stressDistribution.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      index < 2 ? "#10B981" : index < 4 ? "#F59E0B" : "#DC2626"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Band Distribution */}
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">Risk Band Distribution</h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={riskDistribution}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
                label={({ value }) => value}
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 flex justify-center gap-6">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
