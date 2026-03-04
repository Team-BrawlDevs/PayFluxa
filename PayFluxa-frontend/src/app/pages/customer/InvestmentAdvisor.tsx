import { useEffect, useState } from "react";
import { getInvestmentAdvisor } from "../../services/investment";
import { AlertTriangle, CheckCircle, Shield, IndianRupee } from "lucide-react";

interface Analysis {
  monthly_income: number;
  monthly_expenses: number;
  emi: number;
  monthly_surplus: number;
  liquidity_buffer_months: number;
  debt_service_ratio: number;
  stress_probability: number;
  account_balance: number;
}

interface AdvisorResponse {
  advisory_decision: "ALLOW" | "CAUTION" | "BLOCK";
  recommended_investment: number;
  policy: string;
  analysis: Analysis;
  risk_flags: string[];
}

export default function InvestmentAdvisor() {
  const [data, setData] = useState<AdvisorResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdvisor();
  }, []);

  const loadAdvisor = async () => {
    try {
      const res = await getInvestmentAdvisor();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading Investment Advisor...</div>;
  if (!data) return <div className="p-6 text-red-500">Failed to load data</div>;

  const decisionColor =
    data.advisory_decision === "ALLOW"
      ? "text-green-600"
      : data.advisory_decision === "CAUTION"
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-semibold">Investment Advisor</h1>
        <p className="text-gray-500">AI-powered investment decision engine</p>
      </div>

      {/* Top Cards */}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Shield size={18} />
            Advisory Decision
          </div>

          <div className={`text-3xl font-bold ${decisionColor}`}>
            {data.advisory_decision}
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <IndianRupee size={18} />
            Recommended Investment
          </div>

          <div className="text-3xl font-bold text-indigo-600">
            ₹ {data.recommended_investment.toLocaleString()}
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <div className="text-gray-500 mb-2">Policy</div>

          <div className="font-semibold">{data.policy}</div>
        </div>
      </div>

      {/* Financial Analysis */}

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Financial Analysis</h2>

        <div className="grid md:grid-cols-4 gap-6">
          <Metric title="Monthly Income" value={data.analysis.monthly_income} />
          <Metric
            title="Monthly Expenses"
            value={data.analysis.monthly_expenses}
          />
          <Metric title="EMI" value={data.analysis.emi} />
          <Metric
            title="Monthly Surplus"
            value={data.analysis.monthly_surplus}
          />
          <Metric
            title="Liquidity Buffer"
            value={data.analysis.liquidity_buffer_months}
          />
          <Metric
            title="Debt Service Ratio"
            value={data.analysis.debt_service_ratio}
          />
          <Metric
            title="Stress Probability"
            value={`${data.analysis.stress_probability}%`}
          />
          <Metric
            title="Account Balance"
            value={data.analysis.account_balance}
          />
        </div>
      </div>

      {/* Risk Flags */}

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Risk Indicators</h2>

        {data.risk_flags.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={18} />
            No financial risks detected
          </div>
        ) : (
          <div className="space-y-2">
            {data.risk_flags.map((flag, index) => (
              <div key={index} className="flex items-center gap-2 text-red-500">
                <AlertTriangle size={16} />
                {flag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ title, value }: any) {
  const formatted =
    typeof value === "number" ? `₹ ${value.toLocaleString()}` : value;

  return (
    <div className="border rounded-lg p-4">
      <div className="text-gray-500 text-sm">{title}</div>

      <div className="text-lg font-semibold">{formatted}</div>
    </div>
  );
}
