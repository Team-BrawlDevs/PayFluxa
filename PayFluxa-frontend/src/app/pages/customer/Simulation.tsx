import { useState } from "react";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

export function Simulation() {
  const [loanAmount, setLoanAmount] = useState('2000000');
  const [tenure, setTenure] = useState('240');
  const [interestRate, setInterestRate] = useState('8.5');
  const [incomeDrop, setIncomeDrop] = useState(0);
  const [shockEvent, setShockEvent] = useState(false);
  const [simulated, setSimulated] = useState(false);

  const handleSimulation = () => {
    setSimulated(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Loan Simulation</h2>
        <p className="text-sm text-muted-foreground">Test hypothetical loan scenarios and assess impact on financial resilience</p>
      </div>

      {/* Input Section */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-6">Simulation Parameters</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">Hypothetical Loan Amount (₹)</label>
            <input
              type="text"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full px-4 py-2 border border-border bg-input-background"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Tenure (months)</label>
            <select
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full px-4 py-2 border border-border bg-input-background"
            >
              <option value="120">10 Years (120 months)</option>
              <option value="180">15 Years (180 months)</option>
              <option value="240">20 Years (240 months)</option>
              <option value="300">25 Years (300 months)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">Interest Rate (%)</label>
            <input
              type="text"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full px-4 py-2 border border-border bg-input-background"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Income Drop Scenario (%)</label>
            <input
              type="range"
              min="0"
              max="50"
              value={incomeDrop}
              onChange={(e) => setIncomeDrop(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground mt-1">{incomeDrop}% reduction</div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            id="shock"
            checked={shockEvent}
            onChange={(e) => setShockEvent(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="shock" className="text-sm">Include unexpected expense shock event (₹50,000)</label>
        </div>
        <div className="mt-6">
          <button
            onClick={handleSimulation}
            className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Run Simulation
          </button>
        </div>
      </div>

      {/* Results Section */}
      {simulated && (
        <div className="grid grid-cols-2 gap-6">
          {/* Current State */}
          <div className="bg-white border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>Current State</h3>
              <div className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] border border-[#10B981] text-xs">
                BASELINE
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Stress Probability</div>
                <div className="text-3xl mb-2">23.5%</div>
                <div className="w-full bg-secondary h-2">
                  <div className="bg-[#10B981] h-2" style={{ width: '23.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Survivability Period</div>
                <div className="text-3xl">3.2 months</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">EMI Burden</div>
                <div className="text-3xl">45%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Resilience Score</div>
                <div className="text-3xl text-[#10B981]">72</div>
              </div>
            </div>
          </div>

          {/* After Simulation */}
          <div className="bg-white border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>After Simulation</h3>
              <div className="px-3 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B] text-xs">
                PROJECTED
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Stress Probability</div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">38.2%</div>
                  <div className="flex items-center gap-1 text-[#DC2626] text-sm">
                    <TrendingUp size={16} />
                    +14.7%
                  </div>
                </div>
                <div className="w-full bg-secondary h-2">
                  <div className="bg-[#F59E0B] h-2" style={{ width: '38.2%' }}></div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Survivability Period</div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">2.1 months</div>
                  <div className="flex items-center gap-1 text-[#DC2626] text-sm">
                    <TrendingDown size={16} />
                    -34%
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">EMI Burden</div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl text-[#DC2626]">62%</div>
                  <div className="flex items-center gap-1 text-[#DC2626] text-sm">
                    <TrendingUp size={16} />
                    +17%
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Resilience Score</div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl text-[#F59E0B]">54</div>
                  <div className="flex items-center gap-1 text-[#DC2626] text-sm">
                    <TrendingDown size={16} />
                    -25%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Impact Summary */}
      {simulated && (
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">Impact Assessment</h3>
          <div className="space-y-3">
            <div className="p-4 bg-[#FEF3C7] border-l-4 border-[#F59E0B]">
              <div className="font-medium text-sm mb-1">Moderate Risk Increase</div>
              <div className="text-sm text-muted-foreground">
                The proposed loan would increase your stress probability by 14.7 percentage points. Consider reducing loan amount or extending tenure.
              </div>
            </div>
            <div className="p-4 bg-[#FEE2E2] border-l-4 border-[#DC2626]">
              <div className="font-medium text-sm mb-1">Buffer Reduction Warning</div>
              <div className="text-sm text-muted-foreground">
                Your financial buffer would drop from 3.2 to 2.1 months, reducing your ability to handle unexpected expenses.
              </div>
            </div>
            <div className="p-4 bg-[#E0E7FF] border-l-4 border-[#1E3A8A]">
              <div className="font-medium text-sm mb-1">Recommendation</div>
              <div className="text-sm text-muted-foreground">
                Consider increasing down payment by ₹500,000 to maintain healthier financial resilience metrics.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
