import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDebt, payDebt, setDebts } from "../redux/slices/TotalSlice";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const DebtPage = () => {
  const dispatch = useDispatch();
  const debts = useSelector((s) => s.totals.debt || []);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);

  // Load debts from Firebase on mount
  useEffect(() => {
    const loadDebts = async () => {
      const debtSnap = await getDocs(collection(db, "users", "admin", "debts"));
      const debtList = debtSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setDebts(debtList)); // update redux store
    };
    loadDebts();
  }, [dispatch]);

  // Add debt to both Firebase and Redux
  const handleAddDebt = async (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    const newDebt = {
      name: name.trim(),
      amount: Number(amount),
    };

    const docRef = await addDoc(collection(db, "users", "admin", "debts"), newDebt);
    dispatch(addDebt({ id: docRef.id, ...newDebt }));

    setName("");
    setAmount("");
  };

  // Mark as paid (remove from Firebase and Redux)
  const handlePayDebt = async (id) => {
    await deleteDoc(doc(db, "users", "admin", "debts", id));
    dispatch(payDebt(id));
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-3xl shadow-lg font-sans mt-18">
      <h2 className="text-4xl font-extrabold text-gray-900 drop-shadow-md flex items-center gap-3">
        💸 Manage Your Debts
      </h2>

      <p className="text-xl text-gray-700">
        Total Debt:{" "}
        <span className="font-semibold text-red-600">${totalDebt.toLocaleString()}</span>
      </p>

      <form
        onSubmit={handleAddDebt}
        className="flex flex-wrap gap-4 bg-white p-6 rounded-2xl shadow-md border border-gray-200"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Who do you owe?"
          className="flex-1 min-w-[150px] border text-gray-800 border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-gray-500 transition"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          min={0}
          className="w-32 border border-gray-300 text-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-gray-500 transition"
          required
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700  px-6 py-3 rounded-lg font-semibold shadow-md transition"
        >
          Add Debt
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
          📋 Debts List
        </h3>

        {debts.length === 0 ? (
          <p className="text-gray-500 italic text-center py-12">No debts recorded.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {debts.map((debt) => (
              <li
                key={debt.id}
                className="flex justify-between items-center py-4 hover:bg-red-50 rounded-lg transition cursor-default"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900">{debt.name}</p>
                  <p className="text-red-600 font-bold">${debt.amount.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handlePayDebt(debt.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow-sm transition"
                  title="Mark this debt as paid"
                >
                  Mark as Paid
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DebtPage;
