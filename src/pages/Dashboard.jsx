import React, { useEffect } from "react";
import {
  ArrowUpRight,
  HeartHandshake,
  Wallet,
  TrendingDown,
  Star,
  RefreshCcw,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  markAsPaidAndReset,
  resetTotals,
 updateTotals,
} from "../redux/slices/TotalSlice";
import { addNeed, deleteNeed, toggleNeedMet, } from "../redux/slices/NeedSlice";
import { toast } from "react-toastify";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";


const fontStyle = {
  fontFamily: "'Cinzel', serif",
};

const Dashboard = () => {
  const dispatch = useDispatch();

  // Redux state
  const totals = useSelector((state) => state.totals);
  const needs = useSelector((state) => state.needs);
  const incomeSources = useSelector((state) => state.incomeSources);
  const statusFlags = totals.statusFlags || {};

 useEffect(() => {
  const fetchProfitIncome = async () => {
    try {
      const profitSnap = await getDocs(collection(db, "users", "admin", "profits"));
      let totalProfitUSD = 0;

      profitSnap.forEach((doc) => {
        const data = doc.data();
        if (data.amountUSD) {
          totalProfitUSD += data.amountUSD;
        }
      });

      // Calculate tithe (10%) and saving (20%) from general income
      const tithe = totalProfitUSD * 0.1;
      const saving = totalProfitUSD * 0.2;

     dispatch(
  updateTotals({
    generalIncome: (totals.generalIncome || 0) + totalProfitUSD, // ✅ Add instead of overwrite
    tithe: tithe,
    saving: saving,
  })
);

    } catch (err) {
      console.error("Error fetching profit income:", err);
    }
  };

  fetchProfitIncome();
}, [dispatch]);




  // Calculations
  const totalNeedExpenses = needs
    .filter((need) => need.met)
    .reduce((sum, need) => sum + need.amount, 0);

  const unpaidDebt = totals.debt?.reduce((sum, d) => sum + d.amount, 0) || 0;

  const totalDisplayedExpenses = totals.expenses + totalNeedExpenses + unpaidDebt;

  // Handlers
  const handleMarkAsPaid = (key) => {
    dispatch(markAsPaidAndReset(key));
    const message =
      key === "tithe"
        ? "✅ Tithe paid! “Bring the full tithe into the storehouse…” – Malachi 3:10"
        : "🙌 Partnership given! “Give, and it will be given to you…” – Luke 6:38";
    toast.success(message);
  };

  const handleToggleNeedMet = (id) => {
    dispatch(toggleNeedMet(id));
  };

  const handleResetAll = () => {
    dispatch(resetTotals());
    localStorage.removeItem("transactions");
    needs.forEach((need) => {
      if (need.met) dispatch(toggleNeedMet(need.id));
    });
  };

  // Reusable StatCard component
  const StatCard = ({ icon: Icon, title, amount, color, subtitle, paid, onToggle }) => (
    <div
      className={`p-6 rounded-xl shadow-md hover:shadow-lg transition group border ${
        onToggle ? "cursor-pointer" : ""
      }`}
      style={{
        ...fontStyle,
        background: "linear-gradient(135deg, #0d9488, #7c3aed)", // teal to violet
        borderColor: "#5b21b6", // dark violet border
        color: "#f3f4f6", // light text for contrast
      }}
      onClick={onToggle}
      title={paid !== undefined ? "Click to mark as paid" : ""}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold" style={fontStyle}>
          {title}
        </h3>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p
        className="text-2xl font-bold"
        style={{
          ...fontStyle,
          background: `linear-gradient(90deg, #a78bfa, #5eead4)`, // light violet to aqua
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        ${amount.toLocaleString()}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-200 mt-1" style={fontStyle}>
          {subtitle}
        </p>
      )}
      {paid !== undefined && (
        <span
          className={`inline-block mt-3 px-3 py-1 text-sm font-medium rounded-full ${
            paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
          style={fontStyle}
        >
          {paid ? "Paid" : "Pending"}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 py-18 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Reset Button */}
        <div className="flex justify-end">
          <button
            onClick={handleResetAll}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            style={fontStyle}
          >
            <RefreshCcw className="w-5 h-5" />
            Reset All
          </button>
        </div>

        {/* Overview */}
        <div>
          <h2
            className="text-4xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300 drop-shadow-md"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            📊 Financial Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={Wallet}
              title="General Income"
              amount={totals.generalIncome}
              color="text-green-600"
              subtitle={`Business: $${totals.businessIncome.toLocaleString()} | Other: $${totals.otherIncome.toLocaleString()}`}
            />
            <StatCard
              icon={HeartHandshake}
              title="Tithe"
              amount={totals.tithe}
              color="text-indigo-500"
              paid={!!statusFlags.tithe}
              onToggle={() => handleMarkAsPaid("tithe")}
            />
            <StatCard
              icon={ArrowUpRight}
              title="Partnership"
              amount={totals.partnership}
              color="text-purple-500"
              paid={!!statusFlags.partnership}
              onToggle={() => handleMarkAsPaid("partnership")}
            />
            <StatCard
              icon={TrendingDown}
              title="Expenses"
              amount={totalDisplayedExpenses}
              color="text-red-500"
            />
            <StatCard
              icon={Wallet}
              title="Saving"
              amount={totals.saving}
              color="text-blue-600"
              paid={!!statusFlags.saving}
              onToggle={() => handleMarkAsPaid("saving")}
            />
          </div>
        </div>

        {/* Income by Source */}
        <div
          className="rounded-2xl shadow-lg p-6"
          style={{
            background: "linear-gradient(135deg, #e0e7ff, #f0f9ff)",
            fontFamily: "'Cinzel', serif",
            color: "#1e293b",
          }}
        >
          <h2
            className="text-3xl font-extrabold mb-6 flex items-center gap-2"
            style={{
              background: "linear-gradient(90deg, #7c3aed, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            📈 Income by Source
          </h2>

          <div className="space-y-4" style={{ fontFamily: "'Cinzel', serif" }}>
            {Object.entries(incomeSources || {})
              .sort((a, b) => b[1] - a[1])
              .map(([key, amt], index) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-white shadow-md px-5 py-4 rounded-xl border border-gray-200 hover:shadow-xl transition"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-7 h-7 flex items-center justify-center text-sm font-semibold rounded-full ${
                        index === 0
                          ? "bg-gradient-to-tr from-yellow-400 to-amber-400 text-white shadow-lg"
                          : index === 1
                          ? "bg-gradient-to-tr from-gray-400 to-gray-500 text-white shadow"
                          : index === 2
                          ? "bg-gradient-to-tr from-orange-400 to-red-400 text-white shadow"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="capitalize font-semibold text-gray-800 text-base">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                  </div>
                  <span className="text-cyan-600 font-bold text-lg">${amt.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Needs Section */}
        <div
          className="rounded-3xl shadow-xl p-8 max-w-4xl mx-auto"
          style={{
            background: "linear-gradient(135deg, #fafafa, #e0e7ff)", // soft light pastel gradient
            fontFamily: "'Cinzel', serif",
            color: "#1e293b",
          }}
        >
          <h2
            className="text-4xl font-extrabold mb-8 flex items-center gap-4"
            style={{
              background: "linear-gradient(90deg, #f59e0b, #fbbf24)", // warm yellow gradient
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.05em",
            }}
          >
            <Star className="w-8 h-8 text-yellow-400 drop-shadow-md" />
            Most Pressing Needs
          </h2>

          {/* Add Need Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const title = form.title.value.trim();
              const amount = parseFloat(form.amount.value);
              const priority = form.priority.value;
              if (title && !isNaN(amount) && priority) {
                dispatch(
                  addNeed({
                    id: Date.now(),
                    title,
                    amount,
                    priority,
                  })
                );
                form.reset();
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8"
          >
            <input
              type="text"
              name="title"
              placeholder="Need Title"
              className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
              required
              style={{ fontFamily: "'Cinzel', serif" }}
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
              required
              style={{ fontFamily: "'Cinzel', serif" }}
            />
            <select
              name="priority"
              className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
              required
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <option value="">Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button
              type="submit"
              className="bg-yellow-500 text-white rounded-lg px-6 py-3 hover:bg-yellow-600 shadow-md transition font-semibold"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Add Need
            </button>
          </form>

          {/* Needs List */}
          <ul className="divide-y divide-gray-300">
            {needs.map((need) => (
              <li
                key={need.id}
                className="py-4 flex justify-between items-center"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => handleToggleNeedMet(need.id)}
                >
                  <p
                    className={`text-xl font-semibold ${
                      need.met ? "line-through text-gray-400" : "text-gray-800"
                    } transition-colors duration-300`}
                  >
                    {need.title}
                  </p>
                  <span
                    className={`text-xs mt-1 px-3 py-1 rounded-full inline-block font-semibold ${
                      need.priority === "Critical"
                        ? "bg-gradient-to-r from-red-600 to-red-400 text-white"
                        : need.priority === "High"
                        ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white"
                        : need.priority === "Medium"
                        ? "bg-gradient-to-r from-yellow-400 to-green-300 text-gray-900"
                        : "bg-gradient-to-r from-green-400 to-green-200 text-gray-900"
                    } shadow-md`}
                  >
                    {need.priority} Priority
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <p
                    className={`text-2xl font-bold ${
                      need.met ? "line-through text-gray-400" : "text-red-700"
                    }`}
                  >
                    ${need.amount.toLocaleString()}
                  </p>
                  <button
                    className="text-red-600 hover:text-red-800 text-2xl transition"
                    onClick={() => dispatch(deleteNeed(need.id))}
                    title="Delete Need"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
