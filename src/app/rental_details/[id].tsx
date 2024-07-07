import { ScrollView, SectionList, StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSQLiteContext } from 'expo-sqlite/next'; // Ensure this import is correct based on your project setup.

const categories = ['Détails', 'Locataires', 'Dépenses', 'Revenus'];

const RentalDetails = () => {
    const { id } = useLocalSearchParams();
    const headerHeight = useHeaderHeight();
    const [activeIndex, setActiveIndex] = useState(0);
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

    if (!rental) {
        return <Text>Loading...</Text>;
    }

    return (
        <>
            <Stack.Screen options={{ title: rental.rental_name }} />
            <SectionList
                style={{ paddingTop: headerHeight }}
                contentInsetAdjustmentBehavior='automatic'
                keyExtractor={(item) => item.title}
                sections={[{ data: [{ title: 'Chart' }] }]}
                renderSectionHeader={() => (
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'space-between',
                        paddingHorizontal: 16,
                        paddingBottom: 8,
                        backgroundColor: '',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      }}>
                        {categories.map((item, index) => (
                         <TouchableOpacity
                           key={index}
                           onPress={() => setActiveIndex(index)}
                           style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}>
                           <Text
                             style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                             {item}
                           </Text>
                         </TouchableOpacity>
                    ))}
                    </ScrollView>
                  )}
                
                renderItem={({ item }) => (
                    <View>
                        {/* CHART */}
                        <Text>{item.title}</Text>
                    </View>
                )}
            />
        </>
    );
}

export default RentalDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#fff',
        padding: 10,
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});
