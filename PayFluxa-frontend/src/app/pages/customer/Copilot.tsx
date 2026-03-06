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
            Ask questions about loans, investments, spending habits, or
            financial planning.
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
              <div className="space-y-5">
                {/* AI SHORT MESSAGE */}
                <div className="bg-secondary px-4 py-3 text-sm rounded">
                  {m.text}
                </div>

                {/* RISK SUMMARY CARDS */}
                {m.data?.risk_summary && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border border-border p-4 rounded text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        Health Score
                      </div>
                      <div className="text-2xl font-semibold">
                        {m.data.risk_summary.health_score}
                      </div>
                    </div>

                    <div className="border border-border p-4 rounded text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        Risk Level
                      </div>
                      <div
                        className={`text-xl font-semibold ${
                          m.data.risk_summary.risk_level === "HIGH"
                            ? "text-red-500"
                            : m.data.risk_summary.risk_level === "MEDIUM"
                              ? "text-yellow-500"
                              : "text-green-600"
                        }`}
                      >
                        {m.data.risk_summary.risk_level}
                      </div>
                    </div>

                    <div className="border border-border p-4 rounded text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        Survival Probability
                      </div>
                      <div className="text-2xl font-semibold">
                        {(
                          m.data.risk_summary.survival_probability * 100
                        ).toFixed(0)}
                        %
                      </div>
                    </div>
                  </div>
                )}

                {/* FINANCIAL HEALTH BAR */}
                {m.data?.risk_summary && (
                  <div className="border border-border p-4 rounded">
                    <div className="text-xs text-muted-foreground mb-2">
                      Financial Health
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className="bg-green-500 h-2 rounded"
                        style={{
                          width: `${m.data.risk_summary.health_score}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* RECOMMENDATIONS */}
                {m.data?.recommendations?.length ? (
                  <div className="grid gap-3">
                    <div className="text-xs text-primary">
                      Recommended Actions
                    </div>

                    {m.data.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="border border-blue-200 bg-blue-50 p-3 rounded text-sm"
                      >
                        💡 {rec}
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* WARNINGS */}
                {m.data?.warnings?.length ? (
                  <div className="border border-red-300 bg-red-50 p-4 rounded">
                    <div className="text-red-600 font-semibold mb-2">
                      ⚠ Financial Risks
                    </div>

                    <ul className="space-y-1 text-sm text-red-600">
                      {m.data.warnings.map((w, i) => (
                        <li key={i}>• {w}</li>
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
