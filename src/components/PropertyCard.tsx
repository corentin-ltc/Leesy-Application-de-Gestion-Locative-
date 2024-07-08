import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { Rental } from '../app/types';
import { Link } from 'expo-router';

interface PropertyCardProps {
  rental: Rental;
  deleteRental: (id: number) => Promise<void>;
  handlePress: () => void;
  containerStyles?: any;
  textStyles?: any;
  isLoading?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  rental,
  deleteRental,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {

  const handleLongPress = () => {
    Alert.alert(
      'Supprimer le bien',
      `Etes-vous certain de vouloir supprimer ${rental.rental_name} ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: () => deleteRental(rental.id),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    
    <TouchableOpacity
      key={rental.id}
      onPress={() => handlePress()}
      onLongPress={handleLongPress}
      activeOpacity={0.5}
      className={`rounded-xl min-h-[62px] mt-6
        ${containerStyles} ${isLoading ? 'opacity-80' : ''}`} 
      style={styles.card}
      disabled={isLoading}
      >
      <View className="items-center">
        <Text className={`${textStyles} font-pmedium text-base w-48 text-center`}>
          {rental.rental_name}
        </Text>
        <View className="w-3/4 mt-2 items-center bg-gray-400" style={{ height: 1 }}></View>
      </View>
      <Text className="font-pregular">
        Loyer: <Text className="text-green-600">442€</Text>
      </Text>
      <Text className="font-pregular">
        {rental.rental_city}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 230,
    width: '40%',
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: '#000',
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginBottom: '6.5%',
    marginLeft: '6.5%',
  },
});

export default PropertyCard;
