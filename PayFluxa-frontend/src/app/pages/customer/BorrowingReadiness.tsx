import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export function BorrowingReadiness() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Borrowing Readiness Assessment</h2>
        <p className="text-sm text-muted-foreground">Personalized guidance on safe borrowing capacity and requirements</p>
      </div>

      {/* Overall Readiness Score */}
      <div className="bg-white border border-border shadow-sm p-8 text-center">
        <div className="text-sm text-muted-foreground mb-2">Borrowing Readiness Score</div>
        <div className="text-6xl mb-4 text-[#F59E0B]">68/100</div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]">
          <AlertCircle size={16} />
          <span className="text-sm">MODERATE - Proceed with Caution</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-6">
        {/* Safe EMI Range */}
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-6">Safe EMI Range</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Current EMI</span>
                <span className="text-sm">₹38,250</span>
              </div>
              <div className="w-full bg-secondary h-3">
                <div className="bg-[#F59E0B] h-3" style={{ width: '45%' }}></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">45% of monthly income</div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Recommended Maximum EMI</span>
                <span className="text-sm text-[#10B981]">₹42,500</span>
              </div>
              <div className="w-full bg-secondary h-3">
                <div className="bg-[#10B981] h-3" style={{ width: '50%' }}></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">50% of monthly income (RBI guideline)</div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Available EMI Capacity</span>
                <span className="text-sm text-primary">₹4,250 /month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Required Buffer */}
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-6">Financial Buffer Requirements</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Current Buffer</span>
                <span className="text-sm">₹2,72,000</span>
              </div>
              <div className="w-full bg-secondary h-3">
                <div className="bg-[#F59E0B] h-3" style={{ width: '64%' }}></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">3.2 months of expenses</div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Recommended Buffer</span>
                <span className="text-sm text-[#10B981]">₹4,25,000</span>
              </div>
              <div className="w-full bg-secondary h-3">
                <div className="bg-[#10B981] h-3" style={{ width: '100%' }}></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">5 months of expenses (Regulatory standard)</div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Additional Buffer Needed</span>
                <span className="text-sm text-[#DC2626]">₹1,53,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Loan Size */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-6">Recommended Loan Size</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-6 border border-border">
            <div className="text-[#10B981] mb-3">
              <CheckCircle2 size={32} className="mx-auto" />
            </div>
            <div className="text-sm text-muted-foreground mb-2">Conservative</div>
            <div className="text-2xl mb-2">₹12 L</div>
            <div className="text-xs text-muted-foreground">Low risk, maintains healthy buffer</div>
          </div>
          <div className="text-center p-6 border-2 border-primary bg-[#EFF6FF]">
            <div className="text-[#F59E0B] mb-3">
              <AlertCircle size={32} className="mx-auto" />
            </div>
            <div className="text-sm text-muted-foreground mb-2">Moderate</div>
            <div className="text-2xl mb-2">₹15 L</div>
            <div className="text-xs text-muted-foreground">Balanced approach, acceptable risk</div>
          </div>
          <div className="text-center p-6 border border-border">
            <div className="text-[#DC2626] mb-3">
              <XCircle size={32} className="mx-auto" />
            </div>
            <div className="text-sm text-muted-foreground mb-2">Aggressive</div>
            <div className="text-2xl mb-2">₹20 L</div>
            <div className="text-xs text-muted-foreground">High risk, requires close monitoring</div>
          </div>
        </div>
      </div>

      {/* Risk Band Analysis */}
      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-6">Risk Band Assessment</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-[#D1FAE5] border-l-4 border-[#10B981]">
            <CheckCircle2 size={20} className="text-[#10B981] mt-1" />
            <div className="flex-1">
              <div className="font-medium text-sm mb-1">Income Stability: Strong</div>
              <div className="text-sm text-muted-foreground">Consistent income with low volatility (12.3%) over past 12 months</div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-[#FEF3C7] border-l-4 border-[#F59E0B]">
            <AlertCircle size={20} className="text-[#F59E0B] mt-1" />
            <div className="flex-1">
              <div className="font-medium text-sm mb-1">EMI Burden: Moderate Risk</div>
              <div className="text-sm text-muted-foreground">Current EMI burden at 45% is approaching the 50% threshold. Limited room for additional loans.</div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-[#FEF3C7] border-l-4 border-[#F59E0B]">
            <AlertCircle size={20} className="text-[#F59E0B] mt-1" />
            <div className="flex-1">
              <div className="font-medium text-sm mb-1">Financial Buffer: Below Recommended</div>
              <div className="text-sm text-muted-foreground">Current buffer of 3.2 months is below the recommended 5 months. Consider building reserves before new loans.</div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-[#D1FAE5] border-l-4 border-[#10B981]">
            <CheckCircle2 size={20} className="text-[#10B981] mt-1" />
            <div className="flex-1">
              <div className="font-medium text-sm mb-1">Credit History: Excellent</div>
              <div className="text-sm text-muted-foreground">No defaults or delayed payments in the last 36 months</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-[#EFF6FF] border border-[#1E3A8A] p-6">
        <h3 className="mb-4">Recommended Actions Before Borrowing</h3>
        <div className="space-y-3">
          <div className="flex gap-3 text-sm">
            <div className="text-primary mt-1">1.</div>
            <div>Build additional emergency buffer of ₹1,53,000 (approximately 6 months of savings at current rate)</div>
          </div>
          <div className="flex gap-3 text-sm">
            <div className="text-primary mt-1">2.</div>
            <div>Review and optimize existing EMI obligations - consider prepayment of high-interest loans</div>
          </div>
          <div className="flex gap-3 text-sm">
            <div className="text-primary mt-1">3.</div>
            <div>Target loan amount between ₹12-15 lakhs to maintain safe EMI burden ratio</div>
          </div>
          <div className="flex gap-3 text-sm">
            <div className="text-primary mt-1">4.</div>
            <div>Consider longer tenure (25 years) to reduce monthly EMI if purchasing essential asset</div>
          </div>
        </div>
      </div>
    </div>
  );
}
