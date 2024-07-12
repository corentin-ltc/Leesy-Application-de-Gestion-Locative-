import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { Tenant } from '../app/types'; // Assuming you have a Tenant type defined
import { Link } from 'expo-router';

interface TenantCardProps {
  tenant: Tenant;
  deleteTenant: (id: number) => Promise<void>;
  handlePress: () => void;
  containerStyles?: any;
  textStyles?: any;
  isLoading?: boolean;
}

const TenantCard: React.FC<TenantCardProps> = ({
  tenant,
  deleteTenant,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {

  const handleLongPress = () => {
    Alert.alert(
      'Supprimer le locataire',
      `Etes-vous certain de vouloir supprimer ${tenant.first_name} ${tenant.last_name} ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: () => deleteTenant(tenant.id),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableOpacity
      key={tenant.id}
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
          {tenant.first_name} {tenant.last_name}
        </Text>
        <View className="w-3/4 mt-2 items-center bg-gray-400" style={{ height: 1 }}></View>
      </View>
      <Text className="font-pregular">
        Téléphone: <Text className="text-green-600">{tenant.phone_number}</Text>
      </Text>
      <Text className="font-pregular">
        Email: <Text className="text-green-600">{tenant.email_address}</Text>
      </Text>
      <Text className="font-pregular">
        Loyer: <Text className="text-green-600">{tenant.rent_amount}€</Text>
      </Text>
      <Text className="font-pregular">
        Charges: <Text className="text-green-600">{tenant.charges}€</Text>
      </Text>
      <Text className="font-pregular">
        Dépôt de garantie: <Text className="text-green-600">{tenant.security_deposit}€</Text>
      </Text>
      <Text className="font-pregular">
        Informations: <Text className="text-green-600">{tenant.additional_info}</Text>
      </Text>
      <Text className="font-pregular">
        Ville: {tenant.city}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 230,
    width: '100%',
    borderColor: '#000',
    marginBottom: '6.5%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: "white",
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.15,
  },
});

export default TenantCard;
