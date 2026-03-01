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
  getHealthScore,
  getAlerts,
  getMonteCarlo,
} from "../../services/dashboardService";

export function CustomerDashboard() {
  const [healthData, setHealthData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [monteCarlo, setMonteCarlo] = useState<any>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const health = await getHealthScore();
        setHealthData(health);

        const insights = await getAlerts();
        setAlerts(insights);

        const mc = await getMonteCarlo();
        setMonteCarlo(mc);
      } catch (error) {
        console.error("Dashboard load error:", error);
      }
    };

    loadDashboard();
  }, []);

  const healthScore = healthData?.health_score || 0;

  const healthLabel =
    healthScore >= 75
      ? "Excellent"
      : healthScore >= 60
        ? "Good"
        : healthScore >= 40
          ? "Moderate Risk"
          : "High Risk";

  const survivalData =
    monteCarlo?.monthly_survival_curve?.map((m: any) => ({
      month: m.month,
      value: m.probability,
    })) || [];

  const emiBurdenData = [
    {
      name: "EMI Burden",
      value: (monteCarlo?.emi_burden_ratio || 0) * 100,
      color: "#1E3A8A",
    },
    {
      name: "Available Income",
      value: (monteCarlo?.available_ratio || 0) * 100,
      color: "#E5E7EB",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Financial Resilience Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Comprehensive view of your financial health and stress indicators
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard title="Financial Resilience Score">
          <GaugeChart value={healthScore} label={healthLabel} />
        </KPICard>

        <KPICard
          title="Stress Probability"
          value={`${monteCarlo?.stress_probability_percentage || 0}%`}
          subtitle="Next 6 months"
        />

        <KPICard title="Expected Stress Month">
          <div className="flex items-center gap-2">
            <Calendar size={32} className="text-[#F59E0B]" />
            <div>
              <div className="text-lg">
                {monteCarlo?.expected_stress_month || "N/A"}
              </div>
            </div>
          </div>
        </KPICard>

        <KPICard
          title="Buffer Strength"
          value={`${monteCarlo?.buffer_months || 0} months`}
          subtitle="Survivability period"
        />
      </div>

      {/* Survivability Chart */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">Survival Probability Curve</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={survivalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#1E3A8A" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* EMI Burden Chart */}
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">EMI Burden Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={emiBurdenData}
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

      {/* Insights */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-4">Recent Insights</h3>

        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No insights available.
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 border border-border"
              >
                <div>
                  {alert.type === "risk" && (
                    <AlertTriangle className="text-red-500" size={20} />
                  )}
                  {alert.type === "trend" && (
                    <TrendingDown className="text-yellow-500" size={20} />
                  )}
                  {alert.type === "recommendation" && (
                    <AlertTriangle className="text-green-500" size={20} />
                  )}
                </div>

                <div>
                  <div className="font-medium capitalize text-sm mb-1">
                    {alert.type}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {alert.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
