import React, { useState, useEffect } from 'react';
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
      <SummaryChart />
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

const DépensesRoute = ({ rentalId }) => {
  const db = useSQLiteContext();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const result = await db.getAllAsync(`SELECT * FROM Transactions WHERE rental_id = ? AND type = 'Expense';`, [rentalId]);
    setExpenses(result);
  };

  const handleAddExpense = async (expense) => {
    console.log(`Adding expense with raw date: ${expense.date}`);
    await db.runAsync(
      `INSERT INTO Transactions (rental_id, amount, date, description, type) VALUES (?, ?, ?, ?, 'Expense')`,
      [rentalId, expense.amount, expense.date, expense.description]
    );
    fetchExpenses(); // Refresh the expenses list
  };

  const handleDeleteExpense = async (id) => {
    await db.runAsync(`DELETE FROM Transactions WHERE id = ?`, [id]);
    fetchExpenses(); // Refresh the expenses list
  };

  return (
    <View>
      <TransactionForm onSubmit={handleAddExpense} type="Expense" />
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text>{item.description}: {item.amount} €</Text>
            <Text>Date: {new Date(item.date * 1000).toLocaleDateString()}</Text>
            <Button title="Delete" onPress={() => handleDeleteExpense(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const RevenusRoute = ({ rentalId }) => {
  const db = useSQLiteContext();
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    const result = await db.getAllAsync(`SELECT * FROM Transactions WHERE rental_id = ? AND type = 'Income';`, [rentalId]);
    setIncomes(result);
  };

  const handleAddIncome = async (income) => {
    console.log(`Adding income with raw date: ${income.date}`);
    await db.runAsync(
      `INSERT INTO Transactions (rental_id, amount, date, description, type) VALUES (?, ?, ?, ?, 'Income')`,
      [rentalId, income.amount, income.date, income.description]
    );
    fetchIncomes(); // Refresh the incomes list
  };

  const handleDeleteIncome = async (id) => {
    await db.runAsync(`DELETE FROM Transactions WHERE id = ?`, [id]);
    fetchIncomes(); // Refresh the incomes list
  };

  return (
    <View>
      <TransactionForm onSubmit={handleAddIncome} type="Income" />
      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.incomeItem}>
            <Text>{item.description}: {item.amount} €</Text>
            <Text>Date: {new Date(item.date * 1000).toLocaleDateString()}</Text>
            <Button title="Delete" onPress={() => handleDeleteIncome(item.id)} />
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
    { key: 'dépenses', title: 'Dépenses' },
    { key: 'revenus', title: 'Revenus' },
  ]);
  const [rental, setRental] = useState(null);
  const db = useSQLiteContext();

  useEffect(() => {
    fetchRentalDetails();
  }, [id]);

  const fetchRentalDetails = async () => {
    const result = await db.getAllAsync(`SELECT * FROM Rental WHERE id = ?;`, [id]);
    if (result.length > 0) {
      setRental(result[0]);
    }
  };

  const renderScene = SceneMap({
    details: () => <DétailsRoute rental={rental} />,
    locataires: LocatairesRoute,
    dépenses: () => <DépensesRoute rentalId={id} />,
    revenus: () => <RevenusRoute rentalId={id} />,
  });

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
  expenseItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  incomeItem: {
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
  datePickerText: {
    color: 'blue',
    marginBottom: 10,
  },
  formContainer: {
    padding: 15,
  }
});
