import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, Button, StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';
import TransactionForm from './TransactionForm';

const TransactionsRoute = ({ rentalId, type, onTransactionModified }) => {
  const db = useSQLiteContext();
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = useCallback(async () => {
    const result = await db.getAllAsync(`SELECT * FROM Transactions WHERE rental_id = ? AND type = ?;`, [rentalId, type]);
    setTransactions(result);
  }, [db, rentalId, type]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddTransaction = useCallback(async (transaction) => {
    await db.runAsync(
      `INSERT INTO Transactions (rental_id, amount, date, description, type) VALUES (?, ?, ?, ?, ?)`,
      [rentalId, transaction.amount, transaction.date, transaction.description, type]
    );
    fetchTransactions(); // Refresh the transactions list
    onTransactionModified(); // Trigger the refresh for the chart
  }, [db, fetchTransactions, rentalId, type, onTransactionModified]);

  const handleDeleteTransaction = useCallback(async (id) => {
    await db.runAsync(`DELETE FROM Transactions WHERE id = ?`, [id]);
    fetchTransactions(); // Refresh the transactions list
    onTransactionModified(); // Trigger the refresh for the chart
  }, [db, fetchTransactions, onTransactionModified]);

  return (
    <View>
      <TransactionForm onSubmit={handleAddTransaction} type={type} />
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text>{item.description}: {item.amount} €</Text>
            <Text>Date: {new Date(item.date * 1000).toLocaleDateString()}</Text>
            <Button title="Delete" onPress={() => handleDeleteTransaction(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default TransactionsRoute;
