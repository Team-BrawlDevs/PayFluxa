import { Send } from "lucide-react";

export function Copilot() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Financial Copilot</h2>
        <p className="text-sm text-muted-foreground">AI-powered advisory for loan decisions and financial planning</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Scenario Configuration */}
        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">Current Scenario</h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Loan Amount</div>
              <div className="text-sm">₹20,00,000</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Tenure</div>
              <div className="text-sm">20 years</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Interest Rate</div>
              <div className="text-sm">8.5% p.a.</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Monthly Income</div>
              <div className="text-sm">₹85,000</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Current EMI Burden</div>
              <div className="text-sm text-[#F59E0B]">45%</div>
            </div>
          </div>
        </div>

        {/* Advisory Interface */}
        <div className="col-span-2 bg-white border border-border shadow-sm flex flex-col" style={{ height: '600px' }}>
          <div className="p-6 border-b border-border">
            <h3>Advisory Response</h3>
          </div>
          
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Advisory Response */}
            <div className="bg-secondary p-4">
              <div className="text-xs text-muted-foreground mb-2">Advisory Analysis</div>
              <div className="text-sm space-y-2">
                <p>Based on your current financial profile and the proposed loan parameters, I have conducted a comprehensive stress analysis.</p>
                <p>The simulation indicates that taking this loan would increase your EMI burden from 45% to approximately 62%, which exceeds the recommended threshold of 50%.</p>
              </div>
            </div>

            {/* Risk Delta Summary */}
            <div className="border border-border p-4">
              <div className="text-xs text-muted-foreground mb-3">Risk Impact Summary</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm">Stress Probability</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">23.5%</span>
                    <span className="text-sm">→</span>
                    <span className="text-sm text-[#DC2626]">38.2%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm">Resilience Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">72</span>
                    <span className="text-sm">→</span>
                    <span className="text-sm text-[#F59E0B]">54</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Buffer Strength</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">3.2 months</span>
                    <span className="text-sm">→</span>
                    <span className="text-sm text-[#DC2626]">2.1 months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-[#EFF6FF] border border-[#1E3A8A] p-4">
              <div className="text-xs text-primary mb-3">Recommended Actions</div>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="text-primary mt-1">1.</div>
                  <div>
                    <strong>Reduce Loan Amount:</strong> Consider reducing the loan to ₹15,00,000. This would keep your EMI burden at 52%, closer to the acceptable threshold.
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-primary mt-1">2.</div>
                  <div>
                    <strong>Increase Down Payment:</strong> An additional ₹5,00,000 down payment would improve your risk profile significantly.
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-primary mt-1">3.</div>
                  <div>
                    <strong>Build Buffer First:</strong> Wait 6 months to accumulate an additional buffer of ₹1,50,000 before proceeding with the loan.
                  </div>
                </div>
              </div>
            </div>

            {/* Regulatory Disclaimer */}
            <div className="border border-border bg-secondary/30 p-4">
              <div className="text-xs mb-2">Regulatory Disclaimer</div>
              <div className="text-xs text-muted-foreground">
                This advisory is generated based on algorithmic analysis and historical data patterns. It does not constitute financial advice. 
                All lending decisions are subject to bank's credit policy and RBI guidelines. The stress probability and resilience metrics 
                are indicative and may vary based on actual economic conditions. Please consult with a certified financial advisor before 
                making any borrowing decisions.
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a follow-up question..."
                className="flex-1 px-4 py-2 border border-border bg-input-background"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2">
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
