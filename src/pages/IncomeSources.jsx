import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wallet2 } from "lucide-react";
import { addIncome } from "../redux/slices/IncomeSlice";
import { deleteIncomeSource } from "../redux/slices/IncomeSlice";
import { updateGeneralIncome } from "../redux/slices/TotalSlice"; // 👈 import this too

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const IncomeSources = () => {
  const incomeSources = useSelector((s) => s.incomeSources);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ source: "", amount: "" });
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("incomeChartData")) || {};
    setChartData(savedData);
  }, []);

  const generateDummyChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      data.push({
        day: `${7 - i}d`,
        amount: Math.floor(Math.random() * 100 + 50),
      });
    }
    return data;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const source = form.source.trim().toLowerCase();
    const amount = parseFloat(form.amount);

    if (source && !isNaN(amount) && amount > 0) {
      dispatch(addIncome({ source, amount }));
       dispatch(updateGeneralIncome(amount)); // 👈 update general income too

      // Update chart data
      const currentData = { ...(chartData[source] || generateDummyChartData()) };
      const today = new Date().toISOString().slice(0, 10);

      let newData = [...(chartData[source] || generateDummyChartData())];
      newData.push({
        day: today.slice(5), // e.g. "06-25"
        amount,
      });
      if (newData.length > 7) newData.shift(); // Keep only 7 days

      const updatedChart = { ...chartData, [source]: newData };
      localStorage.setItem("incomeChartData", JSON.stringify(updatedChart));
      setChartData(updatedChart);

      setForm({ source: "", amount: "" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-18 p-8 sm:p-12 space-y-10 rounded-3xl bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] shadow-2xl border border-blue-100 backdrop-blur-sm">
      <h2 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent text-center drop-shadow-sm">
        💼 Income Tracker
      </h2>

      {/* Form */}
      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/70 p-6 rounded-2xl shadow-md backdrop-blur-md"
      >
        <input
          type="text"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          placeholder="💡 Income Source"
          className="border px-4 py-3 rounded-lg bg-white text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="💵 Amount"
          className="border px-4 py-3 rounded-lg bg-white text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-400 transition"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg px-6 py-2 hover:from-blue-700 hover:to-cyan-600 transition shadow-md"
        >
          ➕ Add Earning
        </button>
      </form>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(incomeSources)
          .sort(([, a], [, b]) => b - a)
          .map(([source, amount]) => (
            <div
              key={source}
              className="bg-white/80 shadow-xl p-6 rounded-2xl border border-gray-100 hover:scale-[1.02] transition-transform duration-300 ease-in-out group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="capitalize font-semibold text-gray-800 text-lg">
                  {source.replace(/([A-Z])/g, " $1")}
                </h3>
                <Wallet2 className="text-cyan-500 group-hover:text-blue-600 transition" />
                <button
      onClick={() => {
        if (confirm(`Delete "${source}" income source?`)) {
          dispatch(deleteIncomeSource({ source }));
        }
      }}
      className="text-red-500 hover:text-red-700 text-sm"
      title="Delete source"
    >
      🗑
    </button>
              </div>

              <p className="text-3xl font-bold text-cyan-600 mb-2">
                ${Number(amount || 0).toLocaleString()}
              </p>

              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData[source] || generateDummyChartData()}>
                    <XAxis dataKey="day" hide />
                    <YAxis hide domain={["dataMin", "dataMax"]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <span className="mt-3 inline-block text-xs uppercase font-semibold text-white bg-cyan-500 px-2 py-1 rounded-full shadow-sm">
                Active Source
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default IncomeSources;
