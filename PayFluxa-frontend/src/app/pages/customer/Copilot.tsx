import { useState } from "react";
import { Send } from "lucide-react";
import { askCopilot } from "../../services/copilotService";

interface CopilotResponse {
  analysis: string;
  risk_summary: {
    health_score: number;
    risk_level: string;
    survival_probability: number;
  };
  warnings: string[];
  recommendations: string[];
}

export function Copilot() {
  const [question, setQuestion] = useState("");
  const [data, setData] = useState<CopilotResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await askCopilot(question);
      setData(response);
      setQuestion("");
    } catch (err) {
      console.error("Copilot error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1">Financial Copilot</h2>
        <p className="text-sm text-muted-foreground">
          AI-powered advisory for loan decisions and financial planning
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT PANEL — CURRENT SCENARIO */}
        {/* <div className="bg-white border border-border shadow-sm p-6">
          <h3 className="mb-4">Current Scenario</h3>
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Loan Amount
              </div>
              <div>₹20,00,000</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Tenure</div>
              <div>20 years</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Interest Rate
              </div>
              <div>8.5% p.a.</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Monthly Income
              </div>
              <div>₹85,000</div>
            </div>
          </div>
        </div> */}

        {/* RIGHT PANEL — AI RESPONSE */}
        <div
          className="col-span-5 bg-white border border-border shadow-sm flex flex-col"
          style={{ height: "600px" }}
        >
          <div className="p-6 border-b border-border">
            <h3>Advisory Response</h3>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-6">
            {loading && <p>Generating advisory...</p>}

            {data && (
              <>
                {/* Advisory Analysis */}
                <div className="bg-secondary p-4">
                  <div className="text-xs text-muted-foreground mb-2">
                    Advisory Analysis
                  </div>
                  <div className="text-sm whitespace-pre-line">
                    {data.analysis}
                  </div>
                </div>

                {/* Risk Summary */}
                <div className="border border-border p-4">
                  <div className="text-xs text-muted-foreground mb-3">
                    Risk Impact Summary
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Health Score</span>
                      <span>{data.risk_summary.health_score}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Risk Level</span>
                      <span
                        className={
                          data.risk_summary.risk_level === "HIGH"
                            ? "text-red-500"
                            : data.risk_summary.risk_level === "MEDIUM"
                              ? "text-yellow-500"
                              : "text-green-600"
                        }
                      >
                        {data.risk_summary.risk_level}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Survival Probability</span>
                      <span>
                        {(data.risk_summary.survival_probability * 100).toFixed(
                          1,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {data.recommendations.length > 0 && (
                  <div className="bg-[#EFF6FF] border border-[#1E3A8A] p-4">
                    <div className="text-xs text-primary mb-3">
                      Recommended Actions
                    </div>

                    <div className="space-y-3 text-sm">
                      {data.recommendations.map((rec, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="text-primary mt-1">{index + 1}.</div>
                          <div>{rec}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {data.warnings.length > 0 && (
                  <div className="bg-red-50 border border-red-300 p-4 text-sm text-red-600">
                    <strong>Warnings:</strong>
                    <ul className="list-disc ml-5 mt-2">
                      {data.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="border border-border bg-secondary/30 p-4">
                  <div className="text-xs mb-2">Regulatory Disclaimer</div>
                  <div className="text-xs text-muted-foreground">
                    This advisory is AI-generated and does not constitute
                    financial advice. Please consult a certified financial
                    advisor before making decisions.
                  </div>
                </div>
              </>
            )}
          </div>

          {/* INPUT SECTION */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="flex-1 px-4 py-2 border border-border bg-input-background"
              />
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
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
