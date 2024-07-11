import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

export default function AddButton({ handlePress }) {
  return (
    <TouchableOpacity className="bg-primary" style={styles.button} onPress={handlePress}>
      <Text className='text-4xl text-white'>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
});
