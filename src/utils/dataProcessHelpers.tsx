export const processWeeklyData = (data: { 
  
    day_of_week: number; 
    total: number
 }[],
    transactionType: "Income" | "Expense" = "Income"
) => {
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const isIncome = transactionType === "Income"

    let barData = days.map((label) => ({
        label,
        value: 0,
        
    }))

    data.forEach((item) => {
        // Assuming item.dayOfWeek is in the range 0-6 (matching SQLite %w output)
        const dayIndex = item.day_of_week;
        if (dayIndex >= 0 && dayIndex < 7) {
          barData[dayIndex].value = item.total;
          
            barData[dayIndex].frontColor = isIncome ? "#d3ff00" : "#ffab00"; // default income/expense colors
            barData[dayIndex].gradientColor = isIncome ? "#12ff00" : "#ff0000"; // default income/expense gradients
          
        } else {
          console.error(`Invalid day of week index: ${item.day_of_week}`);
        }
      });

    return barData;
};