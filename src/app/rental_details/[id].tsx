import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSQLiteContext } from 'expo-sqlite/next';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';

const initialLayout = { width: Dimensions.get('window').width };

const DétailsRoute = ({ rental }) => (
    <View style={styles.sectionContent}>
        <Text>Nom de la location: {rental.rental_name}</Text>
        <Text>Adresse: {rental.address}</Text>
        <Text>Prix: {rental.price}</Text>
        <Text>Description: {rental.description}</Text>
    </View>
);

const LocatairesRoute = () => (
    <View style={styles.sectionContent}>
        <Text>Liste des locataires</Text>
    </View>
);

const DépensesRoute = () => (
    <View style={styles.sectionContent}>
        <Text>Liste des dépenses</Text>
    </View>
);

const RevenusRoute = () => (
    <View style={styles.sectionContent}>
        <Text>Liste des revenus</Text>
    </View>
);

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
        dépenses: DépensesRoute,
        revenus: RevenusRoute,
    });

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            labelStyle={styles.tabBarLabel}
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
        backgroundColor: '#14bdeb', // Top bar background color
    },
    indicator: {
        backgroundColor: '#fff', // Indicator color
    },
    tabBarLabel: {
        color: '#fff', // Label color
        fontWeight: 'bold',
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
});
