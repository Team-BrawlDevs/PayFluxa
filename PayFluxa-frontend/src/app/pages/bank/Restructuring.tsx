import { useEffect, useState } from "react";
import { StatusChip } from "../../components/StatusChip";
import { ChevronRight } from "lucide-react";
import {
  getAllCases,
  getCaseDetails,
  approveCase,
  rejectCase,
} from "../../services/restructuringService";

export function Restructuring() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [comments, setComments] = useState("");

  /* ================= LOAD CASES ================= */

  useEffect(() => {
    const load = async () => {
      const data = await getAllCases();
      setCases(data);
    };
    load();
  }, []);

  /* ================= LOAD SINGLE CASE ================= */

  const handleReview = async (caseId: string) => {
    const data = await getCaseDetails(caseId);
    setSelectedCase(data);
  };

  /* ================= APPROVE ================= */

  const handleApprove = async () => {
    await approveCase(selectedCase.case_id, comments);
    const updated = await getAllCases();
    setCases(updated);
    setSelectedCase(null);
  };

  /* ================= REJECT ================= */

  const handleReject = async () => {
    await rejectCase(selectedCase.case_id, comments);
    const updated = await getAllCases();
    setCases(updated);
    setSelectedCase(null);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Restructuring Workflow</h2>

      {/* ================= TABLE ================= */}

      <div className="bg-white border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs">Case ID</th>
                <th className="px-6 py-3 text-left text-xs">Loan ID</th>
                <th className="px-6 py-3 text-right text-xs">Current EMI</th>
                <th className="px-6 py-3 text-right text-xs">
                  Recommended EMI
                </th>
                <th className="px-6 py-3 text-center text-xs">Status</th>
                <th className="px-6 py-3 text-center text-xs">Action</th>
              </tr>
            </thead>

            <tbody>
              {cases.map((c) => (
                <tr
                  key={c.case_id}
                  className="border-b border-border hover:bg-secondary/30"
                >
                  <td className="px-6 py-4 text-sm">{c.case_id}</td>
                  <td className="px-6 py-4 text-sm">{c.loan_id}</td>

                  <td className="px-6 py-4 text-sm text-right">
                    ₹{Number(c.current_emi).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4 text-sm text-right text-green-600">
                    ₹{Number(c.recommended_emi).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <StatusChip status={c.status.toLowerCase()}>
                      {c.status}
                    </StatusChip>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleReview(c.case_id)}
                      className="text-primary hover:underline flex items-center gap-1 mx-auto"
                    >
                      Review <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= SIDE PANEL ================= */}

      {selectedCase && (
        <>
          <div className="fixed right-0 top-0 bottom-0 w-[500px] bg-white shadow-lg p-6 overflow-auto z-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">{selectedCase.case_id}</h3>
              <button onClick={() => setSelectedCase(null)}>✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  Stress Probability
                </div>
                <div>
                  {selectedCase.stress_probability_before}% →{" "}
                  {selectedCase.stress_probability_after}%
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">
                  Buffer Months
                </div>
                <div>
                  {selectedCase.buffer_before} → {selectedCase.buffer_after}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">
                  Tenure Change
                </div>
                <div>
                  {selectedCase.current_tenure_months} →{" "}
                  {selectedCase.recommended_tenure_months}
                </div>
              </div>
            </div>

            {/* ================= APPROVAL ================= */}

            {selectedCase.status === "GENERATED" && (
              <div className="mt-6 space-y-3">
                <textarea
                  placeholder="Add comments..."
                  className="w-full border p-2"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleApprove}
                    className="flex-1 bg-green-600 text-white py-2"
                  >
                    Approve
                  </button>

                  <button
                    onClick={handleReject}
                    className="flex-1 bg-red-600 text-white py-2"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSelectedCase(null)}
          />
        </>
      )}
    </div>
  );
}
