import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import React from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useUsername } from '../../utils/UserContext';

const Achievements = () => {
  const db = useSQLiteContext();
  const { xpPoints, setXpPoints } = useUsername();

  const addXpPoints = async () => {
    try {
      const newXpPoints = xpPoints + 20;
      await db.runAsync('UPDATE User SET xpPoints = ?', [newXpPoints]);
      setXpPoints(newXpPoints);
    } catch (error) {
      console.error('Error updating xpPoints:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <Button title="Add 20 XP Points" onPress={addXpPoints} />
    </View>
  );
};

export default Achievements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
