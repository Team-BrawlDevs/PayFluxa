import { useEffect, useState } from "react";
import { AlertTriangle, TrendingDown, Info } from "lucide-react";
import {
  getAlerts,
  dismissAlert,
  markAlertRead,
} from "../../services/alertService";

type Severity = "high" | "medium" | "low";

interface Alert {
  id: number;
  title: string;
  description: string;
  category: string;
  severity: Severity;
  created_at: string;
  is_read: boolean;
}

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const loadAlerts = async () => {
      const data = await getAlerts();
      setAlerts(data);
    };

    loadAlerts();
  }, []);

  const getIcon = (severity: Severity) => {
    if (severity === "high") return AlertTriangle;
    if (severity === "medium") return TrendingDown;
    return Info;
  };

  const severityStyles: Record<Severity, any> = {
    high: {
      bg: "bg-[#FEE2E2]",
      border: "border-[#DC2626]",
      text: "text-[#DC2626]",
      leftBorder: "bg-[#DC2626]",
    },
    medium: {
      bg: "bg-[#FEF3C7]",
      border: "border-[#F59E0B]",
      text: "text-[#F59E0B]",
      leftBorder: "bg-[#F59E0B]",
    },
    low: {
      bg: "bg-[#EFF6FF]",
      border: "border-[#1E3A8A]",
      text: "text-[#1E3A8A]",
      leftBorder: "bg-[#1E3A8A]",
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1">Financial Alerts</h2>
          <p className="text-sm text-muted-foreground">
            Real-time notifications about your financial health and risk
            indicators
          </p>
        </div>

        <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">
          Mark All as Read
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = getIcon(alert.severity);
          const styles = severityStyles[alert.severity];
          const time = new Date(alert.created_at).toLocaleString();

          return (
            <div
              key={alert.id}
              className="bg-white border border-border shadow-sm relative overflow-hidden"
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${styles.leftBorder}`}
              ></div>

              <div className="p-6 pl-8">
                <div className="flex items-start gap-4">
                  <div className={`${styles.text} mt-1`}>
                    <Icon size={24} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div
                          className={`mb-1 ${
                            !alert.is_read ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {alert.title}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {alert.description}
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="text-xs text-muted-foreground">
                          {time}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs border ${styles.bg} ${styles.text} ${styles.border}`}
                        >
                          {alert.severity.toUpperCase()}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {alert.category}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await dismissAlert(alert.id);
                            setAlerts(alerts.filter((a) => a.id !== alert.id));
                          }}
                          className="text-xs px-3 py-1 border border-border hover:bg-secondary transition-colors"
                        >
                          Dismiss
                        </button>

                        <button
                          onClick={async () => {
                            await markAlertRead(alert.id);

                            setAlerts((prev) =>
                              prev.map((a) =>
                                a.id === alert.id ? { ...a, is_read: true } : a,
                              ),
                            );
                          }}
                          className="text-xs px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Mark Read
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
