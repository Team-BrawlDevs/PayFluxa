interface KPICardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  children?: React.ReactNode;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  children,
}: KPICardProps) {
  return (
    <div className="bg-white border border-border shadow-sm p-4">
      <div className="text-sm text-muted-foreground mb-2">{title}</div>
      {children ? (
        children
      ) : (
        <>
          <div className="text-2xl mb-1">{value}</div>
          {subtitle && (
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          )}
          {trend && (
            <div
              className={`text-xs mt-2 ${trend.positive ? "text-[#10B981]" : "text-[#DC2626]"}`}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </div>
          )}
        </>
      )}
    </div>
  );
}
