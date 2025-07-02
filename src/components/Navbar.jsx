import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Dashboard", path: "/" },
    { label: "Add Transaction", path: "/add" },
    { label: "Report", path: "/report" },
    { label: "Debt", path: "/debt" },
    { label: "Income", path: "/income" },
    { label: "Archive", path: "/archive" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe(); // Clean up on unmount
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-5xl leading-[1.2] overflow-visible font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          MoneyTrail
        </h1>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-6 items-center">
          {navLinks.map((item) => (
            <li key={item.path} style={{ fontFamily: "'Cinzel', serif" }}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md transition duration-200 ${
                    isActive
                      ? "bg-sky-500 text-white shadow-inner"
                      : "text-sky-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}

          {user && (
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition"
            >
              Logout
            </button>
          )}
        </ul>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-sky-400 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-sky-500 text-white shadow-inner"
                    : "text-sky-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {user && (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
