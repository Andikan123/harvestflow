import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransactions";
import ArchivedReports from "./pages/ArchivedReports";
import Report from "./pages/Report";
import Navbar from "./components/Navbar";
import DebtPage from "./pages/DebtPage";
import IncomeSources from "./pages/IncomeSources";
import Gate from "./pages/Gate";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import useMonthlyReset from "./hooks/useMonthlyReset";

const App = () => {
  useMonthlyReset();

  const [user, setUser] = useState(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const access = localStorage.getItem("access_granted") === "true";
      setAccessGranted(access);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (checkingAuth) return null; // optionally show a loader here

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#111827] text-[#E5E7EB]">
        {user && accessGranted && <Navbar />}

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Routes>
            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Access Gate (only show after login) */}
            <Route
              path="/gate"
              element={
                user && !accessGranted ? (
                  <Gate onAccessGranted={() => setAccessGranted(true)} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* Protected Pages */}
            {user && accessGranted ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add" element={<AddTransaction />} />
                <Route path="/report" element={<Report />} />
                <Route path="/debt" element={<DebtPage />} />
                <Route path="/income" element={<IncomeSources />} />
                <Route path="/archive" element={<ArchivedReports />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>

        {user && accessGranted && (
          <footer className="text-center py-4 text-sm text-gray-400">
            © {new Date().getFullYear()} MoneyTrail. All rights reserved.
          </footer>
        )}
      </div>
    </Router>
  );
};

export default App;
