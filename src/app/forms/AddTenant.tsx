import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Platform, KeyboardAvoidingView, Image, Button } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import { images } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTenant({ rentalId, onClose }) {
  const [newTenant, setNewTenant] = useState({
    first_name: '',
    last_name: '',
    rent_amount: '',
    move_in_date: new Date(),
    rent_payment_date: new Date(),
  });
  const [showMoveInDatePicker, setShowMoveInDatePicker] = useState(false);
  const [showRentPaymentDatePicker, setShowRentPaymentDatePicker] = useState(false);

  const db = useSQLiteContext();

  const handleMoveInDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newTenant.move_in_date;
    setShowMoveInDatePicker(Platform.OS === 'ios');
    setNewTenant({ ...newTenant, move_in_date: currentDate });
  };

  const handleRentPaymentDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newTenant.rent_payment_date;
    setShowRentPaymentDatePicker(Platform.OS === 'ios');
    setNewTenant({ ...newTenant, rent_payment_date: currentDate });
  };

  async function addNewTenant() {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO Tenant (first_name, last_name, rent_amount, move_in_date, rent_payment_date, rental_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          newTenant.first_name,
          newTenant.last_name,
          parseFloat(newTenant.rent_amount),
          newTenant.move_in_date.toISOString(),
          newTenant.rent_payment_date.toISOString(),
          rentalId,
        ]
      );
    });
    onClose();
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding'>
        <SafeAreaView>
          <TouchableOpacity className="ml-4" onPress={onClose}>
            <Ionicons name="close-circle" size={40} color="#736ced" />
          </TouchableOpacity>
          <View id="Logo_and_text" className='flex-row justify-between items-start'>
            <View className="flex-row flex-1 justify-center items-center ml-4 mt-14 rounded-lg p-2 border-primary border-2"> 
              <Text className='flex-wrap text-center flex-1 font-pmedium'>
                Veuillez entrer le nom et les caractéristiques du locataire à ajouter.
              </Text>
            </View>
            <Image 
              source={images.logo}
              className="w-[115px] h-[100px] mt-7"
              resizeMode='contain'
            />
          </View>
          <ScrollView className='mx-6 flex my-auto flex-grow mt-5'>
            <Text className='font-pregular text-xl mb-2'>Prénom</Text>
            <TextInput
              style={styles.input}
              value={newTenant.first_name}
              onChangeText={(text) => setNewTenant({ ...newTenant, first_name: text })}
              placeholder="John"
            />
            <Text className='font-pregular text-xl mb-2'>Nom</Text>
            <TextInput
              style={styles.input}
              value={newTenant.last_name}
              onChangeText={(text) => setNewTenant({ ...newTenant, last_name: text })}
              placeholder="Doe"
            />
            <Text className='font-pregular text-xl mb-2'>Montant du loyer (€)</Text>
            <TextInput
              style={styles.input}
              value={newTenant.rent_amount}
              onChangeText={(text) => setNewTenant({ ...newTenant, rent_amount: text })}
              placeholder="1000"
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => setShowMoveInDatePicker(true)}>
              <Text style={styles.datePickerText}>Move-in Date: {newTenant.move_in_date.toDateString()}</Text>
            </TouchableOpacity>
            {showMoveInDatePicker && (
              <DateTimePicker
                value={newTenant.move_in_date}
                mode="date"
                display="default"
                onChange={handleMoveInDateChange}
              />
            )}
            <TouchableOpacity onPress={() => setShowRentPaymentDatePicker(true)}>
              <Text style={styles.datePickerText}>Rent Payment Date: {newTenant.rent_payment_date.toDateString()}</Text>
            </TouchableOpacity>
            {showRentPaymentDatePicker && (
              <DateTimePicker
                value={newTenant.rent_payment_date}
                mode="date"
                display="default"
                onChange={handleRentPaymentDateChange}
              />
            )}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <View className='justify-center w-full items-center mt-10'>
        <Button title="Add Tenant" onPress={addNewTenant} />
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  datePickerText: {
    color: 'blue',
    marginBottom: 10,
  },
});
