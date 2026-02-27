import { useNavigate } from "react-router";
import { User, Building2, ArrowRight } from "lucide-react";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4 text-primary">PayFluxa</h1>
          <p className="text-lg text-muted-foreground">Enterprise Financial Resilience Platform</p>
          <p className="text-sm text-muted-foreground mt-2">RBI-Compliant Risk Governance System</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Customer Portal */}
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="bg-white border border-border shadow-sm p-8 hover:shadow-md hover:border-primary transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-[#EFF6FF] flex items-center justify-center">
                <User size={32} className="text-primary" />
              </div>
              <ArrowRight size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="mb-3">Customer Portal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Access your Financial Resilience Dashboard, run loan simulations, and get personalized borrowing recommendations
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• Financial Twin Analytics</div>
              <div>• Loan Simulation Tools</div>
              <div>• AI-Powered Copilot</div>
              <div>• Real-time Risk Alerts</div>
            </div>
          </button>

          {/* Bank Console */}
          <button
            onClick={() => navigate('/bank/portfolio')}
            className="bg-white border border-border shadow-sm p-8 hover:shadow-md hover:border-primary transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-[#EFF6FF] flex items-center justify-center">
                <Building2 size={32} className="text-primary" />
              </div>
              <ArrowRight size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="mb-3">Risk Governance Console</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enterprise-grade portfolio risk management, restructuring workflows, and policy simulation tools
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• Portfolio Risk Dashboard</div>
              <div>• Borrower Risk Profiles</div>
              <div>• Restructuring Workflow</div>
              <div>• Policy Simulation & Audit</div>
            </div>
          </button>
        </div>

        <div className="mt-12 p-6 bg-white border border-border text-center">
          <div className="text-xs text-muted-foreground mb-2">REGULATORY COMPLIANCE</div>
          <p className="text-sm text-muted-foreground">
            This system is designed in accordance with RBI guidelines for risk management and financial resilience assessment. 
            All data is encrypted and compliant with banking security standards.
          </p>
        </div>
      </div>
    </div>
  );
}
