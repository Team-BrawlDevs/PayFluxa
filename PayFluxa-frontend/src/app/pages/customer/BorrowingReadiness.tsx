import { useEffect, useState } from "react";
import { getBorrowingReadiness } from "../../services/borrowService";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export function BorrowingReadiness() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await getBorrowingReadiness();
      setData(res);
    };
    load();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Borrowing Readiness Assessment</h2>
        <p className="text-sm text-muted-foreground">
          Personalized guidance on safe borrowing capacity and requirements
        </p>
      </div>

      {/* Overall Score */}

      <div className="bg-white border border-border shadow-sm p-8 text-center">
        <div className="text-sm text-muted-foreground mb-2">
          Borrowing Readiness Score
        </div>

        <div className="text-6xl mb-4 text-[#F59E0B]">
          {Math.round(data.readiness_score)}/100
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]">
          <AlertCircle size={16} />
          <span className="text-sm">MODERATE - Proceed with Caution</span>
        </div>
      </div>

      {/* EMI SECTION */}

      <div className="grid grid-cols-2 gap-6">
        {/* Current EMI */}

        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-6">Safe EMI Range</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Current EMI
                </span>

                <span className="text-sm">
                  ₹{data.current_emi.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="w-full bg-secondary h-3">
                <div
                  className="bg-[#F59E0B] h-3"
                  style={{ width: `${data.emi_ratio || 45}%` }}
                />
              </div>

              <div className="text-xs text-muted-foreground mt-1">
                {data.emi_ratio?.toFixed(1)}% of monthly income
              </div>
            </div>

            {/* Recommended EMI */}

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Recommended Maximum EMI
                </span>

                <span className="text-sm text-[#10B981]">
                  ₹{data.recommended_max_emi.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="w-full bg-secondary h-3">
                <div className="bg-[#10B981] h-3" style={{ width: "50%" }} />
              </div>

              <div className="text-xs text-muted-foreground mt-1">
                50% of monthly income (RBI guideline)
              </div>
            </div>

            {/* Available EMI */}

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Available EMI Capacity</span>

                <span className="text-sm text-primary">
                  ₹{data.available_capacity.toLocaleString("en-IN")} /month
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BUFFER */}

        <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-6">Financial Buffer Requirements</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Current Buffer
                </span>

                <span className="text-sm">
                  ₹{data.buffer_amount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="w-full bg-secondary h-3">
                <div
                  className="bg-[#F59E0B] h-3"
                  style={{
                    width: `${(data.buffer_months / 5) * 100}%`,
                  }}
                />
              </div>

              <div className="text-xs text-muted-foreground mt-1">
                {data.buffer_months.toFixed(1)} months of expenses
              </div>
            </div>

            {/* Recommended */}

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Recommended Buffer
                </span>

                <span className="text-sm text-[#10B981]">
                  ₹{data.recommended_buffer.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="w-full bg-secondary h-3">
                <div className="bg-[#10B981] h-3" style={{ width: "100%" }} />
              </div>

              <div className="text-xs text-muted-foreground mt-1">
                5 months of expenses
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOAN RECOMMENDATION */}

      <div className="bg-white border border-border shadow-sm p-6">
        <h3 className="mb-6">Recommended Loan Size</h3>

        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-6 border border-border">
            <CheckCircle2 size={32} className="mx-auto text-[#10B981]" />

            <div className="text-sm text-muted-foreground mb-2">
              Conservative
            </div>

            <div className="text-2xl mb-2">
              ₹{data.loan_recommendations.conservative.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="text-center p-6 border-2 border-primary bg-[#EFF6FF]">
            <AlertCircle size={32} className="mx-auto text-[#F59E0B]" />

            <div className="text-sm text-muted-foreground mb-2">Moderate</div>

            <div className="text-2xl mb-2">
              ₹{data.loan_recommendations.moderate.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="text-center p-6 border border-border">
            <XCircle size={32} className="mx-auto text-[#DC2626]" />

            <div className="text-sm text-muted-foreground mb-2">Aggressive</div>

            <div className="text-2xl mb-2">
              ₹{data.loan_recommendations.aggressive.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
