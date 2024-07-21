// AddRental.js
import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import { images } from '../../constants';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { checkAndAwardAchievements } from '../achievements/Achievements'; // Import the function
import { useUsername } from '../../utils/UserContext';

export default function AddRental({ onClose }) {
  const [newRental, setNewRental] = useState({
    rental_name: '',
    rental_city: '',
    rental_postal_code: '',
    rental_street: '',
    number_of_tenants: '',
    country: '',
    surface_area: '',
    rental_type: '',
  });

  const navigation = useNavigation(); // Hook from expo-router to get navigation object
  const { xpPoints, setXpPoints } = useUsername(); // Access context
  const [userStats, setUserStats] = useState(null);
  const [achievements, setAchievements] = useState([]);

  const db = useSQLiteContext();

  useEffect(() => {
    fetchUserStats();
    fetchAchievements();
  }, []);

  const fetchUserStats = async () => {
    try {
      console.log('Fetching user stats...');
      const rentalCountResult = await db.getAllAsync('SELECT COUNT(*) as count FROM Rental');
      const tenantCountResult = await db.getAllAsync('SELECT COUNT(*) as count FROM Tenant');
      const incomeResult = await db.getAllAsync('SELECT SUM(amount) as total_income FROM Transactions WHERE type = "Income"');
      const countryCountResult = await db.getAllAsync('SELECT COUNT(DISTINCT country) as count FROM Rental');

      const rentals = rentalCountResult[0].count;
      const tenants = tenantCountResult[0].count;
      const totalIncome = incomeResult[0].total_income;
      const countries = countryCountResult[0].count;

      setUserStats({
        rental_count: rentals,
        tenant_count: tenants,
        total_income: totalIncome,
        country_count: countries,
        annual_income: totalIncome, // Assuming annual income is same as total income for simplicity
        no_expense_6_months: 0 // Placeholder, implement logic for no expenses in last 6 months
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      console.log('Fetching achievements...');
      const result = await db.getAllAsync('SELECT * FROM Achievements');
      setAchievements(result);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  async function addNewRental() {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        'INSERT INTO Rental (rental_name, rental_city, rental_postal_code, rental_street, number_of_tenants, country, surface_area, rental_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [
          newRental.rental_name,
          newRental.rental_city,
          newRental.rental_postal_code,
          newRental.rental_street,
          newRental.number_of_tenants,
          newRental.country,
          newRental.surface_area,
          newRental.rental_type,
        ]
      );
    });
    await fetchUserStats(); // Fetch updated stats
    await checkAndAwardAchievements(db, xpPoints, setXpPoints, userStats, achievements); // Call the function after adding rental
    onClose();
  }

  return (
    <View>
      <KeyboardAvoidingView behavior='padding'>
        <SafeAreaView>
            <TouchableOpacity className="ml-4 "onPress={onClose}>
              <Ionicons name="close-circle" size={40} color="#736ced" />
            </TouchableOpacity>
          <View id="Logo_and_text" className='flex-row justify-between items-start'>
            <View className="flex-row flex-1 justify-center items-center ml-4 mt-14 rounded-lg p-2 border-primary border-2"> 
              <Text className='flex-wrap text-center flex-1 font-pmedium'>
                Veuillez entrer le nom et les caractéristiques du bien à ajouter.
              </Text>
            </View>
            <Image 
              source={images.logo}
              className="w-[115px] h-[100px] mt-7"
              resizeMode='contain'
            />
          </View>
          <ScrollView className='ml-6 mr-6 flex my-auto flex-grow mt-5'>
            <Text className='font-pregular text-xl mb-2'>Nom</Text>
            <TextInput
              style={styles.input}
              value={newRental.rental_name}
              onChangeText={(text) => setNewRental({ ...newRental, rental_name: text })}
              placeholder="Studio Rivoli"
            />
            <View className='flex-row gap-4'>
              <View className='flex-1'>
                <Text className='font-pregular text-xl mb-2'>Ville</Text>
                <TextInput
                  style={styles.input}
                  value={newRental.rental_city}
                  onChangeText={(text) => setNewRental({ ...newRental, rental_city: text })}
                  placeholder="Paris"
                />
              </View>
              <View className='flex-1'>
                <Text className='font-pregular text-xl mb-2'>Code postal</Text>
                <TextInput
                  style={styles.input}
                  value={newRental.rental_postal_code}
                  onChangeText={(text) => setNewRental({ ...newRental, rental_postal_code: text })}
                  placeholder="75004"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <Text className='font-pregular text-xl mb-2'>Rue</Text>
            <TextInput
              style={styles.input}
              value={newRental.rental_street}
              onChangeText={(text) => setNewRental({ ...newRental, rental_street: text })}
              placeholder="45 rue François Miron"
            />
            <View className='flex-row gap-4'>
              <View className='flex-1'>
                <Text className='font-pregular text-xl mb-2'>Pays</Text>
                <TextInput
                  style={styles.input}
                  value={newRental.country}
                  onChangeText={(text) => setNewRental({ ...newRental, country: text })}
                  placeholder="France"
                />
              </View>
              <View className=' flex-1'>
                <Text className='font-pregular text-xl mb-2'>Surface (m²)</Text>
                <TextInput
                  style={styles.input}
                  value={newRental.surface_area}
                  onChangeText={(text) => setNewRental({ ...newRental, surface_area: text })}
                  placeholder="31"
                  keyboardType="numeric"
                />
              </View>
            </View>          
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <View className='justify-center w-full items-center mt-10'>
        <CustomButton 
          handlePress={addNewRental}
          title={"ENREGISTRER"}
          containerStyles={"w-3/4"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
