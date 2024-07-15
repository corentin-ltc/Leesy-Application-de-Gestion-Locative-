import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import SummaryChart from '@/components/SummaryChart';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';

const DétailsRoute = ({ rental, refresh }) => {
  const router = useRouter();

  return (
    <ScrollView>
      <View className='justify-center items-center'>
        <SummaryChart rentalId={rental.id} refresh={refresh} />
        <View className="mt-5" style={styles.card}>
          <Text>Nom de la location: {rental.rental_name}</Text>
          <Text>Adresse: {rental.address}</Text>
          <Text>Prix: {rental.price}</Text>
          <Text>Description: {rental.description}</Text>
        </View>
        <CustomButton
          title="Voir les documents"
          handlePress={() => router.push({ pathname: './Files', params: { rentalId: rental.id } })}
          containerStyles="w-10/12 mt-7"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: "white",
    width: '92%',
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.15,
  },
});

export default DétailsRoute;
