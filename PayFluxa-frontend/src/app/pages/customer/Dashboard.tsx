import { useEffect, useState } from "react";
import { KPICard } from "../../components/KPICard";
import { GaugeChart } from "../../components/GaugeChart";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AlertTriangle, TrendingDown, Calendar } from "lucide-react";

import {
  getHealth,
  getRisk,
  getMonteCarlo,
  getAlerts,
} from "../../services/dashboardService";

export function CustomerDashboard() {
  const [health, setHealth] = useState<any>(null);
  const [risk, setRisk] = useState<any>(null);
  const [monteCarlo, setMonteCarlo] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
  const loadDashboard = async () => {
    try {
      const health = await getHealthScore();
      setHealthData(health);

      const insights = await getAlerts();
      setAlerts(insights);

    } catch (error) {
      console.error("Dashboard load error:", error);
    }
  };

  loadDashboard();
}, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const healthData = await getHealth();
        const riskData = await getRisk();
        const mcData = await getMonteCarlo();
        const alertData = await getAlerts();

        setHealth(healthData);
        setRisk(riskData);
        setMonteCarlo(mcData);
        setAlerts(alertData);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const survivalData =
    monteCarlo?.projection?.map((item: any) => ({
      month: item.month,
      value: item.score,
    })) || [];

  const emiBurdenData = [
    {
      name: "EMI Burden",
      value: risk?.emi_ratio || 0,
      color: "#1E3A8A",
    },
    {
      name: "Available",
      value: 100 - (risk?.emi_ratio || 0),
      color: "#E5E7EB",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Financial Resilience Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Real-time financial health and risk analytics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard title="Financial Resilience Score">
          <GaugeChart
            value={health?.health_score || 0}
            label={health?.label || "Unknown"}
          />
        </KPICard>

        <KPICard
          title="Stress Probability"
          value={`${risk?.stress_probability || 0}%`}
          subtitle="Next 6 months"
        />

        <KPICard title="Expected Stress Month">
          <div className="flex items-center gap-2">
            <Calendar size={32} className="text-[#F59E0B]" />
            <div>
              <div className="text-2xl">
                {risk?.expected_stress_month || "N/A"}
              </div>
              <div className="text-xs text-muted-foreground">
                {risk?.expected_year || ""}
              </div>
            </div>
          </div>
        </KPICard>

        <KPICard
          title="Buffer Strength"
          value={`${health?.buffer_months || 0} months`}
          subtitle="Survivability period"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">12-Month Survivability Projection</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={survivalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1E3A8A"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">EMI Burden Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={emiBurdenData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {emiBurdenData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {alerts.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No active alerts
            </div>
          )}

          {alerts.map((alert: any) => (
            <div
              key={alert.id}
              className="flex items-start gap-4 p-4 border border-border"
            >
              <div>
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">{alert.title}</div>
                <div className="text-sm text-muted-foreground">
                  {alert.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
