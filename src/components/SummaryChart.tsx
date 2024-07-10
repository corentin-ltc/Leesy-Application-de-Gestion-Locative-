import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { BarChart } from "react-native-gifted-charts";
import { useSQLiteContext } from 'expo-sqlite';
import { processMonthlyData } from '@/utils/dataProcessHelpers';
import { SegmentedControl } from './SegmentedControl';
import { SymbolView, SFSymbol } from 'expo-symbols';

enum Period {
  month = "month",
  sixMonths = "sixMonths"
}

export default function SummaryChart({ rentalId }) {
  const db = useSQLiteContext();
  const [chartData, setChartData] = React.useState([]);
  const [chartPeriod, setChartPeriod] = React.useState<Period>(Period.sixMonths);
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [transactionType, setTransactionType] = React.useState<"Income" | "Expense">("Income");
  const options = ['Revenus', 'Dépenses'];
  const [selectedOptions, setSelectedOptions] = React.useState('Revenus');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (chartPeriod === Period.sixMonths) {
          const { startDate, endDate } = getSixMonthRange(currentDate);
          const data = await fetchMonthlyData(startDate, endDate, transactionType, rentalId);
          setChartData(processMonthlyData(data, transactionType));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [chartPeriod, currentDate, transactionType, rentalId]);

  React.useEffect(() => {
    setTransactionType(selectedOptions === 'Revenus' ? 'Income' : 'Expense');
  }, [selectedOptions]);

  const fetchMonthlyData = async (startDate: number, endDate: number, type: "Income" | "Expense", rentalId: number) => {
    try {
      const query = `
        SELECT
          strftime('%m', date, 'unixepoch') AS month,
          SUM(amount) as total
        FROM Transactions
        WHERE date >= ? AND date <= ? AND type = ? AND rental_id = ?
        GROUP BY month
        ORDER BY month ASC
      `;

      const result = await db.getAllAsync(query, [startDate, endDate, type, rentalId]);

      return result;
    } catch (e) {
      console.error("Database query error:", e);
      return [];
    }
  };

  const getSixMonthRange = (date: Date) => {
    const startOfPeriod = new Date(date);
    startOfPeriod.setMonth(date.getMonth() - 5);
    startOfPeriod.setDate(1);
    startOfPeriod.setHours(0, 0, 0, 0);

    const endOfPeriod = new Date(date);
    endOfPeriod.setHours(23, 59, 59, 999);

    return {
      startDate: Math.floor(startOfPeriod.getTime() / 1000),
      endDate: Math.floor(endOfPeriod.getTime() / 1000)
    };
  };

  const handlePreviousPeriod = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 6)));
  };

  const handleNextPeriod = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 6)));
  };

  return (
    <View className='w-full mt-6' style={styles.card}>
      <Text className='font-pmedium text-black text-2xl'>
        Période: <Text className='text-green-600'> total € </Text>
      </Text>
      <View className='items-center justify-center mt-2'>
        <BarChart
          key={chartPeriod}
          data={chartData}
          height={200}
          width={280}
          barWidth={18}
          barBorderRadius={3}
          spacing={5}
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
      <View className='flex-row justify-between mt-4'>
        <TouchableOpacity className='items-center' onPress={handlePreviousPeriod}>
          <SymbolView 
            name="chevron.left.circle.fill"
            size={35}
            type="hierarchical"
            tintColor={'grey'}
          />
        </TouchableOpacity>
        <View className='justify-center items-center'>
          <SegmentedControl
            options={options}
            selectedOption={selectedOptions}
            onOptionPress={setSelectedOptions}
          />
        </View>
        <TouchableOpacity className='items-center' onPress={handleNextPeriod}>
          <SymbolView 
            name="chevron.right.circle.fill"
            size={35}
            type="hierarchical"
            tintColor={'grey'}            
          />
        </TouchableOpacity>
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
