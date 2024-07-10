import { View, Text, StyleSheet, processColor } from 'react-native';
import * as React from 'react';
import { BarChart } from "react-native-gifted-charts";
import { useSQLiteContext } from 'expo-sqlite';
import { processWeeklyData } from '@/utils/dataProcessHelpers';
import { SegmentedControl } from './SegmentedControl';

enum Period {
  week = "week",
  month = "month",
  year = "year"
}

export default function GlobalSummaryChart() {
  const db = useSQLiteContext();
  const [chartData, setChartData] = React.useState([]);
  const [chartPeriod, setChartPeriod] = React.useState<Period>(Period.month);
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [currentEndDate, setCurrentEndDate] = React.useState<Date>(new Date());
  const [chartKey, setChartKey] = React.useState<number>(0);
  const [transactionType, setTransactionType] = React.useState<"Income" | "Expense">("Income");
  const options =  ['Revenus', 'Dépenses'];
  const [selectedOptions, setSelectedOptions] = React.useState('Revenus');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (chartPeriod === Period.month) {
          const { endDate, startDate } = getWeekRange(currentDate);
          setCurrentEndDate(new Date(endDate));

          const data = await fetchWeeklyData(startDate, endDate, transactionType);
          setChartData(processWeeklyData(data!, transactionType));
          setChartKey((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [chartPeriod, currentDate, transactionType]);

  React.useEffect(() => {
    setTransactionType(selectedOptions === 'Revenus' ? 'Income' : 'Expense');
  }, [selectedOptions]);

  const fetchWeeklyData = async (startDate: number, endDate: number, type: "Income" | "Expense") => {
    try {
      const query = `
        SELECT
          strftime('%w', date, 'unixepoch') AS day_of_week,
          SUM(amount) as total
        FROM Transactions
        WHERE date >= ? AND date <= ? AND type = ?
        GROUP BY day_of_week
        ORDER BY day_of_week ASC
      `;

      const result = await db.getAllAsync(query, [startDate, endDate, type]);

      return result;
    } catch (e) {
      console.error("Database query error:", e);
      return [];
    }
  };

  const getWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
      startDate: Math.floor(startOfWeek.getTime() / 1000), // Unix timestamp in seconds
      endDate: Math.floor(endOfWeek.getTime() / 1000) // Unix timestamp in seconds
    };
  };

  return (
    <View className='w-full mt-3' style={styles.card}>
      <Text className='font-pmedium text-black text-2xl'>
        Ce mois-ci: <Text className='text-green-600'>+750€</Text>
      </Text>
      <View className='items-center justify-center mt-2'>
        <BarChart
          key={chartKey}
          data={chartData}
          height={200}
          width={280}
          barWidth={18}
          barBorderRadius={3}
          spacing={20}
          noOfSections={4}
          yAxisThickness={0}
          xAxisThickness={0}
          xAxisLabelTextStyle={{ color: "gray" }}
          yAxisTextStyle={{ color: "gray" }}
          isAnimated
          animationDuration={400}
          showGradient
        />
      </View>
      <View className='justify-center items-center mt-2'>
        <SegmentedControl
          options={options}
          selectedOption={selectedOptions}
          onOptionPress={setSelectedOptions}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: "white",
    width: '92%',
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.15,
  },
});
