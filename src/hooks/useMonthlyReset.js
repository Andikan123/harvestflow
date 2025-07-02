import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetIncomeSources } from "../redux/slices/IncomeSlice";
import { resetTotals } from "../redux/slices/TotalSlice";

const useMonthlyReset = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastSavedMonth = localStorage.getItem("lastSavedMonth");

    if (lastSavedMonth && lastSavedMonth !== currentMonth) {
      const archivedData = {
        totals: JSON.parse(localStorage.getItem("totals")) || {},
        transactions: JSON.parse(localStorage.getItem("transactions")) || [],
      };
      localStorage.setItem(`archive-${lastSavedMonth}`, JSON.stringify(archivedData));

      dispatch(resetTotals());
      dispatch(resetIncomeSources());
      localStorage.setItem("transactions", JSON.stringify([]));
    }

    localStorage.setItem("lastSavedMonth", currentMonth);
  }, [dispatch]);
};

export default useMonthlyReset;
