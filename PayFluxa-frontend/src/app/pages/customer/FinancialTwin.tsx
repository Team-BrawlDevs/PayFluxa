import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

/* ================= TYPES ================= */

interface FinancialSummary {
  average_monthly_income: number;
  income_volatility_percent: number;
  emi_burden_ratio_percent: number;
  buffer_strength_months: number;
}

interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  surplus: number;
}

interface TransactionItem {
  date: string;
  type: "Credit" | "Debit";
  category: string;
  amount: number;
  balance: number;
}

interface FinancialResponse {
  summary: FinancialSummary;
  monthly_trend: MonthlyTrend[];
  transactions: TransactionItem[];
}

/* ================= COMPONENT ================= */

export function FinancialTwin() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");

      const response = await axios.get<FinancialResponse>(
        "http://127.0.0.1:8000/analytics/financial-twin/monthly-summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSummary(response.data.summary);
      setMonthlyTrend(response.data.monthly_trend);
      setTransactions(response.data.transactions || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading financial twin...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Financial Twin</h2>
        <p className="text-sm text-muted-foreground">
          Digital representation of your income, expenses, and transaction
          patterns
        </p>
      </div>

      {/* Summary + Chart */}
      <div className="grid grid-cols-2 gap-6">
        {/* Metrics */}
        <div className="space-y-6">
          <div className="bg-white border border-border shadow-sm p-6">
            <h3 className="mb-4">Monthly Income Summary</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Average Monthly Income
                </span>
                <span className="text-lg">
                  ₹{summary?.average_monthly_income.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Income Volatility
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {summary?.income_volatility_percent}%
                  </span>
                  <TrendingUp size={16} className="text-[#F59E0B]" />
                </div>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  EMI Burden Ratio
                </span>
                <span className="text-lg text-[#F59E0B]">
                  {summary?.emi_burden_ratio_percent}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Buffer Strength
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-[#10B981]">
                    {summary?.buffer_strength_months} months
                  </span>
                  <TrendingDown size={16} className="text-[#DC2626]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Income vs Expense Chart */}
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">Income vs Expense Trend</h3>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="income" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1E3A8A]" />
              <span className="text-sm">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#F59E0B]" />
              <span className="text-sm">Expense</span>
            </div>
          </div>
        </div>
      </div>

      {/* Surplus Trend */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-4">Monthly Surplus Trend</h3>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="surplus"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions */}
      <div className="bg-white border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h3>Recent Transactions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs text-muted-foreground">
                  Amount (₹)
                </th>
                <th className="px-6 py-3 text-right text-xs text-muted-foreground">
                  Balance (₹)
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((txn, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-secondary/30"
                >
                  <td className="px-6 py-4 text-sm">{txn.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs border ${
                        txn.type === "Credit"
                          ? "bg-[#D1FAE5] text-[#065F46] border-[#10B981]"
                          : "bg-[#FEE2E2] text-[#991B1B] border-[#DC2626]"
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{txn.category}</td>
                  <td
                    className={`px-6 py-4 text-sm text-right ${
                      txn.amount > 0 ? "text-[#10B981]" : "text-[#DC2626]"
                    }`}
                  >
                    {txn.amount > 0 ? "+" : ""}
                    {txn.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    {txn.balance.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
