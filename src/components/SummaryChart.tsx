import { View, Text, StyleSheet } from 'react-native'
import * as React from 'react'
import { BarChart, barDataItem } from "react-native-gifted-charts"
import { useSQLiteContext } from 'expo-sqlite'

enum Period {
    week = "week",
    month = "month",
    year = "year"
}
export default function SummaryChart () {

  const db = useSQLiteContext();
  const [chartData, setChartData] = React.useState<barDataItem>();
  const [chartPeriod, setChartPeriod] = React.useState<Period>(Period.month);
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    const fetchData = async () =>{
        if (chartPeriod === Period.month) {
            // start date and end date
        }
    }
  }, [])

  const getWeekRange = (date: Date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(date.setDate(startOfWeek.getDate() + 6));

    return {
        startDate: startOfWeek
    }
  }
  return (
    <View className='w-full mt-3' style={ styles.card }>
    <Text className='font-pmedium text-black text-2xl'>Ce mois-ci: <Text className='text-green-600'>+750€</Text></Text>
    <View className='items-center justify-center mt-2'>

    </View>
        <BarChart
            data={[
                {value: 100}, 
                {value: 200, frontColor: 'blue'}, 
                {value: 200, frontColor: 'green'}
            ]}
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
            />
    </View>
  )
}

const styles = StyleSheet.create({
    card: {
      padding: 15,
      borderRadius: 15,
      backgroundColor: "white",
      width:'92%',
      elevation: 8,
      shadowColor: "#000",
      shadowRadius: 8,
      shadowOffset: { height: 6, width: 0 },
      shadowOpacity: 0.15,
    },
  });

