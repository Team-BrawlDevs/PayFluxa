import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const incomeExpenseData = [
  { month: 'Jan', income: 85000, expense: 62000 },
  { month: 'Feb', income: 82000, expense: 61500 },
  { month: 'Mar', income: 88000, expense: 63000 },
  { month: 'Apr', income: 85000, expense: 62800 },
  { month: 'May', income: 79000, expense: 61200 },
  { month: 'Jun', income: 91000, expense: 64000 },
];

const surplusData = [
  { month: 'Jan', surplus: 23000 },
  { month: 'Feb', surplus: 20500 },
  { month: 'Mar', surplus: 25000 },
  { month: 'Apr', surplus: 22200 },
  { month: 'May', surplus: 17800 },
  { month: 'Jun', surplus: 27000 },
];

const transactions = [
  { date: '24 Feb 2026', type: 'Credit', category: 'Salary', amount: 85000, balance: 142000 },
  { date: '23 Feb 2026', type: 'Debit', category: 'EMI Payment', amount: -38250, balance: 57000 },
  { date: '22 Feb 2026', type: 'Debit', category: 'Utilities', amount: -4200, balance: 95250 },
  { date: '20 Feb 2026', type: 'Debit', category: 'Groceries', amount: -8500, balance: 99450 },
  { date: '18 Feb 2026', type: 'Debit', category: 'Insurance', amount: -5600, balance: 107950 },
  { date: '15 Feb 2026', type: 'Debit', category: 'Shopping', amount: -12300, balance: 113550 },
  { date: '12 Feb 2026', type: 'Credit', category: 'Interest', amount: 850, balance: 125850 },
  { date: '10 Feb 2026', type: 'Debit', category: 'Healthcare', amount: -3200, balance: 125000 },
];

export function FinancialTwin() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Financial Twin</h2>
        <p className="text-sm text-muted-foreground">Digital representation of your income, expenses, and transaction patterns</p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel - Metrics */}
        <div className="space-y-6">
          <div className="bg-white border border-border shadow-sm p-6">
            <h3 className="mb-4">Monthly Income Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-sm text-muted-foreground">Average Monthly Income</span>
                <span className="text-lg">₹85,000</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-sm text-muted-foreground">Income Volatility</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">12.3%</span>
                  <TrendingUp size={16} className="text-[#F59E0B]" />
                </div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-sm text-muted-foreground">EMI Burden Ratio</span>
                <span className="text-lg text-[#F59E0B]">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Buffer Strength</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-[#10B981]">3.2 months</span>
                  <TrendingDown size={16} className="text-[#DC2626]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Income vs Expense Chart */}
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">Income vs Expense Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={incomeExpenseData}>
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
              <Bar dataKey="income" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1E3A8A]"></div>
              <span className="text-sm">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#F59E0B]"></div>
              <span className="text-sm">Expense</span>
            </div>
          </div>
        </div>
      </div>

      {/* Surplus Trend */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-4">Monthly Surplus Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={surplusData}>
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
              dataKey="surplus" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction Table */}
      <div className="bg-white border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h3>Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">Date</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">Type</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">Category</th>
                <th className="px-6 py-3 text-right text-xs text-muted-foreground">Amount (₹)</th>
                <th className="px-6 py-3 text-right text-xs text-muted-foreground">Balance (₹)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index} className="border-b border-border hover:bg-secondary/30">
                  <td className="px-6 py-4 text-sm">{txn.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs border ${
                      txn.type === 'Credit' 
                        ? 'bg-[#D1FAE5] text-[#065F46] border-[#10B981]'
                        : 'bg-[#FEE2E2] text-[#991B1B] border-[#DC2626]'
                    }`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{txn.category}</td>
                  <td className={`px-6 py-4 text-sm text-right ${txn.amount > 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                    {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">{txn.balance.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
