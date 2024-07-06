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
    <View style={{ padding: 15 }}>
      {rental.map((transaction) => (
        <TouchableOpacity
          key={transaction.id}
          onPress={() => handlePress()} // Exemple de gestionnaire de pression avec passage d'ID
          activeOpacity={0.7}
          style={[
            styles.card,
            containerStyles,
            isLoading ? { opacity: 0.8 } : null,
          ]}
          disabled={isLoading}
        >
          <View style={styles.cardContent}>
            <Text style={[styles.title, textStyles]}>
              {transaction.rental_name}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.rentText}>
              Loyer: <Text style={styles.rentValue}>442€</Text>
            </Text >
            <Text style={styles.rentText}>
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
    height: 240,
    width: '45%',
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: '#000',
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginBottom: 15,
  },
  cardContent: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'font-pmedium',
    fontSize: 16,
    width: 160,
    textAlign: 'center',
  },
  divider: {
    width: '75%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  rentText: {
    marginTop: 10,
    fontFamily: 'font-pregular',
    fontSize: 14,
  },
  rentValue: {
    color: 'green',
  },
});

export default PropertyCard;
