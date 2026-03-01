import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { runSimulation } from "../../services/simulationService";

export function Simulation() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loanAmount, setLoanAmount] = useState("2000000");
  const [tenure, setTenure] = useState("240");
  const [interestRate, setInterestRate] = useState("8.5");
  const [incomeDrop, setIncomeDrop] = useState(0);
  const [shockEvent, setShockEvent] = useState(false);
  const [simulated, setSimulated] = useState(false);

  const handleSimulation = async () => {
    setLoading(true);

    try {
      const data = await runSimulation({
        loan_amount: Number(loanAmount),
        tenure_months: Number(tenure),
        interest_rate: Number(interestRate),
        income_drop_percent: incomeDrop,
        include_shock: shockEvent,
      });

      setResult(data);
      setSimulated(true);
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Loan Simulation</h2>
        <p className="text-sm text-muted-foreground">
          Test hypothetical loan scenarios and assess impact on financial
          resilience
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-6">Simulation Parameters</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">
              Hypothetical Loan Amount (₹)
            </label>
            <input
              type="text"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full px-4 py-2 border border-border"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Tenure (months)</label>
            <select
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full px-4 py-2 border border-border"
            >
              <option value="120">10 Years</option>
              <option value="180">15 Years</option>
              <option value="240">20 Years</option>
              <option value="300">25 Years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Interest Rate (%)</label>
            <input
              type="text"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full px-4 py-2 border border-border"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Income Drop Scenario (%)
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={incomeDrop}
              onChange={(e) => setIncomeDrop(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground mt-1">
              {incomeDrop}% reduction
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={shockEvent}
            onChange={(e) => setShockEvent(e.target.checked)}
          />
          <label className="text-sm">
            Include unexpected expense shock event (₹50,000)
          </label>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSimulation}
            disabled={loading}
            className="px-8 py-3 bg-primary text-white"
          >
            {loading ? "Running..." : "Run Simulation"}
          </button>
        </div>
      </div>

      {/* Results */}
      {simulated && result && (
        <>
          <div className="grid grid-cols-2 gap-6">
            {/* Current */}
            <div className="bg-white border shadow-sm p-6">
              <h3 className="mb-6">Current State</h3>

              <Metric
                label="Stress Probability"
                value={result.current_state.stress_probability}
              />
              <Metric
                label="Survivability Period"
                value={result.current_state.buffer_months}
                suffix=" months"
              />
              <Metric
                label="EMI Burden"
                value={result.current_state.emi_burden_percent}
              />
              <Metric
                label="Resilience Score"
                value={result.current_state.resilience_score}
              />
            </div>

            {/* Projected */}
            <div className="bg-white border shadow-sm p-6">
              <h3 className="mb-6">After Simulation</h3>

              <Metric
                label="Stress Probability"
                value={result.projected_state.stress_probability}
                delta={result.impact_metrics.stress_change}
              />
              <Metric
                label="Survivability Period"
                value={result.projected_state.buffer_months}
                delta={result.impact_metrics.buffer_change}
                suffix=" months"
              />
              <Metric
                label="EMI Burden"
                value={result.projected_state.emi_burden_percent}
              />
              <Metric
                label="Resilience Score"
                value={result.projected_state.resilience_score}
              />
            </div>
          </div>

          {/* Impact */}
          <div className="bg-white border shadow-sm p-6">
            <h3 className="mb-4">Impact Assessment</h3>

            <div className="font-medium mb-2">
              {result.impact_metrics.risk_impact_level}
            </div>

            <div className="text-sm text-muted-foreground">
              {result.recommendation}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* Reusable Metric Component */
function Metric({
  label,
  value,
  delta,
  suffix = "%",
}: {
  label: string;
  value: number;
  delta?: number;
  suffix?: string;
}) {
  return (
    <div className="mb-6">
      <div className="text-sm text-muted-foreground mb-2">{label}</div>

      <div className="flex items-center gap-3 mb-2">
        <div className="text-2xl">
          {value}
          {suffix}
        </div>

        {delta !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm ${
              delta > 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {delta > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {delta > 0 ? "+" : ""}
            {delta}
            {suffix}
          </div>
        )}
      </div>

      <div className="w-full bg-gray-200 h-2 rounded">
        <div
          className="bg-primary h-2 rounded"
          style={{ width: `${Math.min(value, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
