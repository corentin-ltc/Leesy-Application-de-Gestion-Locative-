import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useLocalSearchParams, router } from 'expo-router';

const EditTenant = () => {
  const { tenant: tenantString, tenantId } = useLocalSearchParams();
  const tenant = JSON.parse(tenantString);
  const db = useSQLiteContext();

  const [firstName, setFirstName] = useState(tenant.first_name || '');
  const [lastName, setLastName] = useState(tenant.last_name || '');
  const [phoneNumber, setPhoneNumber] = useState(tenant.phone_number || '');
  const [emailAddress, setEmailAddress] = useState(tenant.email_address || '');
  const [rentAmount, setRentAmount] = useState(tenant.rent_amount || '');
  const [charges, setCharges] = useState(tenant.charges || '');
  const [securityDeposit, setSecurityDeposit] = useState(tenant.security_deposit || '');
  const [additionalInfo, setAdditionalInfo] = useState(tenant.additional_info || '');

  const handleSave = async () => {
    const updatedTenant = {
      ...tenant,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email_address: emailAddress,
      rent_amount: rentAmount,
      charges: charges,
      security_deposit: securityDeposit,
      additional_info: additionalInfo,
      id: tenantId, // Make sure the id is included
    };

    try {
      await db.runAsync(
        `UPDATE Tenant SET first_name = ?, last_name = ?, phone_number = ?, email_address = ?, rent_amount = ?, charges = ?, security_deposit = ?, additional_info = ? WHERE id = ?`,
        [
          updatedTenant.first_name,
          updatedTenant.last_name,
          updatedTenant.phone_number,
          updatedTenant.email_address,
          updatedTenant.rent_amount,
          updatedTenant.charges,
          updatedTenant.security_deposit,
          updatedTenant.additional_info,
          updatedTenant.id,
        ]
      );
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update tenant');
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
      />
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        value={emailAddress}
        onChangeText={setEmailAddress}
        placeholder="Email Address"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Rent Amount</Text>
      <TextInput
        style={styles.input}
        value={rentAmount}
        onChangeText={setRentAmount}
        placeholder="Rent Amount"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Charges</Text>
      <TextInput
        style={styles.input}
        value={charges}
        onChangeText={setCharges}
        placeholder="Charges"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Security Deposit</Text>
      <TextInput
        style={styles.input}
        value={securityDeposit}
        onChangeText={setSecurityDeposit}
        placeholder="Security Deposit"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Additional Info</Text>
      <TextInput
        style={styles.input}
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
        placeholder="Additional Info"
        multiline
      />
      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 4,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default EditTenant;
