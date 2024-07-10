export const processMonthlyData = (data: { 
  month: number; 
  total: number
}[],
  transactionType: "Income" | "Expense" = "Income"
) => {
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const isIncome = transactionType === "Income";

  let barData = months.map((label) => ({
      label,
      value: 0,
  }));

  data.forEach((item) => {
      const monthIndex = parseInt(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
          barData[monthIndex].value = item.total;
          barData[monthIndex].frontColor = isIncome ? "#d3ff00" : "#ffab00";
          barData[monthIndex].gradientColor = isIncome ? "#12ff00" : "#ff0000";
      } else {
          console.error(`Invalid month index: ${item.month}`);
      }
  });

  return barData;
};
