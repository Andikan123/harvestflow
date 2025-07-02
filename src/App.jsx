import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransactions";
import ArchivedReports from "./pages/ArchivedReports";
import Report from "./pages/Report";
import Navbar from "./components/Navbar";
import DebtPage from "./pages/DebtPage";
import IncomeSources from "./pages/IncomeSources";
import useMonthlyReset from "./hooks/useMonthlyReset";

const App = () => {
  useMonthlyReset();

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#111827] text-[#E5E7EB]">
        <Navbar />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/report" element={<Report />} />
            <Route path="/debt" element={<DebtPage />} />
            <Route path="/income" element={<IncomeSources />} />
            <Route path="/archive" element={<ArchivedReports />} />
            {/* Optionally add a fallback route */}
            {/* <Route path="*" element={<Dashboard />} /> */}
          </Routes>
        </main>

        <footer className="text-center py-4 text-gray-400 text-sm">
          © {new Date().getFullYear()} MoneyTrail. All rights reserved.
        </footer>
      </div>
    </Router>
  );
};

export default App;
