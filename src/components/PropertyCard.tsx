import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Rental } from '../app/types';

interface PropertyCardProps {
  rental: Rental[];
  deleteTransaction: (id: number) => Promise<void>;
  handlePress: () => void;
  containerStyles?: any;
  textStyles?: any;
  isLoading?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  rental,
  deleteTransaction,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  
  return (
    <View className='flex-row flex-wrap'>
      {rental.map((transaction) => (
        <TouchableOpacity
          key={transaction.id}
          onPress={() => handlePress()} // Exemple de gestionnaire de pression avec passage d'ID
          activeOpacity={0.7}
          className={`rounded-xl min-h-[62px] mt-6
            ${containerStyles} ${isLoading ? 'opacity-80' : ''}`} 
          style={styles.card}
          
          disabled={isLoading}
        >
          <View className="items-center">
            <Text className={`${textStyles} font-pmedium text-base w-48 text-center`}>
              {transaction.rental_name}
            </Text>
            <View className = "w-3/4 mt-2 items-center bg-gray-400" style={{ height: 1 }}></View>
            <Text className="font-pregular">
              Loyer: <Text className='text-green'>442€</Text>
            </Text >
            <Text className="font-pregular">
            {transaction.rental_city}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
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
