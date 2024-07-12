import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSQLiteContext } from 'expo-sqlite/next';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import initializeDatabase from './InitializeDatabase';
import DétailsRoute from './DetailsRoute';
import LocatairesRoute from './TenantsRoute';
import TransactionsRoute from './TransactionsRoute';

const initialLayout = { width: Dimensions.get('window').width };

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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
  const [refresh, setRefresh] = useState(false); // State to trigger refresh

  const fetchRentalDetails = useCallback(async () => {
    const result = await db.getAllAsync(`SELECT * FROM Rental WHERE id = ?;`, [id]);
    if (result.length > 0) {
      setRental(result[0]);
    }
  }, [db, id]);

  useEffect(() => {
    initializeDatabase(db); // Initialize the database
    fetchRentalDetails();
  }, [fetchRentalDetails]);

  const handleTransactionModified = useCallback(() => {
    setRefresh(prev => !prev); // Toggle the refresh state
  }, []);

  const renderScene = useMemo(() => SceneMap({
    details: () => <DétailsRoute rental={rental} refresh={refresh} />,
    locataires: () => <LocatairesRoute rentalId={id} />,
    revenus: () => <TransactionsRoute rentalId={id} type="Income" onTransactionModified={handleTransactionModified} />,
    dépenses: () => <TransactionsRoute rentalId={id} type="Expense" onTransactionModified={handleTransactionModified} />,
  }), [id, rental, refresh, handleTransactionModified]);

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
});
