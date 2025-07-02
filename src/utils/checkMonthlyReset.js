// src/utils/checkMonthlyReset.js
export const checkMonthlyReset = (dispatch, resetTotals, resetIncomeSources) => {
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastUsedKey = localStorage.getItem("last-used-month");

  if (lastUsedKey !== currentKey) {
    const archive = {
      transactions: JSON.parse(localStorage.getItem("transactions")) || [],
      totals: JSON.parse(localStorage.getItem("totals")) || {},
      incomeSources: JSON.parse(localStorage.getItem("incomeSources")) || {},
    };

    localStorage.setItem(`archive-${lastUsedKey || currentKey}`, JSON.stringify(archive));

    // Clear current data
    localStorage.removeItem("transactions");
    localStorage.removeItem("totals");
    localStorage.removeItem("incomeSources");

    dispatch(resetTotals());
    dispatch(resetIncomeSources());

    // Update current month tracker
    localStorage.setItem("last-used-month", currentKey);
  }
};
