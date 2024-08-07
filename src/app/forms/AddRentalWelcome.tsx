import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import { images } from '../../constants';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUsername } from '../../utils/UserContext';
import useAchievements from '../achievements/achievementsUtils';

export default function AddRental({ onClose, onSave }) {
  const [newRental, setNewRental] = useState({
    rental_name: '',
    rental_city: '',
    rental_postal_code: '',
    rental_street: '',
    number_of_tenants: '',
    country: '',
    surface_area: '',
    rental_type: '',
    user_name: '',
    profile_picture: null,
  });

  const [step, setStep] = useState(1);
  const { setUsername, setProfilePicture } = useUsername();
  const db = useSQLiteContext();

  useEffect(() => {
    createTablesAndInitialData();
  }, []);

  async function createTablesAndInitialData() {
    try {
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS User (
          USER_ID INTEGER PRIMARY KEY AUTOINCREMENT,
          USERNAME TEXT,
          isPremium INT DEFAULT 0,
          xpPoints INT DEFAULT 0,
          firstTimeConnection INTEGER DEFAULT 1,
          profile_picture TEXT
        );
      `);
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS Rental (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rental_name TEXT NOT NULL,
          rental_city TEXT NOT NULL,
          rental_postal_code TEXT NOT NULL,
          rental_street TEXT NOT NULL,
          number_of_tenants INTEGER NOT NULL,
          country TEXT NOT NULL,
          surface_area REAL NOT NULL,
          rental_type TEXT NOT NULL
        );
      `);
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS Tenant (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          phone_number TEXT,
          email_address TEXT,
          rent_amount REAL NOT NULL,
          charges INTEGER,
          security_deposit REAL,
          additional_info TEXT,
          move_in_date TEXT NOT NULL,
          rent_payment_date TEXT NOT NULL,
          rental_id INTEGER NOT NULL,
          FOREIGN KEY (rental_id) REFERENCES Rental(id)
        );
      `);
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS Transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rental_id INTEGER NOT NULL,
          tenant_id INTEGER,
          amount REAL NOT NULL,
          date INTEGER NOT NULL,
          description TEXT,
          type TEXT NOT NULL CHECK (type IN ('Expense', 'Income')),
          FOREIGN KEY (rental_id) REFERENCES Rental(id),
          FOREIGN KEY (tenant_id) REFERENCES Tenant(id)
        );
      `);
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS Achievements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          condition TEXT NOT NULL,
          xp_value INTEGER NOT NULL DEFAULT 0
        );
      `);
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS UserAchievements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          achievement_id INTEGER NOT NULL,
          date_earned INTEGER NOT NULL,
          FOREIGN KEY (achievement_id) REFERENCES Achievements(id)
        );
      `);

      // Insert initial user "Leesy" if not exists
      const result = await db.runAsync(
        `SELECT * FROM User WHERE USERNAME = 'Leesy'`
      );
      if (1) {
        await db.runAsync(
          `INSERT INTO User (USERNAME, firstTimeConnection) VALUES ('Leesy', 1);`
        );
        console.log('Initial user "Leesy" created.');
      }

      // Insert achievements if not exists
      const achievements = [
        { id: 1, name: 'Propriétaire débutant', description: 'Acheter son premier appartement.', condition: 'rental_count >= 1', xp_value: 20 },
        { id: 2, name: 'Investisseur aguerri', description: 'Posséder 3 appartements.', condition: 'rental_count >= 3', xp_value: 40 },
        { id: 3, name: 'Magnat de la pierre', description: 'Posséder 5 appartements.', condition: 'rental_count >= 5', xp_value: 60 },
        { id: 4, name: 'Roi des immeubles', description: 'Posséder 10 appartements.', condition: 'rental_count >= 10', xp_value: 80 },
        { id: 5, name: 'Premiers pas', description: 'Ajouter son premier locataire.', condition: 'tenant_count >= 1', xp_value: 25 },
        { id: 6, name: 'Gestionnaire confirmé', description: 'Avoir 5 locataires.', condition: 'tenant_count >= 5', xp_value: 50 },
        { id: 7, name: 'Maître des locations', description: 'Avoir 10 locataires.', condition: 'tenant_count >= 10', xp_value: 75 },
        { id: 8, name: 'Sommet du succès', description: 'Avoir 20 locataires.', condition: 'tenant_count >= 20', xp_value: 100 },
        { id: 9, name: 'Virtuose du profit', description: 'Avoir généré plus de 50 000 € de revenus locatifs en un an.', condition: 'annual_income >= 50000', xp_value: 120 },
        { id: 10, name: 'Millionnaire', description: 'Avoir généré 1 000 000 € de revenus locatifs.', condition: 'total_income >= 1000000', xp_value: 150 },
        { id: 11, name: 'Investisseur mondial', description: 'Avoir des propriétés dans 2 pays différents.', condition: 'country_count >= 2', xp_value: 110 },
      ];

      for (const achievement of achievements) {
        const existingAchievement = await db.runAsync(
          `SELECT * FROM Achievements WHERE id = ?`,
          [achievement.id]
        );
        if (1) {
          await db.runAsync(
            `INSERT INTO Achievements (id, name, description, condition, xp_value) VALUES (?, ?, ?, ?, ?)`,
            [achievement.id, achievement.name, achievement.description, achievement.condition, achievement.xp_value]
          );
        }
      }

    } catch (error) {
      console.error('Error creating tables or initial data:', error);
    }
  }

  async function logErrorToSecureStore(error) {
    const errorLog = error.toString();
    await SecureStore.setItemAsync('error_log', errorLog);
    Alert.alert('Error logged. You can retrieve it later.');
  }

  async function retrieveErrorLog() {
    const errorLog = await SecureStore.getItemAsync('error_log');
    if (errorLog) {
      Alert.alert('Retrieved Error Log:', errorLog);
    } else {
      Alert.alert('No error log found.');
    }
  }
  const { fetchUserStats, awardAchievements } = useAchievements(); // Destructure the functions from the custom hook

  async function updateUserAndAddNewRental() {
    if (!newRental.user_name) {
      newRental.user_name = 'Leeser';
    }
    try {
      console.log('Updating user with:', newRental);

      // Update user
      await db.runAsync(
        'UPDATE User SET USERNAME = ?, firstTimeConnection = 0, profile_picture = ?',
        [newRental.user_name, newRental.profile_picture]
      );

      // Update the username context
      setUsername(newRental.user_name);
      setProfilePicture(newRental.profile_picture);

      console.log('User updated successfully');

      // Now create rental
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

      console.log('Rental created successfully');

      // Call the onSave function to handle post-save actions
      if (onSave) onSave();
      await fetchUserStats(); // Fetch updated stats
      await awardAchievements(); // Call the function after adding rental
    } catch (error) {
      console.error('Error updating user or creating rental:', error);
      await logErrorToSecureStore(error); // Log the error to SecureStore
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setNewRental({ ...newRental, profile_picture: pickerResult.assets[0].uri });
    }
  };

  return (
    <View>
      <KeyboardAvoidingView behavior='padding'>
        <SafeAreaView>
          {step === 1 && (
            <View>
              <View id="Logo_and_text" className='flex-row justify-between items-start'>
                <View className="flex-row flex-1 justify-center items-center ml-4 mt-14 rounded-lg p-2 border-primary border-2"> 
                  <Text className='flex-wrap text-center flex-1 font-pmedium'>
                    Commençons par faire connaissance.
                  </Text>
                </View>
                <Image 
                  source={images.logo}
                  className="w-[115px] h-[100px] mt-7"
                  resizeMode='contain'
                />
              </View>
              <View className='ml-6 mr-6 flex my-auto flex-grow mt-5'>
                <Text className='font-pregular text-xl mb-2'>Prénom</Text>
                <TextInput
                  style={styles.input}
                  value={newRental.user_name}
                  onChangeText={(text) => setNewRental({ ...newRental, user_name: text })}
                  placeholder="Leeser"
                />
                <TouchableOpacity onPress={pickImage}>
                  <Text style={styles.label}>Photo</Text>
                  {newRental.profile_picture ? (
                    <Image source={{ uri: newRental.profile_picture }} style={styles.profilePicture} />
                  ) : (
                    <View style={styles.profilePicturePlaceholder}>
                      <Ionicons name="camera" size={40} color="#736ced" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <View className='justify-center w-full items-center mt-10'>
                <CustomButton 
                  handlePress={() => setStep(2)}
                  title={"SUIVANT"}
                  containerStyles={"w-3/4"}
                />
              </View>
            </View>
          )}
          {step === 2 && (
            <>
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
              <View className='justify-center w-full items-center mt-10'>
                <CustomButton 
                  handlePress={updateUserAndAddNewRental}
                  title={"ENREGISTRER"}
                  containerStyles={"w-3/4"}
                />
              </View>
            </>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
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
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 20,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});
