import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Report = () => {
  const totals = useSelector((state) => state.totals);
  const [transactions, setTransactions] = useState([]);
  const needs = useSelector(state => state.needs);


  const totalNeedExpenses = needs
  .filter(need => need.met)
  .reduce((sum, need) => sum + need.amount, 0);

const unpaidDebt = totals.debt?.reduce((sum, d) => sum + d.amount, 0) || 0;

const expenses = (totals.expenses || 0) + totalNeedExpenses + unpaidDebt;





  const statusFlags = totals.statusFlags || {};

  useEffect(() => {
    const allTransactions = JSON.parse(localStorage.getItem("transactions")) || [];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyTransactions = allTransactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
    });

    setTransactions(monthlyTransactions);
  }, []);

  const income = totals.generalIncome || 0;
 
  const savings = totals.saving || 0;

  const net = income - expenses;
  const status = net > 0 ? "Gain" : net === 0 ? "Break Even" : "Debt / Deficit";

  const statusColor =
    net > 0 ? "text-green-600" : net === 0 ? "text-yellow-600" : "text-red-600";
  const statusBg =
    net > 0 ? "bg-green-100/50" : net === 0 ? "bg-yellow-100/50" : "bg-red-100/50";

  return (
    <div className="min-h-screen bg-gradient-to-tr mt-18 from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-6xl mx-auto space-y-12">
        <h2 className="text-5xl font-extrabold text-gray-800 text-center drop-shadow-md tracking-wide">
          📊 Monthly Financial Report
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[{
            label: "Total Income",
            value: income,
            borderColor: "border-green-400",
            textColor: "text-green-700"
          },
          {
            label: "Total Expenses",
            value: expenses,
            borderColor: "border-red-400",
            textColor: "text-red-700"
          },
          {
            label: "Total Savings",
            value: savings,
            borderColor: "border-blue-400",
            textColor: "text-blue-700"
          }].map(({label, value, borderColor, textColor}) => (
            <div
              key={label}
              className={`bg-white bg-opacity-70 backdrop-blur-md p-8 rounded-3xl shadow-lg border-t-8 ${borderColor} hover:scale-105 transform transition`}
            >
              <p className="text-lg font-semibold text-gray-600 tracking-wider">{label}</p>
              <p className={`text-4xl font-extrabold mt-3 ${textColor} drop-shadow-md`}>
                ${value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Transaction History */}
        <div className="bg-white bg-opacity-70 backdrop-blur-md p-8 rounded-3xl shadow-xl">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6 tracking-wide flex items-center gap-2">
            🧾 Transaction History (This Month)
          </h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-lg text-center py-10 italic">No transactions recorded this month.</p>
          ) : (
            <ul className="divide-y divide-gray-300">
              {transactions.map((txn, idx) => (
                <li
                  key={idx}
                  className="py-4 flex justify-between items-center hover:bg-purple-100 rounded-lg transition cursor-default"
                >
                  <div>
                    <p className="text-gray-800 font-semibold tracking-wide">
                      {txn.description || txn.source || txn.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(txn.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    className={`text-xl font-bold ${
                      txn.type === "income"
                        ? "text-green-600"
                        : txn.type === "expense"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    ${txn.amountInUSD?.toLocaleString() || txn.amount?.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Summary Note */}
        <div
          className={`rounded-3xl p-8 shadow-lg text-center mx-auto max-w-md ${statusBg} border-2 border-current border-opacity-50`}
        >
          <h4 className="text-2xl font-bold text-gray-700 mb-3 tracking-wider">📌 Summary</h4>
          <p className={`text-3xl font-extrabold ${statusColor} drop-shadow-lg`}>
            {status}: ${net.toLocaleString()}
          </p>
        </div>

        {/* Status Flags */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {["tithe", "partnership", "saving"].map((key) => {
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            const flag = statusFlags[key];
            const statusPaid = flag?.paid;
            const date = flag?.date;

            return (
              <div
                key={key}
                className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-md border-l-8 border-indigo-500 hover:scale-105 transform transition cursor-default"
              >
                <p className="text-xl font-semibold tracking-wide">{label}</p>
                <p
                  className={`text-lg mt-2 ${
                    statusPaid ? "text-green-600" : "text-red-600"
                  } font-semibold`}
                >
                  {statusPaid ? "Paid" : "Pending"}
                </p>
                {statusPaid && date && (
                  <p className="text-sm text-gray-500 mt-1 italic">
                    Paid on: {new Date(date).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Report;
