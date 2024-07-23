import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { SplashScreen, Stack, useRouter, useSegments, router } from 'expo-router';
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
import { UsernameProvider, useUsername } from '../utils/UserContext';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

const loadDataBase = async () => {
  const localFolder = FileSystem.documentDirectory + 'SQLite';
  const dbName = 'SQLiteDB.db';
  const localURI = localFolder + '/' + dbName;

  const folderInfo = await FileSystem.getInfoAsync(localFolder);
  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(localFolder, { intermediates: true });
  }

  let asset = Asset.fromModule(require('../assets/SQLiteDB.db'));

  if (!asset.downloaded) {
    await asset.downloadAsync();
  }

  let remoteURI = asset.localUri || asset.uri;

  if (asset.localUri || asset.uri.startsWith('asset') || asset.uri.startsWith('file')) {
    await FileSystem.copyAsync({
      from: remoteURI,
      to: localURI,
    }).catch(error => {
      console.log('local copyDatabase - finished with error: ' + error);
    });
  } else if (asset.uri.startsWith('http') || asset.uri.startsWith('https')) {
    await FileSystem.downloadAsync(remoteURI, localURI)
      .catch(error => {
        console.log('local downloadAsync - finished with error: ' + error);
      });
  }
};

const fetchUsernameAndXpPoints = async (db, setUsername, setXpPoints, setProfilePicture) => {
  try {
    const result = await db.getAllAsync('SELECT USERNAME, xpPoints, profile_picture FROM User');
    if (result[0].USERNAME === "")
      setUsername("Leeser");
    else 
      setUsername(result[0].USERNAME);
    setXpPoints(result[0].xpPoints);
    setProfilePicture(result[0].profile_picture); // Set profile picture
  } catch (error) {
    console.error('Error fetching username and xpPoints:', error);
  }
};

const InitialLayout = ({ children }) => {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const db = useSQLiteContext();
  const { setUsername, setXpPoints, setProfilePicture } = useUsername();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      router.replace('/home');
    } else if (!session && !inAuthGroup) {
    }
  }, [session, initialized, segments, router]);

  useEffect(() => {
    const initializeUser = async () => {
      await fetchUsernameAndXpPoints(db, setUsername, setXpPoints, setProfilePicture);
    };

    initializeUser();
    
  }, [session, db, setUsername, setXpPoints, setProfilePicture]);

  return children;
};

const RootLayout = () => {
  const [dbLoaded, setDbLoaded] = useState(false);
  const [username, setUsername] = useState('');
  const [xpPoints, setXpPoints] = useState(0);

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
      <UsernameProvider>
        <SQLiteProvider databaseName="SQLiteDB.db">
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <InitialLayout>
                <Stack className="bg-secondary" screenOptions={{ headerShadowVisible: false }}>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="forms/AddRental" options={{ headerShown: false }} />
                  <Stack.Screen name="achievements/Achievements" options={{ headerShown: false }} />
                  <Stack.Screen name="achievements/achievementsUtils" options={{ headerShown: false }} />
                  <Stack.Screen name="rental_details/[id]" options={{
                    title: '',
                    headerRight: () => (
                      <View className="flex-row items-center">
                        <HeaderUsername />
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
                        <HeaderLevelAndProgress />
                      ),
                      headerStyle: {
                        backgroundColor: '#736ced',
                        borderBottomWidth: 0,
                      },
                      headerTitle: () => (
                        <Text></Text>
                      ),
                      headerRight: () => (
                        <HeaderUsername />
                      )
                    }} />
                </Stack>
                <Toast />
              </InitialLayout>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SQLiteProvider>
      </UsernameProvider>
    </AuthProvider>
  );
};

const HeaderUsername = () => {
  const { username, profilePicture } = useUsername();
  return (
    <View className="flex-row items-center">
      <Text className="font-psemibold text-gray mr-2">
        {username}
      </Text>
      {profilePicture ? (
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
      ) : (
        <View className="mb-1">
          <UserIcon />
        </View>
      )}
    </View>
  );
};

const HeaderLevelAndProgress = () => {
  const { xpPoints } = useUsername();
  const level = Math.floor(xpPoints / 100) + 1;
  const xpProgress = xpPoints % 100;

  return (
    <TouchableOpacity 
    onPress={() => router.push('../achievements/Achievements')}
    className="ml-4 mb-3 border-0 items-center justify-center">
      <Text className="font-psemibold ml-1 mt-1 text-gray">Niveau {level}</Text>
      <View className="rounded-xl border-2 h-4 w-14 overflow-hidden bg-gray border-gray">
        <View className="h-full rounded-l-xl" style={{ width: `${xpProgress}%`, backgroundColor:"#32bea6" }}>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 35,
    height: 35,
    borderRadius: 15,
  },
});
