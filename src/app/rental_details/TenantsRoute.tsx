import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';
import AddButton from '../../components/AddButton';
import AddTenant from '../forms/AddTenant';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import TenantCard from '@/components/TenantCard';

const TenantsRoute = ({ rentalId }) => {
  const db = useSQLiteContext();
  const [tenants, setTenants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchTenants = useCallback(async () => {
    const result = await db.getAllAsync(`SELECT * FROM Tenant WHERE rental_id = ?;`, [rentalId]);
    setTenants(result);
  }, [db, rentalId]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

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
      <View className='h-full'>
      <View>
        <ScrollView>
          <View style={styles.container}>
            {tenants.map((tenant) => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                deleteTenant={handleDeleteTenant}
                handlePress={() => {}} // Add functionality as needed
              />
            ))}
          </View>
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
      </View>
      <View >
        <AddButton handlePress={handlePresentModal} />
      </View>
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
});

export default TenantsRoute;
