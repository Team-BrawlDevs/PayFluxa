import { KPICard } from "../../components/KPICard";
import { GaugeChart } from "../../components/GaugeChart";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { AlertTriangle, TrendingDown, Calendar } from "lucide-react";

const survivalData = [
  { month: 'Jan', value: 82 },
  { month: 'Feb', value: 78 },
  { month: 'Mar', value: 75 },
  { month: 'Apr', value: 71 },
  { month: 'May', value: 68 },
  { month: 'Jun', value: 65 },
  { month: 'Jul', value: 62 },
  { month: 'Aug', value: 59 },
  { month: 'Sep', value: 56 },
  { month: 'Oct', value: 53 },
  { month: 'Nov', value: 50 },
  { month: 'Dec', value: 47 },
];

const emiBurdenData = [
  { name: 'EMI Burden', value: 45, color: '#1E3A8A' },
  { name: 'Available Income', value: 55, color: '#E5E7EB' },
];

const alerts = [
  { id: 1, type: 'warning', title: 'Low Buffer Detected', description: 'Your financial buffer has dropped below recommended levels', time: '2 hours ago', severity: 'medium' },
  { id: 2, type: 'danger', title: 'Income Volatility High', description: 'Income fluctuation detected at 18% over past 3 months', time: '1 day ago', severity: 'high' },
  { id: 3, type: 'info', title: 'EMI Review Recommended', description: 'Current EMI burden at 45% - consider restructuring options', time: '2 days ago', severity: 'low' },
];

export function CustomerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Financial Resilience Dashboard</h2>
        <p className="text-sm text-muted-foreground">Comprehensive view of your financial health and stress indicators</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard title="Financial Resilience Score">
          <GaugeChart value={72} label="Good Standing" />
        </KPICard>
        <KPICard title="Stress Probability" value="23.5%" subtitle="Next 6 months" />
        <KPICard title="Expected Stress Month">
          <div className="flex items-center gap-2">
            <Calendar size={32} className="text-[#F59E0B]" />
            <div>
              <div className="text-2xl">August</div>
              <div className="text-xs text-muted-foreground">2026</div>
            </div>
          </div>
        </KPICard>
        <KPICard title="Buffer Strength" value="3.2 months" subtitle="Survivability period" trend={{ value: 12, positive: false }} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Survivability Chart */}
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">12-Month Survivability Projection</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={survivalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px',
                  fontSize: '12px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#1E3A8A" 
                strokeWidth={2}
                dot={{ fill: '#1E3A8A', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* EMI Burden Chart */}
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">EMI Burden Distribution</h3>
          <div className="flex items-center justify-center h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emiBurdenData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {emiBurdenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1E3A8A]"></div>
              <span className="text-sm">EMI Burden: 45%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#E5E7EB]"></div>
              <span className="text-sm">Available: 55%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-4 p-4 border border-border hover:bg-secondary/50 transition-colors">
              <div className={`w-1 h-full absolute left-0 ${
                alert.severity === 'high' ? 'bg-[#DC2626]' : 
                alert.severity === 'medium' ? 'bg-[#F59E0B]' : 
                'bg-[#10B981]'
              }`}></div>
              <div className={`mt-1 ${
                alert.severity === 'high' ? 'text-[#DC2626]' : 
                alert.severity === 'medium' ? 'text-[#F59E0B]' : 
                'text-[#10B981]'
              }`}>
                {alert.severity === 'high' ? <AlertTriangle size={20} /> : 
                 alert.severity === 'medium' ? <TrendingDown size={20} /> : 
                 <AlertTriangle size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm mb-1">{alert.title}</div>
                    <div className="text-sm text-muted-foreground">{alert.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">{alert.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
