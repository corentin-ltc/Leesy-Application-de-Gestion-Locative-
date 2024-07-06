import { View, Text, ScrollView } from 'react-native'
import * as React from 'react'
import { Rental } from '../types';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Link, Redirect, router} from 'expo-router';
import CustomButton from '../../components/CustomButton';
import PropertyCard from '../../components/PropertyCard';


  export default function Create() {
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
    <ScrollView >
      <View className="items-center justify-center h-full w-full">

      <Text>create</Text>
      <CustomButton
        title="Se connecter"
        handlePress={() => router.push('../home')}
        containerStyles="w-10/12 mt-7"
      />
      <PropertyCard 
      rental={rental}
      
      />
      </View>
    </ScrollView>
  )
}
