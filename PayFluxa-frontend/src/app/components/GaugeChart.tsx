interface GaugeChartProps {
  value: number;
  max?: number;
  label: string;
}

export function GaugeChart({ value, max = 100, label }: GaugeChartProps) {
  const percentage = (value / max) * 100;
  const rotation = (percentage / 100) * 180 - 90;
  
  const getColor = () => {
    if (percentage >= 70) return '#10B981';
    if (percentage >= 40) return '#F59E0B';
    return '#DC2626';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-16 mb-2">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 126} 126`}
          />
          {/* Needle */}
          <line
            x1="50"
            y1="45"
            x2="50"
            y2="10"
            stroke={getColor()}
            strokeWidth="2"
            transform={`rotate(${rotation} 50 45)`}
          />
          <circle cx="50" cy="45" r="3" fill={getColor()} />
        </svg>
      </div>
      <div className="text-2xl mb-1">{value}</div>
      <div className="text-xs text-muted-foreground text-center">{label}</div>
    </div>
  );
}
