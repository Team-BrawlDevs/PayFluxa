import { StatusChip } from "../../components/StatusChip";
import { GaugeChart } from "../../components/GaugeChart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Calendar, TrendingDown, AlertTriangle } from "lucide-react";

const historicalResilience = [
  { month: 'Aug 25', score: 78 },
  { month: 'Sep 25', score: 76 },
  { month: 'Oct 25', score: 74 },
  { month: 'Nov 25', score: 73 },
  { month: 'Dec 25', score: 71 },
  { month: 'Jan 26', score: 72 },
  { month: 'Feb 26', score: 72 },
];

const simulationHistory = [
  { date: '15 Feb 2026', scenario: 'Home Loan - ₹20L', outcome: 'High Risk', status: 'Rejected' },
  { date: '08 Feb 2026', scenario: 'Personal Loan - ₹5L', outcome: 'Moderate Risk', status: 'Under Review' },
  { date: '22 Jan 2026', scenario: 'Vehicle Loan - ₹8L', outcome: 'Low Risk', status: 'Approved' },
  { date: '10 Dec 2025', scenario: 'Credit Card Limit', outcome: 'Low Risk', status: 'Approved' },
];

export function BorrowerRisk() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-border shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="mb-1">Borrower Risk Profile</h2>
            <p className="text-sm text-muted-foreground mb-4">Customer ID: CIF234567890 | Amit Kumar</p>
            <div className="flex items-center gap-3">
              <StatusChip status="medium">MEDIUM RISK</StatusChip>
              <span className="text-sm text-muted-foreground">Last Updated: 27 Feb 2026</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">
              View Full History
            </button>
            <button className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white border border-border shadow-sm p-6">
          <GaugeChart value={72} label="Resilience Score" />
        </div>
        <div className="bg-white border border-border shadow-sm p-4">
          <div className="text-sm text-muted-foreground mb-2">Stress Probability</div>
          <div className="text-2xl mb-1 text-[#F59E0B]">23.5%</div>
          <div className="text-xs text-muted-foreground">Next 6 months</div>
        </div>
        <div className="bg-white border border-border shadow-sm p-4">
          <div className="text-sm text-muted-foreground mb-2">EMI Burden</div>
          <div className="text-2xl mb-1 text-[#F59E0B]">45%</div>
          <div className="w-full bg-secondary h-2 mt-2">
            <div className="bg-[#F59E0B] h-2" style={{ width: '45%' }}></div>
          </div>
        </div>
        <div className="bg-white border border-border shadow-sm p-4">
          <div className="text-sm text-muted-foreground mb-2">Buffer Strength</div>
          <div className="text-2xl mb-1">3.2 months</div>
          <div className="flex items-center gap-1 text-xs text-[#DC2626] mt-1">
            <TrendingDown size={12} />
            Below threshold
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Financial Details */}
        <div className="space-y-6">
          <div className="bg-white border border-border shadow-sm p-6">
            <h3 className="mb-4">Financial Profile</h3>
            <div className="space-y-4">
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Monthly Income</span>
                <span className="text-sm">₹85,000</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Income Volatility</span>
                <span className="text-sm text-[#F59E0B]">12.3%</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Total EMI Obligation</span>
                <span className="text-sm">₹38,250</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Available Buffer</span>
                <span className="text-sm">₹2,72,000</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Credit Score</span>
                <span className="text-sm text-[#10B981]">762</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Loans</span>
                <span className="text-sm">2 (Home + Vehicle)</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border shadow-sm p-6">
            <h3 className="mb-4">Risk Indicators</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-[#FEF3C7] border-l-4 border-[#F59E0B]">
                <AlertTriangle size={18} className="text-[#F59E0B] mt-1" />
                <div className="flex-1">
                  <div className="text-sm mb-1">EMI Burden Approaching Threshold</div>
                  <div className="text-xs text-muted-foreground">Current: 45% (Threshold: 50%)</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#FEF3C7] border-l-4 border-[#F59E0B]">
                <AlertTriangle size={18} className="text-[#F59E0B] mt-1" />
                <div className="flex-1">
                  <div className="text-sm mb-1">Buffer Below Recommended Level</div>
                  <div className="text-xs text-muted-foreground">Current: 3.2 months (Required: 5 months)</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#D1FAE5] border-l-4 border-[#10B981]">
                <Calendar size={18} className="text-[#10B981] mt-1" />
                <div className="flex-1">
                  <div className="text-sm mb-1">No Payment Defaults</div>
                  <div className="text-xs text-muted-foreground">Clean record for 36+ months</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Trends & History */}
        <div className="space-y-6">
          <div className="bg-white border border-border shadow-sm p-6">
            <h3 className="mb-4">Resilience Score Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historicalResilience}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6B7280" />
                <YAxis domain={[60, 80]} tick={{ fontSize: 12 }} stroke="#6B7280" />
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
                  dataKey="score" 
                  stroke="#1E3A8A" 
                  strokeWidth={2}
                  dot={{ fill: '#1E3A8A', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-secondary">
              <div className="text-xs text-muted-foreground">Trend Analysis</div>
              <div className="text-sm mt-1">Declining trend over 6 months. Score dropped from 78 to 72 (-7.7%). Requires monitoring.</div>
            </div>
          </div>

          <div className="bg-white border border-border shadow-sm p-6">
            <h3 className="mb-4">Simulation History</h3>
            <div className="space-y-3">
              {simulationHistory.map((item, index) => (
                <div key={index} className="p-4 border border-border hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm mb-1">{item.scenario}</div>
                      <div className="text-xs text-muted-foreground">{item.date}</div>
                    </div>
                    <StatusChip 
                      status={
                        item.status === 'Approved' ? 'approved' : 
                        item.status === 'Rejected' ? 'rejected' : 
                        'under-review'
                      }
                    >
                      {item.status}
                    </StatusChip>
                  </div>
                  <div className="text-xs text-muted-foreground">Outcome: {item.outcome}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border border-border shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1">Risk Management Actions</h3>
            <p className="text-sm text-muted-foreground">Review and take appropriate action based on risk assessment</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 text-sm border border-border hover:bg-secondary transition-colors">
              Initiate Credit Review
            </button>
            <button className="px-6 py-2 text-sm border border-[#F59E0B] text-[#F59E0B] hover:bg-[#FEF3C7] transition-colors">
              Recommend Restructuring
            </button>
            <button className="px-6 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
