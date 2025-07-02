// src/pages/Gate.jsx
import React, { useState } from "react";

const Gate = ({ onAccessGranted }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const validCodes = ["MT2024", "MONEYTRAIL25", "PAIDACCESS"]; // You control this list

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validCodes.includes(code.trim().toUpperCase())) {
      localStorage.setItem("access_granted", "true");
      onAccessGranted();
    } else {
      setError("Invalid access code. Contact support.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 text-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-lg w-full max-w-md shadow-xl border border-red-500">
        <h1 className="text-3xl font-bold mb-6 text-red-400">Enter Access Code</h1>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-3 rounded-md bg-zinc-800 text-white border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder="Enter your secret code"
        />
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        <button
          type="submit"
          className="mt-6 w-full py-3 rounded-md bg-red-600 hover:bg-red-700 transition font-semibold uppercase tracking-wide"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Gate;
