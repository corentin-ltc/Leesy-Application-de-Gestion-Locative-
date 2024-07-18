import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import React, { useState, useEffect } from 'react';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite/next';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { AuthProvider, useAuth } from "../../provider/AuthProvider";

import UserIcon from '../assets/icons/UserIcon';
import ArrowBackIcon from '../assets/icons/ArrowBackIcon';

SplashScreen.preventAutoHideAsync();

const loadDataBase = async () => {
  const dbName = 'SQLiteDB.db';
  const dbAsset = require('../assets/SQLiteDB.db');
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

const fetchUsername = async (db, setUsername) => {
  try {
    const result = await db.getAllAsync('SELECT USERNAME FROM User ');    
    setUsername(result[0].USERNAME);
    console.log(result[0].USERNAME);
  } catch (error) {
    console.error('Error fetching username:', error);
  }
};

const InitialLayout = ({ children, setUsername }) => {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const db = useSQLiteContext();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      console.log("you are logged");
      router.replace('/home');
    } else if (!session && !inAuthGroup) {
      console.log("you are not logged");
    }
  }, [session, initialized, segments, router]);

  useEffect(() => {
    const initializeUser = async () => {
      await fetchUsername(db, setUsername);
    };

    initializeUser();
    
  }, [session, db, setUsername]);

  return children;
};

const RootLayout = () => {
  const [dbLoaded, setDbLoaded] = useState(false);
  const [username, setUsername] = useState('');
  useEffect(() => {
    const initDb = async () => {
      try {
        await loadDataBase();
        setDbLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };

    initDb();
  }, []);

  const [fontsLoaded, error] = useFonts({
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  const { signOut, session } = useAuth();

  useEffect(() => {
    if (error) {
      console.error(error);
      return;
    }
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!dbLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <SQLiteProvider databaseName="SQLiteDB.db">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <InitialLayout setUsername={setUsername}>
              <Stack className="bg-secondary" screenOptions={{ headerShadowVisible: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="forms/AddRental" options={{ headerShown: false }} />
                <Stack.Screen name="rental_details/[id]" options={{
                  title: '',
                  headerRight: () => (
                    <View className="flex-row items-center">
                        <Text className="font-psemibold text-gray mr-2">
                          {username}
                        </Text>
                        <View className="mb-1">
                          <UserIcon />
                        </View>
                      </View>
                  ),
                  headerLeft: () => (
                    <TouchableOpacity onPress={useRouter().back}>
                      <ArrowBackIcon />
                    </TouchableOpacity>
                  ),
                  headerLargeTitle: false,
                  headerTransparent: true,
                  headerTintColor: 'white',
                  headerStyle: {
                    backgroundColor: '#736ced',
                    borderBottomWidth: 0,
                  },
                }} />
                <Stack.Screen name="(tabs)"
                  options={{
                    headerLeft: () => (
                      <View className="ml-4 mb-3 border-0 items-center justify-center">
                        <Text className="font-psemibold ml-1 text-gray">Niveau 4</Text>
                        <View className="rounded-xl border-2 h-4 w-14 overflow-hidden bg-gray border-gray">
                          <View className="h-full w-2/4 bg-yellow-500 rounded-l-xl">
                          </View>
                        </View>
                      </View>
                    ),
                    headerStyle: {
                      backgroundColor: '#736ced',
                      borderBottomWidth: 0,
                    },
                    headerTitle: () => (
                      <Text></Text>
                    ),
                    headerRight: () => (
                      <View className="flex-row items-center">
                        <Text className="font-psemibold text-gray mr-2">
                          {username}
                        </Text>
                        <View className="mb-1">
                          <UserIcon />
                        </View>
                      </View>
                    )
                  }} />
              </Stack>
            </InitialLayout>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SQLiteProvider>
    </AuthProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
