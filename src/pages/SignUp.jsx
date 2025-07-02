import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/gate");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-zinc-900 flex items-center justify-center px-6">
      <div className="bg-white/5 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-600">
        <h1 className="text-4xl font-bold text-white text-center mb-6 tracking-wider">
          Create Account
        </h1>
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSignUp} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 transition rounded-lg font-semibold text-white tracking-wider"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400 hover:underline transition"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
