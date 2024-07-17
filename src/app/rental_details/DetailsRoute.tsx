import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SummaryChart from '@/components/SummaryChart';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import Svg, { Path } from "react-native-svg"
import AddressIcon from '@/assets/icons/AddressIcon';
import { useSQLiteContext } from 'expo-sqlite/next';

const DétailsRoute = ({ rental, refresh }) => {
  const router = useRouter();
  const db = useSQLiteContext();
  const [tenantData, setTenantData] = useState({ numberOfTenants: 0, totalRentAmount: 0 });

  const fetchTenantData = useCallback(async () => {
    const tenants = await db.getAllAsync(`SELECT COUNT(*) as count, SUM(rent_amount) as totalRent FROM Tenant WHERE rental_id = ?`, [rental.id]);
    if (tenants.length > 0) {
      const totalRentAmount = tenants[0].totalRent ?? 0;
      setTenantData({ numberOfTenants: tenants[0].count, totalRentAmount });
    }
  }, [db, rental.id]);

  useEffect(() => {
    fetchTenantData();
  }, [fetchTenantData]);

  return (
    <ScrollView>
      <View className='justify-center items-center'>
        <SummaryChart rentalId={rental.id} refresh={refresh} />
        <View className="mt-5" style={styles.card}>
          <Text className='font-psemibold mt-2 mb-6'>Informations sur {rental.rental_name}</Text>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => router.push({
              pathname: '',
              params: {}
            })}
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30px"
              height="30px"
              viewBox="0 0 438.536 438.536"
              xmlSpace="preserve"
              enableBackground="new 0 0 438.536 438.536"
              fill={"#736ced"}
            >
              <Path d="M414.41 24.123C398.333 8.042 378.963 0 356.315 0H82.228C59.58 0 40.21 8.042 24.126 24.123 8.045 40.207.003 59.576.003 82.225v274.084c0 22.647 8.042 42.018 24.123 58.102 16.084 16.084 35.454 24.126 58.102 24.126h274.084c22.648 0 42.018-8.042 58.095-24.126 16.084-16.084 24.126-35.454 24.126-58.102V82.225c-.001-22.649-8.043-42.021-24.123-58.102zM155.316 365.445H73.089v-82.228l155.316-155.311 82.221 82.224-155.31 155.315zm199.853-199.853l-26.262 26.269-82.228-82.229 26.262-26.265c5.331-5.325 11.8-7.993 19.417-7.993 7.611 0 14.086 2.664 19.41 7.993l43.4 43.398c5.324 5.327 7.994 11.798 7.994 19.414.001 7.613-2.661 14.083-7.993 19.413z" />
              <Path d="M100.502 294.642L100.502 310.623 127.91 310.623 127.91 338.038 143.896 338.038 158.744 323.189 115.347 279.789z" />
              <Path d="M141.901 252.385c-3.237 3.23-3.521 6.084-.859 8.562 2.474 2.67 5.33 2.382 8.566-.855l83.081-83.083c3.237-3.23 3.519-6.086.855-8.561-2.478-2.667-5.328-2.383-8.562.855l-83.081 83.082z" />
            </Svg>
          </TouchableOpacity>

          <View className='flex-row items-center ml-1'>
            <AddressIcon/>
            <View className='ml-4 flex-col'>
              <Text>{rental.rental_street}</Text>
              <Text>{rental.rental_postal_code} {rental.rental_city} </Text>
              <Text className='font-pregular'>{rental.country}</Text>
            </View>
          </View>
          <View className=' mt-4 flex-row items-center'>
            <Svg
             width="40px"
             height="40px"
             viewBox="0 0 24 24"
             fill="none"
             xmlns="http://www.w3.org/2000/svg"
           >
             <Path
               fillRule="evenodd"
               clipRule="evenodd"
               d="M16.5 7.063C16.5 10.258 14.57 13 12 13c-2.572 0-4.5-2.742-4.5-5.938C7.5 3.868 9.16 2 12 2s4.5 1.867 4.5 5.063zM4.102 20.142C4.487 20.6 6.145 22 12 22c5.855 0 7.512-1.4 7.898-1.857a.416.416 0 00.09-.317C19.9 18.944 19.106 15 12 15s-7.9 3.944-7.989 4.826a.416.416 0 00.091.317z"
               fill="#736ced"
             />
           </Svg>
            <View className='ml-4 flex-col'>
              <Text className='font-pregular'>{tenantData.numberOfTenants} locataire(s)</Text>
              <Text className='font-pregular'>+{tenantData.totalRentAmount}€ / mois</Text>
            </View>  
          </View>
          <View className=' mt-4 flex-row items-center'>
          <Svg
            width="40px"
            height="40px"
            viewBox="-4.5 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >     
            <Path 
            fill={'#736ced'}
            d="M19.469 12.594l3.625 3.313c.438.406.313.719-.281.719h-2.719v8.656c0 .594-.5 1.125-1.094 1.125h-4.719v-6.063c0-.594-.531-1.125-1.125-1.125h-2.969c-.594 0-1.125.531-1.125 1.125v6.063H4.343c-.594 0-1.125-.531-1.125-1.125v-8.656H.53c-.594 0-.719-.313-.281-.719l10.594-9.625c.438-.406 1.188-.406 1.656 0l2.406 2.156V6.719c0-.594.531-1.125 1.125-1.125h2.344c.594 0 1.094.531 1.094 1.125v5.875z" />
          </Svg>
          <View className='ml-4 flex-col'>
            <Text className='font-pregular'>{rental.surface_area}m²</Text>
          </View>  
          </View>
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
  iconContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
});

export default DétailsRoute;
