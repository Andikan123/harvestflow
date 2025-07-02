import React, { useEffect, useState } from "react";

const ArchivedReports = () => {
  const [archives, setArchives] = useState([]);

  useEffect(() => {
    const data = [];
    for (let key in localStorage) {
      if (key.startsWith("archive-")) {
        const month = key.replace("archive-", "");
        try {
          const archive = JSON.parse(localStorage.getItem(key));
          data.push({ month, ...archive });
        } catch (err) {
          console.error("Invalid archive data:", key);
        }
      }
    }

    // Sort by recent month
    data.sort((a, b) => (a.month < b.month ? 1 : -1));
    setArchives(data);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10 mt-18">
      <h2 className="text-4xl font-extrabold text-center text-blue-600 drop-shadow-sm">
        📦 Archived Monthly Reports
      </h2>

      {archives.length === 0 ? (
        <p className="text-center text-gray-400">No archived data found yet.</p>
      ) : (
        archives.map(({ month, totals, transactions }) => (
          <div
            key={month}
            className="bg-white rounded-xl shadow p-6 border border-gray-200 space-y-4"
          >
            <h3 className="text-2xl font-semibold text-blue-700">📅 {month}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded shadow">
                <p className="text-sm text-gray-600">Income</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${totals?.generalIncome?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded shadow">
                <p className="text-sm text-gray-600">Expenses</p>
                <p className="text-2xl font-bold text-red-500">
                  ${totals?.expenses?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded shadow">
                <p className="text-sm text-gray-600">Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totals?.saving?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Transactions:</h4>
              {transactions?.length > 0 ? (
                <ul className="divide-y text-sm text-gray-700">
                  {transactions.map((txn, i) => (
                    <li key={i} className="py-2 flex justify-between">
                      <span>
                        {txn.description || txn.source || txn.type} —{" "}
                        <span className="text-gray-400 text-xs">
                          {new Date(txn.date).toLocaleDateString()}
                        </span>
                      </span>
                      <span
                        className={`font-semibold ${
                          txn.type === "income"
                            ? "text-green-600"
                            : txn.type === "expense"
                            ? "text-red-500"
                            : "text-blue-600"
                        }`}
                      >
                        ${txn.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No transactions recorded</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ArchivedReports;
