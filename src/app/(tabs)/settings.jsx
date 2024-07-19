import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../provider/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite/next';

const Settings = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const db = useSQLiteContext();

  const deleteAllData = async () => {
    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync('DELETE FROM Transactions;');
        await db.runAsync('DELETE FROM Tenant;');
        await db.runAsync('DELETE FROM User;');
        await db.runAsync('DELETE FROM Rental;');
        await db.runAsync('DELETE FROM UserAchievements;');
        
        // Insert a new user after deletion
        await db.runAsync('INSERT INTO User (USERNAME, firstTimeConnection) VALUES (?, ?);', ['Leesy', 1]);
      });
      console.log('All data deleted and new user created successfully.');
      getData();
    } catch (error) {
      console.error('Error deleting data or creating user:', error);
    }
  };

  async function getData() {
    const result = await db.getAllAsync('SELECT * FROM User');
    console.log('user data' ,result);
  }

  const handleSignOut = async () => {
    await deleteAllData();
    signOut();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Paramètres du compte</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Noter Leesy</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Invitez vos amis</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Nous contacter</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>FAQ</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Politique de confidentialité</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Conditions générales</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item} onPress={handleSignOut}>
        <Text style={styles.itemText}>Se déconnecter</Text>
        <Ionicons name="log-out-outline" size={20} color={'black'} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Supprimer son compte</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default Settings;
