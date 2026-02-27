import { AlertTriangle, TrendingDown, Info, XCircle, Bell } from "lucide-react";

const alerts = [
  {
    id: 1,
    severity: 'high',
    icon: AlertTriangle,
    title: 'Critical: Low Financial Buffer',
    description: 'Your financial buffer has dropped to 3.2 months, below the recommended 5 months. This significantly reduces your ability to handle unexpected expenses or income disruptions.',
    time: '2 hours ago',
    date: '27 Feb 2026, 10:30 AM',
    category: 'Buffer Management'
  },
  {
    id: 2,
    severity: 'high',
    icon: TrendingDown,
    title: 'High Income Volatility Detected',
    description: 'Your income has fluctuated by 18% over the past 3 months (Jan: ₹85,000, Feb: ₹79,000, Mar: ₹88,000). This volatility increases your financial stress probability.',
    time: '1 day ago',
    date: '26 Feb 2026, 2:15 PM',
    category: 'Income Analysis'
  },
  {
    id: 3,
    severity: 'medium',
    icon: Info,
    title: 'EMI Burden Above Optimal Level',
    description: 'Your current EMI burden is at 45% of monthly income. While within acceptable limits, this is approaching the 50% regulatory threshold. Consider this before taking additional loans.',
    time: '2 days ago',
    date: '25 Feb 2026, 9:00 AM',
    category: 'EMI Management'
  },
  {
    id: 4,
    severity: 'medium',
    icon: TrendingDown,
    title: 'Resilience Score Decline',
    description: 'Your Financial Resilience Score has decreased from 78 to 72 over the past quarter. This trend indicates increasing financial stress risk.',
    time: '3 days ago',
    date: '24 Feb 2026, 11:45 AM',
    category: 'Resilience Monitoring'
  },
  {
    id: 5,
    severity: 'low',
    icon: Info,
    title: 'Upcoming EMI Payment',
    description: 'Your home loan EMI of ₹38,250 is scheduled for payment on 1st March 2026. Please ensure sufficient balance in your account.',
    time: '4 days ago',
    date: '23 Feb 2026, 8:00 AM',
    category: 'Payment Reminder'
  },
  {
    id: 6,
    severity: 'low',
    icon: Bell,
    title: 'Quarterly Review Available',
    description: 'Your Q4 2025-26 financial health report is now available. Review your performance and get personalized recommendations.',
    time: '5 days ago',
    date: '22 Feb 2026, 3:30 PM',
    category: 'Reports'
  },
  {
    id: 7,
    severity: 'high',
    icon: XCircle,
    title: 'Stress Event Probability Increase',
    description: 'Based on current trends, your probability of experiencing financial stress in the next 6 months has increased to 23.5%. Consider building additional buffer.',
    time: '1 week ago',
    date: '20 Feb 2026, 10:00 AM',
    category: 'Risk Assessment'
  },
  {
    id: 8,
    severity: 'medium',
    icon: AlertTriangle,
    title: 'Expense Pattern Change',
    description: 'Your monthly expenses have increased by 8% compared to previous quarter average. Review discretionary spending to maintain financial stability.',
    time: '1 week ago',
    date: '19 Feb 2026, 4:20 PM',
    category: 'Expense Monitoring'
  },
];

export function Alerts() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1">Financial Alerts</h2>
          <p className="text-sm text-muted-foreground">Real-time notifications about your financial health and risk indicators</p>
        </div>
        <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">
          Mark All as Read
        </button>
      </div>

      {/* Alert Filters */}
      <div className="flex gap-3">
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground">All Alerts</button>
        <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">High Priority</button>
        <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">Medium Priority</button>
        <button className="px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors">Low Priority</button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          const severityStyles = {
            high: {
              bg: 'bg-[#FEE2E2]',
              border: 'border-[#DC2626]',
              text: 'text-[#DC2626]',
              leftBorder: 'bg-[#DC2626]'
            },
            medium: {
              bg: 'bg-[#FEF3C7]',
              border: 'border-[#F59E0B]',
              text: 'text-[#F59E0B]',
              leftBorder: 'bg-[#F59E0B]'
            },
            low: {
              bg: 'bg-[#EFF6FF]',
              border: 'border-[#1E3A8A]',
              text: 'text-[#1E3A8A]',
              leftBorder: 'bg-[#1E3A8A]'
            }
          };

          const styles = severityStyles[alert.severity as keyof typeof severityStyles];

          return (
            <div key={alert.id} className="bg-white border border-border shadow-sm relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.leftBorder}`}></div>
              <div className="p-6 pl-8">
                <div className="flex items-start gap-4">
                  <div className={`${styles.text} mt-1`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium mb-1">{alert.title}</div>
                        <div className="text-sm text-muted-foreground">{alert.description}</div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xs text-muted-foreground mb-1">{alert.time}</div>
                        <div className="text-xs text-muted-foreground">{alert.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex px-2 py-1 text-xs border ${styles.bg} ${styles.text} ${styles.border}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">{alert.category}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs px-3 py-1 border border-border hover:bg-secondary transition-colors">
                          Dismiss
                        </button>
                        <button className="text-xs px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                          View Details
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
