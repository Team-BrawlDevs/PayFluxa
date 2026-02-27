import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Play } from "lucide-react";

const initialDistribution = [
  { range: '0-10%', before: 2340, after: 2340 },
  { range: '10-20%', before: 1850, after: 1850 },
  { range: '20-30%', before: 1120, after: 1120 },
  { range: '30-40%', before: 680, after: 680 },
  { range: '40-50%', before: 320, after: 320 },
  { range: '50%+', before: 190, after: 190 },
];

const simulatedDistribution = [
  { range: '0-10%', before: 2340, after: 1980 },
  { range: '10-20%', before: 1850, after: 1620 },
  { range: '20-30%', before: 1120, after: 1450 },
  { range: '30-40%', before: 680, after: 890 },
  { range: '40-50%', before: 320, after: 510 },
  { range: '50%+', before: 190, after: 350 },
];

export function PolicySimulation() {
  const [repoRate, setRepoRate] = useState(6.5);
  const [sectorShock, setSectorShock] = useState(0);
  const [simulated, setSimulated] = useState(false);

  const handleSimulation = () => {
    setSimulated(true);
  };

  const distribution = simulated ? simulatedDistribution : initialDistribution;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Policy Simulation</h2>
        <p className="text-sm text-muted-foreground">Assess portfolio-wide impact of policy changes and economic scenarios</p>
      </div>

      {/* Simulation Controls */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-6">Simulation Parameters</h3>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-sm mb-3">Repo Rate Adjustment (%)</label>
            <input
              type="range"
              min="4.0"
              max="9.0"
              step="0.25"
              value={repoRate}
              onChange={(e) => setRepoRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>4.0%</span>
              <span className="text-primary text-base">{repoRate.toFixed(2)}%</span>
              <span>9.0%</span>
            </div>
            <div className="mt-3 p-3 bg-secondary">
              <div className="text-xs text-muted-foreground">Current RBI Repo Rate: 6.50%</div>
              <div className="text-xs mt-1">
                {repoRate > 6.5 ? `+${(repoRate - 6.5).toFixed(2)}% increase` : repoRate < 6.5 ? `${(repoRate - 6.5).toFixed(2)}% decrease` : 'No change'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-3">Sector-Specific Shock (%)</label>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={sectorShock}
              onChange={(e) => setSectorShock(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>0%</span>
              <span className="text-primary text-base">{sectorShock}%</span>
              <span>30%</span>
            </div>
            <div className="mt-3 p-3 bg-secondary">
              <div className="text-xs text-muted-foreground">Simulates income reduction in affected sectors</div>
              <div className="text-xs mt-1">
                {sectorShock === 0 ? 'No sector shock applied' : `${sectorShock}% income reduction scenario`}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSimulation}
            className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Play size={18} />
            Run Portfolio Simulation
          </button>
          {simulated && (
            <span className="text-sm text-muted-foreground">
              Last simulated: {new Date().toLocaleTimeString('en-IN')}
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      {simulated && (
        <>
          {/* Impact Summary */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white border border-border shadow-sm p-6">
              <div className="text-sm text-muted-foreground mb-2">High Risk Increase</div>
              <div className="text-3xl text-[#DC2626]">+184%</div>
              <div className="text-xs text-muted-foreground mt-2">190 → 540 borrowers</div>
            </div>
            <div className="bg-white border border-border shadow-sm p-6">
              <div className="text-sm text-muted-foreground mb-2">Avg. Stress Probability</div>
              <div className="text-3xl text-[#F59E0B]">32.1%</div>
              <div className="text-xs text-muted-foreground mt-2">+7.3 percentage points</div>
            </div>
            <div className="bg-white border border-border shadow-sm p-6">
              <div className="text-sm text-muted-foreground mb-2">Portfolio Resilience</div>
              <div className="text-3xl text-[#F59E0B]">62.3</div>
              <div className="text-xs text-muted-foreground mt-2">-6.2 points from baseline</div>
            </div>
            <div className="bg-white border border-border shadow-sm p-6">
              <div className="text-sm text-muted-foreground mb-2">Potential NPAs</div>
              <div className="text-3xl text-[#DC2626]">1,360</div>
              <div className="text-xs text-muted-foreground mt-2">21.3% of portfolio</div>
            </div>
          </div>

          {/* Distribution Chart */}
          <div className="bg-white border border-border shadow-sm p-6">
            <h3 className="mb-4">Stress Distribution: Before vs After</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={distribution}>
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
                <Bar dataKey="before" fill="#1E3A8A" radius={[4, 4, 0, 0]} name="Before" />
                <Bar dataKey="after" fill="#DC2626" radius={[4, 4, 0, 0]} name="After Simulation" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#1E3A8A]"></div>
                <span className="text-sm">Current Portfolio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#DC2626]"></div>
                <span className="text-sm">After Simulation</span>
              </div>
            </div>
          </div>

          {/* Sector Impact */}
          <div className="bg-white border border-border shadow-sm p-6">
            <h3 className="mb-4">Sector-Wise Impact Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-border">
                <div>
                  <div className="text-sm mb-1">Information Technology</div>
                  <div className="text-xs text-muted-foreground">1,245 borrowers</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#10B981]">Low Impact</div>
                  <div className="text-xs text-muted-foreground">+2.3% stress</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-border">
                <div>
                  <div className="text-sm mb-1">Manufacturing</div>
                  <div className="text-xs text-muted-foreground">892 borrowers</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#F59E0B]">Moderate Impact</div>
                  <div className="text-xs text-muted-foreground">+8.7% stress</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-border">
                <div>
                  <div className="text-sm mb-1">Services</div>
                  <div className="text-xs text-muted-foreground">1,567 borrowers</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#DC2626]">High Impact</div>
                  <div className="text-xs text-muted-foreground">+14.2% stress</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-border">
                <div>
                  <div className="text-sm mb-1">Retail & Hospitality</div>
                  <div className="text-xs text-muted-foreground">678 borrowers</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#DC2626]">Critical Impact</div>
                  <div className="text-xs text-muted-foreground">+18.9% stress</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-[#EFF6FF] border border-[#1E3A8A] p-6">
            <h3 className="mb-4">Policy Recommendations</h3>
            <div className="space-y-3">
              <div className="flex gap-3 text-sm">
                <div className="text-primary mt-1">1.</div>
                <div>
                  <strong>Proactive Restructuring:</strong> Initiate restructuring for 540 high-risk borrowers before stress materializes. 
                  Estimated cost savings: ₹12.5 Cr in potential NPAs.
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="text-primary mt-1">2.</div>
                <div>
                  <strong>Sector-Specific Measures:</strong> Implement targeted relief programs for Retail & Hospitality sector borrowers. 
                  Consider moratorium or interest waiver options.
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="text-primary mt-1">3.</div>
                <div>
                  <strong>Enhanced Monitoring:</strong> Increase surveillance frequency for 2,360 borrowers in medium-to-high risk categories. 
                  Deploy early warning system triggers.
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="text-primary mt-1">4.</div>
                <div>
                  <strong>Capital Provisioning:</strong> Increase provisioning by 1.8% of portfolio value to account for elevated risk levels 
                  under this scenario.
                </div>
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex gap-3">
            <button className="px-6 py-3 border border-border hover:bg-secondary transition-colors">
              Export Detailed Report
            </button>
            <button className="px-6 py-3 border border-border hover:bg-secondary transition-colors">
              Generate Risk Mitigation Plan
            </button>
            <button className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Submit to Risk Committee
            </button>
          </div>
        </>
      )}
    </div>
  );
}
