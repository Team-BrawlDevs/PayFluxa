import { KPICard } from "../../components/KPICard";
import { BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ZAxis } from "recharts";
import { TrendingUp, Users, AlertTriangle } from "lucide-react";

const riskDistribution = [
  { name: 'Low Risk', value: 65, color: '#10B981' },
  { name: 'Medium Risk', value: 25, color: '#F59E0B' },
  { name: 'High Risk', value: 10, color: '#DC2626' },
];

const stressDistribution = [
  { range: '0-10%', count: 2340 },
  { range: '10-20%', count: 1850 },
  { range: '20-30%', count: 1120 },
  { range: '30-40%', count: 680 },
  { range: '40-50%', count: 320 },
  { range: '50%+', count: 190 },
];

const stressCluster = [
  { resilience: 85, emi: 25, stress: 8, size: 450 },
  { resilience: 72, emi: 38, stress: 18, size: 680 },
  { resilience: 68, emi: 45, stress: 23, size: 920 },
  { resilience: 55, emi: 52, stress: 35, size: 540 },
  { resilience: 48, emi: 58, stress: 42, size: 380 },
  { resilience: 42, emi: 65, stress: 51, size: 290 },
  { resilience: 38, emi: 72, stress: 58, size: 190 },
];

export function PortfolioDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Portfolio Risk Dashboard</h2>
        <p className="text-sm text-muted-foreground">Comprehensive overview of borrower portfolio risk and resilience metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard title="Average Resilience Score" value="68.5" subtitle="Portfolio-wide" trend={{ value: 3.2, positive: true }} />
        <KPICard title="High Risk Borrowers">
          <div className="flex items-center gap-3">
            <AlertTriangle size={32} className="text-[#DC2626]" />
            <div>
              <div className="text-2xl">652</div>
              <div className="text-xs text-muted-foreground">10.2% of portfolio</div>
            </div>
          </div>
        </KPICard>
        <KPICard title="Avg. Stress Probability" value="24.8%" subtitle="Next 6 months" trend={{ value: 5.1, positive: false }} />
        <KPICard title="Total EMI Exposure" value="₹845 Cr" subtitle="Active loans" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Stress Distribution */}
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">Stress Probability Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stressDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {stressDistribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index < 2 ? '#10B981' : index < 4 ? '#F59E0B' : '#DC2626'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Band Distribution */}
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">Risk Band Distribution</h3>
          <div className="flex items-center justify-center h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                  label={({ value }) => `${value}%`}
                >
                  {riskDistribution.map((entry, index) => (
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
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stress Cluster Analysis */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-4">Risk Cluster Analysis</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Borrower distribution by resilience score and EMI burden (bubble size represents borrower count)
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              type="number" 
              dataKey="resilience" 
              name="Resilience Score" 
              tick={{ fontSize: 12 }} 
              stroke="#6B7280"
              label={{ value: 'Resilience Score', position: 'bottom', fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="emi" 
              name="EMI Burden %" 
              tick={{ fontSize: 12 }} 
              stroke="#6B7280"
              label={{ value: 'EMI Burden %', angle: -90, position: 'left', fontSize: 12 }}
            />
            <ZAxis type="number" dataKey="size" range={[100, 1000]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #E5E7EB',
                borderRadius: '4px',
                fontSize: '12px'
              }}
              formatter={(value: any, name: string) => {
                if (name === 'size') return [`${value} borrowers`, 'Count'];
                if (name === 'stress') return [`${value}%`, 'Stress Probability'];
                return value;
              }}
            />
            <Scatter name="Borrowers" data={stressCluster} fill="#1E3A8A">
              {stressCluster.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.stress < 20 ? '#10B981' : entry.stress < 40 ? '#F59E0B' : '#DC2626'} 
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Heatmap Grid */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-4">Portfolio Risk Heatmap</h3>
        <div className="grid grid-cols-5 gap-2">
          {['Income Stability', 'EMI Burden', 'Buffer Adequacy', 'Credit History', 'Stress Trend'].map((metric) => (
            <div key={metric} className="text-xs text-muted-foreground text-center mb-2">{metric}</div>
          ))}
          <div className="bg-[#10B981] p-6 text-white text-center">
            <div className="text-xs mb-1">Low Risk</div>
            <div className="text-lg">4,123</div>
          </div>
          <div className="bg-[#F59E0B] p-6 text-white text-center">
            <div className="text-xs mb-1">Moderate</div>
            <div className="text-lg">892</div>
          </div>
          <div className="bg-[#10B981] p-6 text-white text-center">
            <div className="text-xs mb-1">Good</div>
            <div className="text-lg">3,845</div>
          </div>
          <div className="bg-[#10B981] p-6 text-white text-center">
            <div className="text-xs mb-1">Excellent</div>
            <div className="text-lg">5,234</div>
          </div>
          <div className="bg-[#F59E0B] p-6 text-white text-center">
            <div className="text-xs mb-1">Increasing</div>
            <div className="text-lg">1,567</div>
          </div>
        </div>
      </div>
    </div>
  );
}
