import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { BarChart } from "react-native-gifted-charts";
import { useSQLiteContext } from 'expo-sqlite';
import { processMonthlyData } from '@/utils/dataProcessHelpers';
import { SegmentedControl } from './SegmentedControl';
import { SymbolView, SFSymbol } from 'expo-symbols';

enum Period {
  month = "month",
  year = "year"
}

export default function SummaryChart({ rentalId }) {
  const db = useSQLiteContext();
  const [chartData, setChartData] = React.useState([]);
  const [chartPeriod, setChartPeriod] = React.useState<Period>(Period.year);
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [transactionType, setTransactionType] = React.useState<"Income" | "Expense">("Income");
  const options = ['Revenus', 'Dépenses'];
  const [selectedOptions, setSelectedOptions] = React.useState('Revenus');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (chartPeriod === Period.year) {
          const { startDate, endDate } = getYearRange(currentDate);
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

  const getYearRange = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);

    const endOfYear = new Date(date.getFullYear(), 11, 31);
    endOfYear.setHours(23, 59, 59, 999);

    return {
      startDate: Math.floor(startOfYear.getTime() / 1000),
      endDate: Math.floor(endOfYear.getTime() / 1000)
    };
  };

  const handlePreviousYear = () => {
    setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)));
  };

  const handleNextYear = () => {
    setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)));
  };

  const findMaxValue = () => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map(item => item.value));
  };

  const getNumberOfDigits = (num) => {
    return num.toString().length;
  };

  const incrementFirstCharacterAndZeroOut = (num) => {
    let numStr = num.toString();
    let firstChar = numStr.charAt(0);

    if (firstChar === '9') {
      return '10' + '0'.repeat(numStr.length - 1);
    } else {
      let incrementedChar = (parseInt(firstChar) + 1).toString();
      let modifiedValue = incrementedChar + '0'.repeat(numStr.length - 1);
      return parseInt(modifiedValue) < 10 ? '20' : modifiedValue;
    }
  };

  const maxValue = findMaxValue();
  const maxDigits = getNumberOfDigits(maxValue);
  const modifiedMaxValue = incrementFirstCharacterAndZeroOut(maxValue);
  const stepValue = parseInt(modifiedMaxValue) / 4;

  const totalAmount = chartData.reduce((total, item) => total + item.value, 0);
  const chartYear = currentDate.getFullYear();
  const isRevenue = selectedOptions === 'Revenus';

  return (
    <View className='w-full mt-6' style={styles.card}>
      <Text className='font-pmedium text-black text-2xl'>
        <Text className={`${isRevenue ? 'text-green-600' : 'text-red-600'}`}>
          {totalAmount} € 
        </Text>
        {isRevenue ? " gagnés en " : " dépensés en "}
        {chartYear}
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
          stepValue={stepValue}
          
        />
      </View>
      <Text style={styles.maxValueText}>
        Max Value: {maxValue}
      </Text>
      <Text style={styles.maxDigitsText}>
        Number of Digits: {maxDigits}
      </Text>
      <Text style={styles.modifiedMaxValueText}>
        Modified Max Value: {modifiedMaxValue}
      </Text>
      <View className='flex-row justify-between mt-4'>
        <TouchableOpacity className='items-center' onPress={handlePreviousYear}>
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
        <TouchableOpacity className='items-center' onPress={handleNextYear}>
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
  revenueText: {
    color: 'green',
  },
  expenseText: {
    color: 'red',
  },
  maxValueText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
  },
  maxDigitsText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 5,
  },
  modifiedMaxValueText: {
    fontSize: 14,
    color: 'blue',
    textAlign: 'center',
    marginTop: 5,
  },
});
