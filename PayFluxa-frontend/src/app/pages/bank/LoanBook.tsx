import { useEffect, useState } from "react";
import { getLoanBook } from "../../services/loanService";
import { TrendingUp, Calendar, Wallet } from "lucide-react";

export function LoanBook() {

  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    const data = await getLoanBook();
    setLoans(data);
    setLoading(false);
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl text-primary mb-1">Loan Book</h2>
          <p className="text-sm text-muted-foreground">
            Overview of all customer loans in the portfolio
          </p>
        </div>
      </div>


      {loading && (
        <div className="text-muted-foreground">Loading loans...</div>
      )}

      {/* Loan Grid */}

      <div className="grid grid-cols-3 gap-6">

        {loans.map((loan) => {

          const totalPaid =
            loan.principal_amount - loan.outstanding_balance;

          const percentPaid =
            (totalPaid / loan.principal_amount) * 100;

          return (

            <div
              key={loan.id}
              className="bg-white border border-border shadow-sm p-6 hover:shadow-md transition-shadow"
            >

              {/* Top Section */}

              <div className="flex justify-between items-start mb-4">

                <div>
                  <div className="text-xs text-muted-foreground">
                    Loan ID
                  </div>
                  <div className="font-mono text-sm">
                    #{loan.id}
                  </div>
                </div>

                <span
                  className={`text-xs px-2 py-1 border ${
                    loan.status === "ACTIVE"
                      ? "bg-green-50 text-green-700 border-green-300"
                      : "bg-gray-100 border-border"
                  }`}
                >
                  {loan.status}
                </span>

              </div>


              {/* Loan Details */}

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Wallet size={14} />
                    Principal
                  </span>
                  <span className="font-medium">
                    ₹{loan.principal_amount}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <TrendingUp size={14} />
                    Interest
                  </span>
                  <span>{loan.interest_rate}%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar size={14} />
                    EMI
                  </span>
                  <span className="font-semibold text-green-700">
                    ₹{loan.emi_amount}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Outstanding
                  </span>
                  <span className="font-medium">
                    ₹{loan.outstanding_balance}
                  </span>
                </div>

              </div>


              {/* Progress Section */}

              <div className="mt-5">

                <div className="flex justify-between text-xs mb-1">
                  <span>Repayment Progress</span>
                  <span>{percentPaid.toFixed(1)}%</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded">

                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{ width: `${percentPaid}%` }}
                  />

                </div>

                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Paid ₹{totalPaid}</span>
                  <span>Total ₹{loan.principal_amount}</span>
                </div>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}