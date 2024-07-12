import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSQLiteContext } from 'expo-sqlite/next';
import AddButton from '../../components/AddButton';
import AddTenant from '../forms/AddTenant';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
  } from "@gorhom/bottom-sheet";

const TenantsRoute = ({ rentalId }) => {
  const db = useSQLiteContext();
  const [tenants, setTenants] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [moveInDate, setMoveInDate] = useState(new Date());
  const [rentPaymentDate, setRentPaymentDate] = useState(new Date());
  const [showMoveInDatePicker, setShowMoveInDatePicker] = useState(false);
  const [showRentPaymentDatePicker, setShowRentPaymentDatePicker] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchTenants = useCallback(async () => {
    const result = await db.getAllAsync(`SELECT * FROM Tenant WHERE rental_id = ?;`, [rentalId]);
    setTenants(result);
  }, [db, rentalId]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleAddTenant = useCallback(async () => {
    await db.runAsync(
      `INSERT INTO Tenant (first_name, last_name, rent_amount, move_in_date, rent_payment_date, rental_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, parseFloat(rentAmount), moveInDate.toISOString(), rentPaymentDate.toISOString(), rentalId]
    );
    fetchTenants(); // Refresh the tenants list
    setFirstName('');
    setLastName('');
    setRentAmount('');
    setMoveInDate(new Date());
    setRentPaymentDate(new Date());
  }, [db, firstName, lastName, rentAmount, moveInDate, rentPaymentDate, rentalId, fetchTenants]);

  const handleDeleteTenant = useCallback(async (id) => {
    await db.runAsync(`DELETE FROM Tenant WHERE id = ?`, [id]);
    fetchTenants(); // Refresh the tenants list
  }, [db, fetchTenants]);

  const handleMoveInDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || moveInDate;
    setShowMoveInDatePicker(Platform.OS === 'ios');
    setMoveInDate(currentDate);
  };

  const handleRentPaymentDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || rentPaymentDate;
    setShowRentPaymentDatePicker(Platform.OS === 'ios');
    setRentPaymentDate(currentDate);
  };

  const bottomSheetModalRef = useRef(null);

  const snapPoints = ["100%"];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  }

  function handleCloseModal() {
    bottomSheetModalRef.current?.dismiss();
    setIsOpen(false);
    fetchTenants();
  }

  return (
    <View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Rent Amount"
          value={rentAmount}
          onChangeText={setRentAmount}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={() => setShowMoveInDatePicker(true)}>
          <Text style={styles.datePickerText}>{moveInDate.toDateString()}</Text>
        </TouchableOpacity>
        {showMoveInDatePicker && (
          <DateTimePicker
            value={moveInDate}
            mode="date"
            display="default"
            onChange={handleMoveInDateChange}
          />
        )}
        <TouchableOpacity onPress={() => setShowRentPaymentDatePicker(true)}>
          <Text style={styles.datePickerText}>{rentPaymentDate.toDateString()}</Text>
        </TouchableOpacity>
        {showRentPaymentDatePicker && (
          <DateTimePicker
            value={rentPaymentDate}
            mode="date"
            display="default"
            onChange={handleRentPaymentDateChange}
          />
        )}
        <Button title="Add Tenant" onPress={handleAddTenant} />
      </View>
      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text>{item.first_name} {item.last_name}</Text>
            <Text>Rent: {item.rent_amount} €</Text>
            <Text>Move-in Date: {new Date(item.move_in_date).toLocaleDateString()}</Text>
            <Text>Rent Payment Date: {new Date(item.rent_payment_date).toLocaleDateString()}</Text>
            <Button title="Delete" onPress={() => handleDeleteTenant(item.id)} />
          </View>
        )}
      />
      <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 50 }}
            onDismiss={() => setIsOpen(false)}
            >
          
              <AddTenant rentalId={rentalId} onClose={handleCloseModal}/>
          </BottomSheetModal>
          <AddButton handlePress={handlePresentModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  transactionItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  datePickerText: {
    color: 'blue',
    marginBottom: 10,
  },
});

export default TenantsRoute;
