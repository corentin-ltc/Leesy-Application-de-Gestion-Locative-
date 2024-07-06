import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddRental() {
  const [newRental, setNewRental] = useState({
    rental_name: '',
    rental_city: '',
    rental_postal_code: '',
    rental_street: '',
    number_of_tenants: '',
    country: '',
    surface_area: '',
    rental_type: '',
    user_id: '', // Set dynamically based on your application logic
  });

  const navigation = useNavigation(); // Hook from expo-router to get navigation object

  const db = useSQLiteContext();

  async function addNewRental() {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        'INSERT INTO Rental (rental_name, rental_city, rental_postal_code, rental_street, number_of_tenants, country, surface_area, rental_type, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
          newRental.rental_name,
          newRental.rental_city,
          newRental.rental_postal_code,
          newRental.rental_street,
          newRental.number_of_tenants,
          newRental.country,
          newRental.surface_area,
          newRental.rental_type,
          newRental.user_id,
        ]
      );
    });
    navigation.pop(); // Navigate back to the previous screen after adding rental
  }

  return (
    <SafeAreaView >

    <View className='h-full w-full ml-3'>
      <Text style={styles.label}>Rental Name</Text>
      <TextInput
        style={styles.input}
        value={newRental.rental_name}
        onChangeText={(text) => setNewRental({ ...newRental, rental_name: text })}
        placeholder="Enter rental name"
        />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        value={newRental.rental_city}
        onChangeText={(text) => setNewRental({ ...newRental, rental_city: text })}
        placeholder="Enter city"
        />

      <Text style={styles.label}>Postal Code</Text>
      <TextInput
        style={styles.input}
        value={newRental.rental_postal_code}
        onChangeText={(text) => setNewRental({ ...newRental, rental_postal_code: text })}
        placeholder="Enter postal code"
        />

      <Text style={styles.label}>Street</Text>
      <TextInput
        style={styles.input}
        value={newRental.rental_street}
        onChangeText={(text) => setNewRental({ ...newRental, rental_street: text })}
        placeholder="Enter street"
        />

      <Text style={styles.label}>Country</Text>
      <TextInput
        style={styles.input}
        value={newRental.country}
        onChangeText={(text) => setNewRental({ ...newRental, country: text })}
        placeholder="Enter country"
        />

      <Text style={styles.label}>Surface Area</Text>
      <TextInput
        style={styles.input}
        value={newRental.surface_area}
        onChangeText={(text) => setNewRental({ ...newRental, surface_area: text })}
        placeholder="Enter surface area"
        keyboardType="numeric"
        />

      <Text style={styles.label}>Rental Type</Text>
      <TextInput
        style={styles.input}
        value={newRental.rental_type}
        onChangeText={(text) => setNewRental({ ...newRental, rental_type: text })}
        placeholder="Enter rental type"
        />

      <TouchableOpacity style={styles.addButton} onPress={addNewRental}>
        <Text style={styles.addButtonText}>Add Rental</Text>
      </TouchableOpacity>
    </View>
</SafeAreaView>
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
