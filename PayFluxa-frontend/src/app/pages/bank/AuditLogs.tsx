import { Search, Download, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuditLogs } from "../../services/adminService";

export function AuditLogs() {

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
  try {
    const data = await getAuditLogs();

    // show only admin logs
    const adminLogs = data.filter((log: any) => log.role === "admin");

    setLogs(adminLogs);

  } catch (err) {
    console.error("Failed to fetch audit logs", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1">Audit Logs</h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive activity tracking for compliance and security monitoring
          </p>
        </div>

        <button className="px-4 py-2 text-sm border border-border hover:bg-secondary flex items-center gap-2">
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
            <option>Admin</option>
            <option>Customer</option>
          </select>

          <select className="px-4 py-2 border border-border bg-input-background">
            <option>All Actions</option>
            <option>ACCOUNT_CREATED</option>
            <option>DEPOSIT</option>
            <option>WITHDRAW</option>
            <option>LOAN_RESTRUCTURE_GENERATED</option>
            <option>LOAN_RESTRUCTURE_APPROVED</option>
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

              {loading && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-muted-foreground">
                    Loading logs...
                  </td>
                </tr>
              )}

              {!loading && logs.map((log) => (

                <tr key={log.id} className="border-b border-border hover:bg-secondary/30">

                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {log.user_id}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex px-2 py-1 text-xs bg-secondary border border-border">
                      {log.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm">

                    <span
                      className={`inline-flex px-2 py-1 text-xs border ${
                        log.action_type.includes("APPROVED")
                          ? "bg-[#D1FAE5] text-[#065F46] border-[#10B981]"
                          : log.action_type.includes("REJECTED")
                          ? "bg-[#FEE2E2] text-[#991B1B] border-[#DC2626]"
                          : log.action_type.includes("GENERATED")
                          ? "bg-[#E0E7FF] text-[#3730A3] border-[#6366F1]"
                          : log.action_type.includes("DEPOSIT")
                          ? "bg-[#DCFCE7] text-[#166534] border-[#22C55E]"
                          : log.action_type.includes("WITHDRAW")
                          ? "bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]"
                          : "bg-secondary border-border"
                      }`}
                    >
                      {log.action_type}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-sm font-mono">
                    {log.entity_type} #{log.entity_id ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-md">
                    {log.details}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </div>

      {/* Compliance Notice */}

      <div className="bg-secondary border border-border p-6">

        <div className="flex items-start gap-3">

          <Filter size={20} className="text-muted-foreground mt-1" />

          <div>
            <div className="text-sm mb-2">Compliance & Retention Policy</div>

            <div className="text-sm text-muted-foreground">
              All audit logs are retained for 7 years in compliance with RBI
              guidelines. Logs are encrypted at rest and access is monitored.
              Unauthorized access attempts are automatically flagged and
              reported to the compliance team.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}