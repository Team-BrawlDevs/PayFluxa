import { Search, Download, Filter } from "lucide-react";

const logs = [
  { id: 1, user: 'Rajesh Kumar', role: 'Risk Manager', action: 'Approved Restructuring', entity: 'RST-2026-1236', timestamp: '27 Feb 2026, 14:23:45', details: 'Approved ₹52,100 → ₹41,200 EMI restructuring for CIF234567892' },
  { id: 2, user: 'Priya Sharma', role: 'Senior Analyst', action: 'Generated Simulation', entity: 'SIM-2026-5678', timestamp: '27 Feb 2026, 13:15:22', details: 'Portfolio-wide policy simulation: Repo rate 6.5% → 7.0%' },
  { id: 3, user: 'Amit Verma', role: 'Credit Officer', action: 'Rejected Restructuring', entity: 'RST-2026-1237', timestamp: '27 Feb 2026, 12:08:11', details: 'Rejected restructuring case - insufficient income stability' },
  { id: 4, user: 'Sneha Reddy', role: 'Risk Analyst', action: 'Viewed Borrower Profile', entity: 'CIF234567890', timestamp: '27 Feb 2026, 11:42:33', details: 'Accessed detailed risk profile for Amit Kumar' },
  { id: 5, user: 'Vikram Singh', role: 'Senior Manager', action: 'Modified Risk Parameters', entity: 'CONFIG-RISK-001', timestamp: '27 Feb 2026, 10:18:56', details: 'Updated buffer threshold from 3 to 5 months' },
  { id: 6, user: 'System', role: 'Automated Process', action: 'Generated Alert', entity: 'ALERT-2026-8923', timestamp: '27 Feb 2026, 09:00:00', details: 'High risk alert for 142 borrowers - buffer below threshold' },
  { id: 7, user: 'Ananya Patel', role: 'Compliance Officer', action: 'Exported Report', entity: 'REPORT-Q4-2025', timestamp: '27 Feb 2026, 08:35:17', details: 'Downloaded quarterly compliance report (PDF, 2.3 MB)' },
  { id: 8, user: 'Rajesh Kumar', role: 'Risk Manager', action: 'Initiated Review', entity: 'CIF234567891', timestamp: '26 Feb 2026, 16:45:28', details: 'Started credit review process for Priya Sharma' },
  { id: 9, user: 'Priya Sharma', role: 'Senior Analyst', action: 'Updated Borrower Data', entity: 'CIF234567894', timestamp: '26 Feb 2026, 15:22:09', details: 'Updated income information - monthly income: ₹85,000' },
  { id: 10, user: 'System', role: 'Automated Process', action: 'Calculated Resilience', entity: 'BATCH-2026-02-26', timestamp: '26 Feb 2026, 14:00:00', details: 'Batch resilience score calculation for 6,500 borrowers' },
  { id: 11, user: 'Amit Verma', role: 'Credit Officer', action: 'Approved Loan', entity: 'LOAN-2026-4521', timestamp: '26 Feb 2026, 13:12:44', details: 'Approved vehicle loan for ₹8,00,000 at 9.5% interest' },
  { id: 12, user: 'Vikram Singh', role: 'Senior Manager', action: 'Reviewed Dashboard', entity: 'DASHBOARD-PORTFOLIO', timestamp: '26 Feb 2026, 11:38:21', details: 'Accessed portfolio risk dashboard' },
  { id: 13, user: 'Sneha Reddy', role: 'Risk Analyst', action: 'Generated Restructuring', entity: 'RST-2026-1234', timestamp: '26 Feb 2026, 10:15:33', details: 'Generated restructuring recommendation for CIF234567890' },
  { id: 14, user: 'System', role: 'Automated Process', action: 'Sent Notification', entity: 'NOTIF-2026-7845', timestamp: '26 Feb 2026, 09:30:00', details: 'EMI payment reminder sent to 3,200 customers' },
  { id: 15, user: 'Ananya Patel', role: 'Compliance Officer', action: 'Accessed Audit Logs', entity: 'AUDIT-LOG-VIEW', timestamp: '25 Feb 2026, 17:05:19', details: 'Reviewed audit logs for compliance check' },
];

export function AuditLogs() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1">Audit Logs</h2>
          <p className="text-sm text-muted-foreground">Comprehensive activity tracking for compliance and security monitoring</p>
        </div>
        <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors flex items-center gap-2">
          <Download size={16} />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-border shadow-sm p-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-2 border border-border bg-input-background"
            />
          </div>
          <select className="px-4 py-2 border border-border bg-input-background">
            <option>All Roles</option>
            <option>Risk Manager</option>
            <option>Senior Analyst</option>
            <option>Credit Officer</option>
            <option>Risk Analyst</option>
            <option>Compliance Officer</option>
            <option>Automated Process</option>
          </select>
          <select className="px-4 py-2 border border-border bg-input-background">
            <option>All Actions</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Generated</option>
            <option>Viewed</option>
            <option>Modified</option>
            <option>Exported</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-border bg-input-background"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">User</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">Role</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">Action Type</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">Entity</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-secondary/30">
                  <td className="px-6 py-4 text-sm whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm">{log.user}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex px-2 py-1 text-xs bg-secondary border border-border">
                      {log.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs border ${
                      log.action.includes('Approved') ? 'bg-[#D1FAE5] text-[#065F46] border-[#10B981]' :
                      log.action.includes('Rejected') ? 'bg-[#FEE2E2] text-[#991B1B] border-[#DC2626]' :
                      log.action.includes('Generated') || log.action.includes('Calculated') ? 'bg-[#E0E7FF] text-[#3730A3] border-[#6366F1]' :
                      log.action.includes('Modified') || log.action.includes('Updated') ? 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]' :
                      'bg-secondary text-secondary-foreground border-border'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">{log.entity}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 1-15 of 1,247 entries
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 text-sm bg-primary text-primary-foreground">1</button>
          <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">2</button>
          <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">3</button>
          <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">...</button>
          <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">84</button>
          <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="bg-secondary border border-border p-6">
        <div className="flex items-start gap-3">
          <Filter size={20} className="text-muted-foreground mt-1" />
          <div>
            <div className="text-sm mb-2">Compliance & Retention Policy</div>
            <div className="text-sm text-muted-foreground">
              All audit logs are retained for 7 years in compliance with RBI guidelines. Logs are encrypted at rest and access is 
              monitored. Unauthorized access attempts are automatically flagged and reported to the compliance team. For detailed 
              audit reports or historical data access beyond 90 days, please contact the Compliance Officer.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
