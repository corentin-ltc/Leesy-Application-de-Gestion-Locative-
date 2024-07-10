import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Dimensions, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSQLiteContext } from 'expo-sqlite/next';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import SummaryChart from '@/components/SummaryChart';
import DateTimePicker from '@react-native-community/datetimepicker';

const initialLayout = { width: Dimensions.get('window').width };

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const DétailsRoute = ({ rental }) => (
  <ScrollView>
    <View className='justify-center items-center'>
      <SummaryChart rentalId={rental.id} />
      <View className="mt-5" style={styles.card}>
        <Text>Nom de la location: {rental.rental_name}</Text>
        <Text>Adresse: {rental.address}</Text>
        <Text>Prix: {rental.price}</Text>
        <Text>Description: {rental.description}</Text>
      </View>
    </View>
  </ScrollView>
);

const LocatairesRoute = () => (
  <View>
  </View>
);

const TransactionForm = ({ onSubmit, type }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSubmit = () => {
    const rawDate = Math.floor(date.getTime() / 1000); // Convert date to seconds
    console.log(`Raw date in seconds: ${rawDate}`);

    const transaction = {
      amount: parseFloat(amount),
      description,
      date: rawDate,
      type
    };
    onSubmit(transaction);
    setAmount('');
    setDescription('');
    setDate(new Date());
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.datePickerText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Button title={`Add ${type}`} onPress={handleSubmit} />
    </View>
  );
};

const TransactionsRoute = ({ rentalId, type }) => {
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
    console.log(`Adding ${type.toLowerCase()} with raw date: ${transaction.date}`);
    await db.runAsync(
      `INSERT INTO Transactions (rental_id, amount, date, description, type) VALUES (?, ?, ?, ?, ?)`,
      [rentalId, transaction.amount, transaction.date, transaction.description, type]
    );
    fetchTransactions(); // Refresh the transactions list
  }, [db, fetchTransactions, rentalId, type]);

  const handleDeleteTransaction = useCallback(async (id) => {
    await db.runAsync(`DELETE FROM Transactions WHERE id = ?`, [id]);
    fetchTransactions(); // Refresh the transactions list
  }, [db, fetchTransactions]);

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

const RentalDetails = () => {
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'details', title: 'Détails' },
    { key: 'locataires', title: 'Locataires' },
    { key: 'revenus', title: 'Revenus' },
    { key: 'dépenses', title: 'Dépenses' },
  ]);
  const [rental, setRental] = useState(null);
  const db = useSQLiteContext();

  const fetchRentalDetails = useCallback(async () => {
    const result = await db.getAllAsync(`SELECT * FROM Rental WHERE id = ?;`, [id]);
    if (result.length > 0) {
      setRental(result[0]);
    }
  }, [db, id]);

  useEffect(() => {
    fetchRentalDetails();
  }, [fetchRentalDetails]);

  const renderScene = useMemo(() => SceneMap({
    details: () => <DétailsRoute rental={rental} />,
    locataires: LocatairesRoute,
    revenus: () => <TransactionsRoute rentalId={id} type="Income" />,
    dépenses: () => <TransactionsRoute rentalId={id} type="Expense" />,
  }), [id, rental]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={styles.tabBarLabel}
      tabStyle={styles.tab}
      renderLabel={({ route, focused, color }) => (
        <Text style={[styles.tabBarLabel, { color }]}>
          {capitalizeFirstLetter(route.title)}
        </Text>
      )}
    />
  );

  if (!rental) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <Stack.Screen options={{ title: rental.rental_name }} />
      <View style={[styles.container, { paddingTop: headerHeight }]}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
        />
      </View>
    </>
  );
};

export default RentalDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    backgroundColor: '#736ced',
  },
  indicator: {
    backgroundColor: '#fff',
  },
  tabBarLabel: {
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  tab: {
    marginRight: 9,
    marginLeft: 5,
  },
  sectionContent: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  transactionItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
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
  rental_title: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#736ced",
    width: '70%',
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.15,
  },
  datePickerText: {
    color: 'blue',
    marginBottom: 10,
  },
  formContainer: {
    padding: 15,
  }
});
