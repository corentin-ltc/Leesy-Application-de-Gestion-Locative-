import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Dimensions, ScrollView, VirtualizedList } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSQLiteContext } from 'expo-sqlite/next';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import SummaryChart from '@/components/SummaryChart';

const initialLayout = { width: Dimensions.get('window').width };

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const DétailsRoute = ({ rental }) => (
  <ScrollView>
    <View className='justify-center items-center'>

      <SummaryChart/>

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
  <View style={styles.sectionContent}>
    <Text>Liste des locataires</Text>
  </View>
);

const DépensesRoute = ({ rentalId }) => {
  const db = useSQLiteContext();
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const result = await db.getAllAsync(`SELECT * FROM Expenses WHERE rental_id = ?;`, [rentalId]);
    setExpenses(result);
  };

  const addExpense = async () => {
    if (expenseName && expenseAmount) {
      await db.runAsync(
        `INSERT INTO Expenses (rental_id, expense_name, expense_amount, expense_date) VALUES (?, ?, ?, date('now'));`,
        [rentalId, expenseName, parseFloat(expenseAmount)]
      );
      setExpenseName('');
      setExpenseAmount('');
      fetchExpenses(); // Refresh the expenses list
    }
  };

  return (
    <View style={styles.sectionContent}>
      <Text>Liste des dépenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text>{item.expense_name}: {item.expense_amount} €</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom de la dépense"
        value={expenseName}
        onChangeText={setExpenseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Montant de la dépense"
        value={expenseAmount}
        onChangeText={setExpenseAmount}
        keyboardType="numeric"
      />
      <Button title="Ajouter Dépense" onPress={addExpense} />
    </View>
  );
};

const RevenusRoute = ({ rentalId }) => {
  const db = useSQLiteContext();
  const [incomes, setIncomes] = useState([]);
  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    const result = await db.getAllAsync(`SELECT * FROM Income WHERE rental_id = ?;`, [rentalId]);
    setIncomes(result);
  };

  const addIncome = async () => {
    if (incomeName && incomeAmount) {
      await db.runAsync(
        `INSERT INTO Income (rental_id, income_name, income_amount, income_date) VALUES (?, ?, ?, date('now'));`,
        [rentalId, incomeName, parseFloat(incomeAmount)]
      );
      setIncomeName('');
      setIncomeAmount('');
      fetchIncomes(); // Refresh the incomes list
    }
  };

  return (
    <View style={styles.sectionContent}>
      <Text>Liste des revenus</Text>
      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.incomeItem}>
            <Text>{item.income_name}: {item.income_amount} €</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom du revenu"
        value={incomeName}
        onChangeText={setIncomeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Montant du revenu"
        value={incomeAmount}
        onChangeText={setIncomeAmount}
        keyboardType="numeric"
      />
      <Button title="Ajouter Revenu" onPress={addIncome} />
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
    backgroundColor: '#736ced', // Top bar background color
  },
  indicator: {
    backgroundColor: '#fff', // Indicator color
  },
  tabBarLabel: {
    fontFamily: 'Poppins-SemiBold', // Applying Poppins-SemiBold font
    textAlign: 'center', // Center the text
    textTransform: 'capitalize', // Ensure first letter is uppercase
    fontWeight: 'bold',
  },
  tab: {
    marginRight: 9, // Adjust the horizontal margin to increase/decrease the space between tabs
    marginLeft: 5, // Adjust the horizontal margin to increase/decrease the space between tabs
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
    width:'92%',
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.15,
  },
});
