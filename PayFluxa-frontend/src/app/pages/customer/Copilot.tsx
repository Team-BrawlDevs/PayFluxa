import { useState } from "react";
import { Send } from "lucide-react";
import { askCopilot } from "../../services/copilotService";

interface CopilotResponse {
  message: string;
  analysis?: string;
  risk_summary?: {
    health_score: number;
    risk_level: string;
    survival_probability: number;
  };
  warnings?: string[];
  recommendations?: string[];
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  data?: CopilotResponse;
}

export function Copilot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: question,
    };

    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setQuestion("");
    setLoading(true);

    try {
      const history = updatedMessages
        .filter((m) => m.role === "assistant")
        .map((m, i) => ({
          question: updatedMessages[i * 2]?.text,
          answer: m.text,
        }));

      const res: CopilotResponse = await askCopilot(question, history);

      const aiMsg: ChatMessage = {
        role: "assistant",
        text: res.message,
        data: res,
      };

      setMessages([...updatedMessages, aiMsg]);
    } catch (err) {
      console.error("Copilot error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] bg-white border border-border shadow-sm">

      {/* HEADER */}

      <div className="p-6 border-b border-border">
        <h2 className="text-xl mb-1">Financial Copilot</h2>
        <p className="text-sm text-muted-foreground">
          AI-powered financial and investment advisor
        </p>
      </div>


      {/* CHAT AREA */}

      <div className="flex-1 overflow-auto p-6 space-y-6">

        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground">
            Ask questions about loans, investments, spending habits, or financial planning.
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className="space-y-3">

            {/* USER MESSAGE */}

            {m.role === "user" && (
              <div className="flex justify-end">
                <div className="bg-primary text-white px-4 py-2 max-w-xl">
                  {m.text}
                </div>
              </div>
            )}

            {/* AI MESSAGE */}

            {m.role === "assistant" && (
              <div className="space-y-4 max-w-xl">

                {/* AI CHAT BUBBLE */}

                <div className="bg-secondary px-4 py-3 text-sm">
                  {m.text}
                </div>


                {/* ANALYSIS */}

                {m.data?.analysis && (
                  <div className="border border-border p-4">
                    <div className="text-xs text-muted-foreground mb-2">
                      Financial Analysis
                    </div>
                    <div className="text-sm whitespace-pre-line">
                      {m.data.analysis}
                    </div>
                  </div>
                )}


                {/* RISK SUMMARY */}

                {m.data?.risk_summary && (
                  <div className="border border-border p-4">

                    <div className="text-xs text-muted-foreground mb-3">
                      Risk Impact Summary
                    </div>

                    <div className="space-y-2 text-sm">

                      <div className="flex justify-between">
                        <span>Health Score</span>
                        <span>{m.data.risk_summary.health_score}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Risk Level</span>
                        <span
                          className={
                            m.data.risk_summary.risk_level === "HIGH"
                              ? "text-red-500"
                              : m.data.risk_summary.risk_level === "MEDIUM"
                              ? "text-yellow-500"
                              : "text-green-600"
                          }
                        >
                          {m.data.risk_summary.risk_level}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Survival Probability</span>
                        <span>
                          {(m.data.risk_summary.survival_probability * 100).toFixed(1)}%
                        </span>
                      </div>

                    </div>
                  </div>
                )}


                {/* RECOMMENDATIONS */}

                {m.data?.recommendations?.length ? (
                  <div className="bg-[#EFF6FF] border border-[#1E3A8A] p-4">

                    <div className="text-xs text-primary mb-3">
                      Recommended Actions
                    </div>

                    <div className="space-y-2 text-sm">

                      {m.data.recommendations.map((rec, index) => (
                        <div key={index} className="flex gap-2">
                          <span className="text-primary">{index + 1}.</span>
                          <span>{rec}</span>
                        </div>
                      ))}

                    </div>

                  </div>
                ) : null}


                {/* WARNINGS */}

                {m.data?.warnings?.length ? (
                  <div className="bg-red-50 border border-red-300 p-4 text-sm text-red-600">

                    <strong>Warnings</strong>

                    <ul className="list-disc ml-5 mt-2">

                      {m.data.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}

                    </ul>

                  </div>
                ) : null}

              </div>
            )}

          </div>
        ))}

        {loading && (
          <div className="text-sm text-muted-foreground">
            Financial Copilot is analysing your financial data...
          </div>
        )}

      </div>


      {/* INPUT */}

      <div className="p-4 border-t border-border">

        <div className="flex gap-2">

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about loans, investments, spending..."
            className="flex-1 px-4 py-2 border border-border bg-input-background"
          />

          <button
            onClick={handleSend}
            className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
          >
            <Send size={16} />
            Send
          </button>

        </div>

      </div>

    </div>
  );
}