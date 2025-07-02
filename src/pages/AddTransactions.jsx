import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTotals } from "../redux/slices/TotalSlice";

const currencySymbols = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
  TL: "₺",
};

const exchangeRatesToUSD = {
  USD: 1,
  NGN: 0.0024,
  EUR: 1.1,
  GBP: 1.3,
  TL: 0.054,
};

const AddTransactions = () => {
  const dispatch = useDispatch();
  const totals = useSelector((state) => state.totals);

  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [type, setType] = useState("income");
  const [currency, setCurrency] = useState("NGN");
  const [message, setMessage] = useState("");

  const convertToUSD = (amt, curr) => {
    const rate = exchangeRatesToUSD[curr] || 1;
    return amt * rate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || (type === "income" && !source.trim())) {
      setMessage("Please enter a valid amount and source.");
      return;
    }

    const amountInUSD = convertToUSD(amt, currency);

    const newTransaction = {
      id: Date.now(),
      type,
      originalAmount: amt,
      currency,
      amountInUSD,
      source,
      date: new Date().toISOString(),
    };

    let updatedValues = {};

    if (type === "income") {
      const tithe = amountInUSD * 0.2;
      const saving = amountInUSD * 0.2;
      const available = amountInUSD - tithe - saving;

      updatedValues = {
        generalIncome: amountInUSD,
        tithe,
        saving,
        availableIncome: available,
        businessIncome: source.toLowerCase() === "business" ? amountInUSD : 0,
        otherIncome: source.toLowerCase() !== "business" ? amountInUSD : 0,
      };

      newTransaction.tithe = tithe;
      newTransaction.saving = saving;
      newTransaction.available = available;
    } else if (type === "expense") {
      updatedValues = { expenses: amountInUSD };
    } else if (type === "saving") {
      updatedValues = { saving: amountInUSD };
    }

    dispatch(updateTotals(updatedValues));

    const prevTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    localStorage.setItem("transactions", JSON.stringify([newTransaction, ...prevTransactions]));

    setAmount("");
    setSource("");
    setType("income");
    setCurrency("NGN");
    setMessage("Transaction added successfully 🎉");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div
      className="max-w-xl mx-auto mt-18 rounded-3xl p-8 shadow-2xl"
      style={{
        background:
          "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)",
        fontFamily: "'Merriweather', serif",
        color: "#1e293b",
      }}
    >
      <h2
        className="text-3xl font-extrabold mb-6 text-center"
        style={{
          background: "linear-gradient(90deg, #0ea5e9, #2563eb)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "0.05em",
        }}
      >
        Add New Transaction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold tracking-wide">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 50000"
            className="w-full px-5 py-3 rounded-xl border border-gray-300 shadow-inner focus:outline-none focus:ring-4 focus:ring-sky-400 focus:border-sky-500 transition"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold tracking-wide">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 shadow-inner focus:outline-none focus:ring-4 focus:ring-sky-400 focus:border-sky-500 transition"
          >
            <option value="NGN">Naira (₦)</option>
            <option value="USD">Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">Pound (£)</option>
            <option value="TL">Lira (₺)</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold tracking-wide">Transaction Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 shadow-inner focus:outline-none focus:ring-4 focus:ring-sky-400 focus:border-sky-500 transition"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="saving">Saving</option>
          </select>
        </div>

        {type === "income" && (
          <div>
            <label className="block mb-2 font-semibold tracking-wide">Source</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. Business, Freelance"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 shadow-inner focus:outline-none focus:ring-4 focus:ring-sky-400 focus:border-sky-500 transition"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-xl text-white font-bold text-lg transition bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 shadow-lg"
        >
          Add Transaction
        </button>
      </form>

      {message && (
        <p className="mt-6 text-center text-green-700 font-semibold">{message}</p>
      )}
    </div>
  );
};

export default AddTransactions;
