import { useState } from "react";
import { StatusChip } from "../../components/StatusChip";
import { Search, Filter, ChevronRight } from "lucide-react";

const cases = [
  { id: 'RST-2026-1234', borrower: 'Amit Kumar', cif: 'CIF234567890', currentEMI: 38250, recommendedEMI: 28500, tenure: '240→300 months', status: 'generated', riskBefore: 'Medium', riskAfter: 'Low', date: '27 Feb 2026' },
  { id: 'RST-2026-1235', borrower: 'Priya Sharma', cif: 'CIF234567891', currentEMI: 45200, recommendedEMI: 35800, tenure: '180→240 months', status: 'under-review', riskBefore: 'High', riskAfter: 'Medium', date: '26 Feb 2026' },
  { id: 'RST-2026-1236', borrower: 'Rajesh Patel', cif: 'CIF234567892', currentEMI: 52100, recommendedEMI: 41200, tenure: '120→180 months', status: 'approved', riskBefore: 'High', riskAfter: 'Medium', date: '25 Feb 2026' },
  { id: 'RST-2026-1237', borrower: 'Sneha Reddy', cif: 'CIF234567893', currentEMI: 31500, recommendedEMI: 25600, tenure: '240→300 months', status: 'rejected', riskBefore: 'Medium', riskAfter: 'Low', date: '24 Feb 2026' },
  { id: 'RST-2026-1238', borrower: 'Vikram Singh', cif: 'CIF234567894', currentEMI: 48700, recommendedEMI: 38900, tenure: '180→240 months', status: 'under-review', riskBefore: 'High', riskAfter: 'Medium', date: '23 Feb 2026' },
];

export function Restructuring() {
  const [selectedCase, setSelectedCase] = useState<typeof cases[0] | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1">Restructuring Workflow</h2>
          <p className="text-sm text-muted-foreground">Review and approve loan restructuring recommendations</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
          <button className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Generate Batch Report
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-border shadow-sm p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Borrower Name, CIF, or Case ID..."
              className="w-full pl-10 pr-4 py-2 border border-border bg-input-background"
            />
          </div>
          <select className="px-4 py-2 border border-border bg-input-background">
            <option>All Statuses</option>
            <option>Generated</option>
            <option>Under Review</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">Case ID</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">Borrower</th>
                <th className="px-6 py-3 text-right text-xs text-muted-foreground">Current EMI</th>
                <th className="px-6 py-3 text-right text-xs text-muted-foreground">Recommended EMI</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground">Tenure Change</th>
                <th className="px-6 py-3 text-center text-xs text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-center text-xs text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => (
                <tr key={caseItem.id} className="border-b border-border hover:bg-secondary/30">
                  <td className="px-6 py-4 text-sm">{caseItem.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{caseItem.borrower}</div>
                    <div className="text-xs text-muted-foreground">{caseItem.cif}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">₹{caseItem.currentEMI.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-right text-[#10B981]">₹{caseItem.recommendedEMI.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm">{caseItem.tenure}</td>
                  <td className="px-6 py-4 text-center">
                    <StatusChip status={caseItem.status as any}>{caseItem.status.toUpperCase().replace('-', ' ')}</StatusChip>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedCase(caseItem)}
                      className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto"
                    >
                      Review
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel */}
      {selectedCase && (
        <div className="fixed right-0 top-0 bottom-0 w-[500px] bg-white border-l border-border shadow-lg overflow-auto z-50">
          <div className="sticky top-0 bg-white border-b border-border p-6 z-10">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="mb-1">Restructuring Details</h3>
                <p className="text-sm text-muted-foreground">{selectedCase.id}</p>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Borrower Info */}
            <div>
              <div className="text-xs text-muted-foreground mb-2">BORROWER INFORMATION</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Name</span>
                  <span>{selectedCase.borrower}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CIF</span>
                  <span>{selectedCase.cif}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Generated Date</span>
                  <span>{selectedCase.date}</span>
                </div>
              </div>
            </div>

            {/* Current vs Proposed */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-border">
                <div className="text-xs text-muted-foreground mb-3">CURRENT</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-muted-foreground">EMI</div>
                    <div className="text-lg">₹{selectedCase.currentEMI.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Risk</div>
                    <div className="text-sm">{selectedCase.riskBefore}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-border bg-[#EFF6FF]">
                <div className="text-xs text-muted-foreground mb-3">PROPOSED</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-muted-foreground">EMI</div>
                    <div className="text-lg text-[#10B981]">₹{selectedCase.recommendedEMI.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Risk</div>
                    <div className="text-sm">{selectedCase.riskAfter}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Results */}
            <div>
              <div className="text-xs text-muted-foreground mb-3">SIMULATION RESULTS</div>
              <div className="space-y-3">
                <div className="flex justify-between pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">EMI Reduction</span>
                  <span className="text-sm text-[#10B981]">-25.5%</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Stress Probability</span>
                  <span className="text-sm">23.5% → 14.2%</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Resilience Score</span>
                  <span className="text-sm">72 → 81</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Buffer Strength</span>
                  <span className="text-sm">3.2 → 5.1 months</span>
                </div>
              </div>
            </div>

            {/* Impact Analysis */}
            <div className="p-4 bg-secondary">
              <div className="text-xs text-muted-foreground mb-2">IMPACT ANALYSIS</div>
              <div className="text-sm space-y-2">
                <p>Extending tenure from 240 to 300 months reduces monthly burden significantly.</p>
                <p>Additional interest cost: ₹2,45,000 over loan lifetime.</p>
                <p>Risk reduction justifies extended tenure given borrower's profile.</p>
              </div>
            </div>

            {/* Approval Actions */}
            {selectedCase.status === 'generated' || selectedCase.status === 'under-review' ? (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground mb-2">APPROVAL ACTIONS</div>
                <textarea
                  placeholder="Add comments or notes..."
                  rows={3}
                  className="w-full px-4 py-2 border border-border bg-input-background text-sm"
                ></textarea>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-3 bg-[#10B981] text-white hover:bg-[#059669] transition-colors">
                    Approve
                  </button>
                  <button className="flex-1 px-4 py-3 bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors">
                    Reject
                  </button>
                </div>
                <button className="w-full px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">
                  Request More Information
                </button>
              </div>
            ) : (
              <div className="p-4 border border-border">
                <div className="text-xs text-muted-foreground mb-2">STATUS</div>
                <StatusChip status={selectedCase.status as any}>
                  {selectedCase.status.toUpperCase().replace('-', ' ')}
                </StatusChip>
                <div className="text-sm text-muted-foreground mt-2">
                  This case has been {selectedCase.status} and no further action is required.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {selectedCase && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setSelectedCase(null)}
        ></div>
      )}
    </div>
  );
}
