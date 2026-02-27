interface StatusChipProps {
  status: 'generated' | 'under-review' | 'approved' | 'rejected' | 'low' | 'medium' | 'high' | 'critical';
  children: React.ReactNode;
}

export function StatusChip({ status, children }: StatusChipProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'approved':
        return 'bg-[#D1FAE5] text-[#065F46] border-[#10B981]';
      case 'rejected':
        return 'bg-[#FEE2E2] text-[#991B1B] border-[#DC2626]';
      case 'under-review':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]';
      case 'generated':
        return 'bg-[#E0E7FF] text-[#3730A3] border-[#6366F1]';
      case 'low':
        return 'bg-[#D1FAE5] text-[#065F46] border-[#10B981]';
      case 'medium':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]';
      case 'high':
      case 'critical':
        return 'bg-[#FEE2E2] text-[#991B1B] border-[#DC2626]';
      default:
        return 'bg-secondary text-secondary-foreground border-border';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs border ${getStatusStyles()}`}>
      {children}
    </span>
  );
}
