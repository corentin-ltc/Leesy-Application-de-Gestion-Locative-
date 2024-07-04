import { View, Text, ScrollView } from 'react-native'
import * as React from 'react'
import { Category, Transaction } from '../types';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Link, Redirect, router} from 'expo-router';
import CustomButton from '../../components/CustomButton';
import TransactionList from '@/components/TransactionList';


  export default function Create() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  
  const db = useSQLiteContext();

  React.useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    })
  }, [db])

  async function getData() {
    const result = await db.getAllAsync<Transaction>(
      `SELECT * FROM Transactions ORDER BY date DESC;`
    );
    setTransactions(result);
  }

  async function deleteTransaction(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id]);
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
      <TransactionList 
      categories={categories}
      transactions={transactions}
      deleteTransaction={deleteTransaction}
      />
      </View>
    </ScrollView>
  )
}
