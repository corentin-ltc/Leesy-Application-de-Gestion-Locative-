import PropertyCard from '../../components/PropertyCard';
import AddCard from '../../components/AddCard';
import { StyleSheet, Text, View, Image } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { useSQLiteContext } from 'expo-sqlite/next';
import * as React from 'react'


export default function Bookmark() {
  const [rental, setRental] = React.useState<Rental[]>([]);
  
  const db = useSQLiteContext();

  React.useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    })
  }, [db])

  async function getData() {
    const result = await db.getAllAsync<Rental>(
      `SELECT * FROM Rental;`
    );
    setRental(result);
  }

  async function deleteTransaction(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Rental WHERE id = ?;`, [id]);
      await getData();
    });
  }
  return (

    <View className="h-full bg-primary" >
    <ScrollView>
      <View className="bg-secondary h-full w-full">
        <View className="w-full h-16 bg-primary items-center justify-center">
          <Text className="font-psemibold text-3xl text-white">Vos biens</Text>
        </View>

        <View id="PropertyCards-container" className="flex-row flex-wrap">
        
        </View>
        <AddCard/>
        <View className="bg-secondary h-24 mt-52"></View>

      </View>
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  row: {
    flexDirection: 'row', // Arrange children in a row
  },
  card:{
    height:250,
    width:"40%",
    backgroundColor:"white",
    borderRadius:15,
    padding:10,
    elevation:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginLeft: '4%'
  },
  profileImg:{
    width:30,
    height:30,
    borderRadius:50,
    marginRight:10,
  },
});