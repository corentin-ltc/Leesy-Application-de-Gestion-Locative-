import PropertyCard from '../../components/PropertyCard';
import AddButton from '../../components/AddButton';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from "react-native";
import { useSQLiteContext } from 'expo-sqlite/next';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import AddRental from '../forms/AddRental';

export default function Bookmark() {
  const [rentals, setRentals] = useState([]);
  const db = useSQLiteContext();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  async function getData() {
    const result = await db.getAllAsync(`
      SELECT r.*, 
        IFNULL((SELECT SUM(t.rent_amount) FROM Tenant t WHERE t.rental_id = r.id), 0) as totalRent,
        (SELECT COUNT(*) FROM Tenant t WHERE t.rental_id = r.id) as numberOfTenants
      FROM Rental r;
    `);
    setRentals(result);
  }

  async function deleteRental(id) {
    db.withTransactionAsync(async () => {
      await db.runAsync('DELETE FROM Rental WHERE id = ?;', [id]);
      await getData();
    });
  }

  const { width } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);

  const bottomSheetModalRef = useRef(null);

  const snapPoints = ["100%"];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  }

  function handleCloseModal() {
    bottomSheetModalRef.current?.dismiss();
    setIsOpen(false);
    getData(); // Refresh the list when modal is closed
  }

  return (
    <View className="h-full bg-primary">
      <ScrollView>
        <View className="bg-secondary h-full w-full">
          <View className="w-full h-16 bg-primary items-center justify-center">
            <Text className="font-psemibold text-3xl text-white">Vos biens</Text>
          </View>
          <View className="flex-row flex-wrap mt-6">
            {rentals.map((rental) => (
              <PropertyCard 
                key={rental.id}
                rental={rental}
                totalRent={rental.totalRent}  // Pass totalRent prop
                numberOfTenants={rental.numberOfTenants}  // Pass numberOfTenants prop
                deleteRental={deleteRental}
                handlePress={() => router.push(`./../rental_details/${rental.id}`)}
              />
            ))}
          </View>
          <View className="bg-secondary h-52 mt-52"></View>
        </View>
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ borderRadius: 50 }}
        onDismiss={handleCloseModal}
      >
        <AddRental onClose={handleCloseModal}/>
      </BottomSheetModal>
      <AddButton handlePress={handlePresentModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  card: {
    height: 250,
    width: "40%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginLeft: '4%',
  },
  profileImg: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
});
