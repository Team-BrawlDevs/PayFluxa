import { useEffect, useState } from "react";
import { getMyEmis } from "../../services/loanService";

export function EmiDetails() {

  const [emis, setEmis] = useState<any[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);

  useEffect(() => {
    fetchEmis();
  }, []);

  const fetchEmis = async () => {
    const data = await getMyEmis();
    setEmis(data);
  };

  const calculateProgress = (loan: any) => {
    const paid = loan.principal_amount - loan.outstanding_balance;
    return ((paid / loan.principal_amount) * 100).toFixed(1);
  };

  return (
    <div className="p-8">

      {/* LOAN CARDS */}
      {!selectedLoan && (
        <>
          <h2 className="text-2xl mb-8 text-primary">My Loans</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {emis.map((loan) => (
              <div
                key={loan.loan_id}
                onClick={() => setSelectedLoan(loan)}
                className="bg-white border border-border p-6 shadow-sm cursor-pointer hover:shadow-md transition"
              >

                <div className="text-sm text-muted-foreground">
                  Loan #{loan.loan_id}
                </div>

                <div className="text-xl font-semibold mt-1 mb-4">
                  ₹{loan.principal_amount}
                </div>

                <div className="text-sm text-muted-foreground">
                  EMI
                </div>

                <div className="text-lg text-green-700 font-semibold mb-4">
                  ₹{loan.emi_amount}
                </div>

                <div className="text-sm text-muted-foreground">
                  Outstanding
                </div>

                <div className="text-md">
                  ₹{loan.outstanding_balance}
                </div>

                <div className="mt-4 text-xs text-primary">
                  Click to view loan details →
                </div>

              </div>
            ))}

          </div>
        </>
      )}

      {/* FULL PAGE LOAN DETAILS */}
      {selectedLoan && (

        <div className="max-w-4xl mx-auto bg-white border border-border p-8 shadow-sm">

          <button
            onClick={() => setSelectedLoan(null)}
            className="text-primary text-sm mb-6"
          >
            ← Back to Loans
          </button>

          <h2 className="text-2xl mb-6">
            Loan #{selectedLoan.loan_id}
          </h2>

          {/* LOAN PROGRESS */}
          <div className="mb-8">

            <div className="flex justify-between mb-2 text-sm">
              <span>Loan Repayment Progress</span>
              <span>{calculateProgress(selectedLoan)}% Paid</span>
            </div>

            <div className="w-full bg-gray-200 h-3 rounded">

              <div
                className="h-3 rounded bg-green-600"
                style={{
                  width: `${calculateProgress(selectedLoan)}%`,
                }}
              ></div>

            </div>

          </div>

          {/* LOAN DETAILS GRID */}
          <div className="grid grid-cols-2 gap-8">

            <div>
              <div className="text-sm text-muted-foreground">
                Principal Amount
              </div>
              <div className="text-lg font-medium">
                ₹{selectedLoan.principal_amount}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                Interest Rate
              </div>
              <div className="text-lg font-medium">
                {selectedLoan.interest_rate}%
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                EMI Amount
              </div>
              <div className="text-lg text-green-700 font-semibold">
                ₹{selectedLoan.emi_amount}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                Tenure
              </div>
              <div className="text-lg">
                {selectedLoan.tenure_months} months
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                Outstanding Balance
              </div>
              <div className="text-lg">
                ₹{selectedLoan.outstanding_balance}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                Status
              </div>
              <div className="text-lg">
                {selectedLoan.status}
              </div>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}