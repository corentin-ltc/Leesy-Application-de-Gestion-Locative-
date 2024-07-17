import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { Rental } from '../app/types';
import Svg, { Path } from "react-native-svg";

interface PropertyCardProps {
  rental: Rental;
  deleteRental: (id: number) => Promise<void>;
  handlePress: () => void;
  containerStyles?: any;
  textStyles?: any;
  isLoading?: boolean;
  totalRent: number | null | undefined;
  numberOfTenants: number | null | undefined;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  rental,
  deleteRental,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  totalRent,
  numberOfTenants,
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
      style={[styles.card, containerStyles, isLoading ? { opacity: 0.8 } : {}]}
      disabled={isLoading}
    >
      <View style={styles.header}>
        <Text style={[styles.title, textStyles]}>
          {rental.rental_name}
        </Text>
        <View style={styles.divider}></View>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>
          Loyer: <Text style={styles.rent}>{totalRent ? totalRent : 0}€</Text>
        </Text>
        <View style={styles.address}>
          <Text style={styles.text}>{rental.rental_street}</Text>
          <Text style={styles.text}>{rental.rental_postal_code} {rental.rental_city}</Text>
          <Text style={styles.text}>{rental.country}</Text>
        </View>
        <View style={styles.tenantsContainer}>
          <Text style={styles.text}>
            <Text style={styles.tenants}>{numberOfTenants ? numberOfTenants : 0}</Text>
          </Text>
          <Svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={styles.icon}
          >
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.5 7.063C16.5 10.258 14.57 13 12 13c-2.572 0-4.5-2.742-4.5-5.938C7.5 3.868 9.16 2 12 2s4.5 1.867 4.5 5.063zM4.102 20.142C4.487 20.6 6.145 22 12 22c5.855 0 7.512-1.4 7.898-1.857a.416.416 0 00.09-.317C19.9 18.944 19.106 15 12 15s-7.9 3.944-7.989 4.826a.416.416 0 00.091.317z"
              fill="#736ced"
            />
          </Svg>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 230,
    width: '40%',
    borderColor: '#000',
    marginBottom: '6.5%',
    marginLeft: '6.5%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: "white",
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.15,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    width: '75%',
    height: 1,
    backgroundColor: 'gray',
    marginTop: 8,
  },
  content: {
    alignItems: 'flex-start',
    marginTop: 10,
  },
  text: {
    fontSize: 14,
  },
  rent: {
    color: 'green',
    fontWeight: '600',
  },
  address: {
    marginTop: 8,
  },
  tenantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tenants: {
    fontWeight: '600',
    fontSize: 14,
  },
  icon: {
    marginLeft: 5,
  },
});

export default PropertyCard;
