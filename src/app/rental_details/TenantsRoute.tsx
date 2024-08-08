import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, ScrollView, StyleSheet, Image, Text } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useFocusEffect } from '@react-navigation/native';
import AddButton from '../../components/AddButton';
import AddTenant from '../forms/AddTenant';
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import TenantCard from '@/components/TenantCard';
import { images } from "../../constants";


const TenantsRoute = ({ rentalId }) => {
  const db = useSQLiteContext();
  const [tenants, setTenants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchTenants = useCallback(async () => {
    const result = await db.getAllAsync(`SELECT * FROM Tenant WHERE rental_id = ?;`, [rentalId]);
    setTenants(result);
  }, [db, rentalId]);

  useFocusEffect(
    useCallback(() => {
      fetchTenants();
    }, [fetchTenants])
  );

  const handleDeleteTenant = useCallback(async (id) => {
    await db.runAsync(`DELETE FROM Tenant WHERE id = ?`, [id]);
    fetchTenants(); // Refresh the tenants list
  }, [db, fetchTenants]);

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
    fetchTenants();
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {tenants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Vous n'avez pas encore ajouter de locataires.
            </Text>
            <Image
              source={images.tenants}
              style={styles.image}
              resizeMode='contain'
            />
            <Text style={styles.emptyText}>
              Cliquez en bas à droite pour en ajouter !
            </Text>
          </View>
        ) : (
          <View style={styles.container}>
            {tenants.map((tenant) => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                deleteTenant={handleDeleteTenant}
                handlePress={() => {}}
              />
            ))}
          </View>
        )}
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ borderRadius: 50 }}
        onDismiss={() => setIsOpen(false)}
      >
        <AddTenant rentalId={rentalId} onClose={handleCloseModal} />
      </BottomSheetModal>
      <AddButton handlePress={handlePresentModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: "Poppins-Regular"
  },
});

export default TenantsRoute;
