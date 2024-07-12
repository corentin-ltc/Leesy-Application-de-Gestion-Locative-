import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, Image, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import { images } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';

export default function AddTenant({ rentalId, onClose }) {
  const [newTenant, setNewTenant] = useState({
    first_name: '',
    last_name: '',
    rent_amount: '',
    move_in_date: new Date(),
    rent_payment_day: '', // Changed from rent_payment_date to rent_payment_day
  });

  const db = useSQLiteContext();

  const handleMoveInDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newTenant.move_in_date;
    setNewTenant({ ...newTenant, move_in_date: currentDate });
  };

  const validateInputs = () => {
    if (
      !newTenant.first_name ||
      !newTenant.last_name ||
      !newTenant.rent_amount ||
      !newTenant.rent_payment_day ||
      isNaN(newTenant.rent_payment_day) ||
      newTenant.rent_payment_day < 1 ||
      newTenant.rent_payment_day > 28
    ) {
      Alert.alert('Incomplet', 'Veuillez remplir tous les champs et rentrer un jour de paiement entre 1 et 28.');
      return false;
    }
    return true;
  };

  async function addNewTenant() {
    if (!validateInputs()) return;

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO Tenant (first_name, last_name, rent_amount, move_in_date, rent_payment_date, rental_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          newTenant.first_name,
          newTenant.last_name,
          parseFloat(newTenant.rent_amount),
          newTenant.move_in_date.toISOString(),
          newTenant.rent_payment_day, // Store only the day of the month
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
            <View className="flex-row flex-1 justify-center items-center ml-4 mt-10 rounded-lg p-2 border-primary border-2">
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
              placeholder="Tony"
            />
            <Text className='font-pregular text-xl mb-2'>Nom</Text>
            <TextInput
              style={styles.input}
              value={newTenant.last_name}
              onChangeText={(text) => setNewTenant({ ...newTenant, last_name: text })}
              placeholder="Soprano"
            />
            <Text className='font-pregular text-xl mb-2'>Montant du loyer (€)</Text>
            <TextInput
              style={styles.input}
              value={newTenant.rent_amount}
              onChangeText={(text) => setNewTenant({ ...newTenant, rent_amount: text })}
              placeholder="450"
              keyboardType="numeric"
            />
            <View className='flex-row mb-6 items-center'>
              <Text className='font-pregular text-xl'>Date d'entrée</Text>
              <DateTimePicker
                value={newTenant.move_in_date}
                mode="date"
                display="default"
                onChange={handleMoveInDateChange}
              />
            </View>
            <Text className='font-pregular text-xl mb-2'>Jour estimé de paiement du loyer</Text>
            <TextInput
              style={styles.input}
              value={newTenant.rent_payment_day}
              onChangeText={(text) => setNewTenant({ ...newTenant, rent_payment_day: text })}
              placeholder="15"
              keyboardType="numeric"
            />
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <View className='justify-center w-full items-center'>
        <CustomButton
          handlePress={addNewTenant}
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
