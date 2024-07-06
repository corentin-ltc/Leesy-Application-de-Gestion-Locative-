import { View, Text, ActivityIndicator } from 'react-native';
import * as React from 'react';
import * as FileSystem from'expo-file-system';
import { Asset } from 'expo-asset';
import { SQLiteProvider } from 'expo-sqlite/next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Create from "./forms/Create"
import Home from "./(tabs)/home"
import {  Image, StyleSheet } from 'react-native'
import { SplashScreen } from 'expo-router'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import "../global.css"
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { G, Path } from "react-native-svg"
const Stack = createNativeStackNavigator();

const loadDataBase=async () => {
  const dbName = "SQLiteDB.db";
  const dbAsset = require("../assets/SQLiteDB.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePAth = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePAth);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePAth);
  }
}

const Index = () => {
  const [dbLoaded, setDbLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadDataBase()
    .then(() => setDbLoaded(true))
    .catch((e) => console.error(e));
  },[]);
  if (!dbLoaded) return (
    <View className="flex-1">
      <ActivityIndicator size={"large"} />
      <Text> Loading...</Text>
    </View>
  )
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
    <NavigationContainer independent={true}>
    <React.Suspense
    fallback={
     <View className="flex-1 bg-primary">
     <ActivityIndicator size={"large"} />
     <Text> To do: add a loading animation</Text>
     </View>
    }
    >
      <SQLiteProvider databaseName='SQLiteDB.db'useSuspense>
        <Stack.Navigator>
          <Stack.Screen name ="Create" component={Create}/>
                 <Stack.Screen component={Home} name = "(tabs)" options={{
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
                     backgroundColor:'#14bdeb',
                    },
                    headerTitle: () =>(
                     <View></View>
                    ),
                    headerRight:() => (
                     <View className="flex-row items-center">
                       <Text className="font-psemibold text-gray mr-2">
                         Corentin
                         </Text>
                         <View className="mb-1">
                    
                       <Svg
               width="40px"
               height="40px"
               viewBox="0 0 24 24"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
               >
               <Path
                 d="M22 12c0-5.51-4.49-10-10-10S2 6.49 2 12c0 2.9 1.25 5.51 3.23 7.34 0 .01 0 .01-.01.02.1.1.22.18.32.27.06.05.11.1.17.14.18.15.38.29.57.43l.2.14c.19.13.39.25.6.36.07.04.15.09.22.13.2.11.41.21.63.3.08.04.16.08.24.11.22.09.44.17.66.24.08.03.16.06.24.08.24.07.48.13.72.19.07.02.14.04.22.05.28.06.56.1.85.13.04 0 .08.01.12.02.34.03.68.05 1.02.05.34 0 .68-.02 1.01-.05.04 0 .08-.01.12-.02.29-.03.57-.07.85-.13.07-.01.14-.04.22-.05.24-.06.49-.11.72-.19.08-.03.16-.06.24-.08.22-.08.45-.15.66-.24.08-.03.16-.07.24-.11.21-.09.42-.19.63-.3.08-.04.15-.09.22-.13.2-.12.4-.23.6-.36.07-.04.13-.09.2-.14.2-.14.39-.28.57-.43.06-.05.11-.1.17-.14.11-.09.22-.18.32-.27 0-.01 0-.01-.01-.02C20.75 17.51 22 14.9 22 12zm-5.06 4.97c-2.71-1.82-7.15-1.82-9.88 0-.44.29-.8.63-1.1 1A8.48 8.48 0 013.5 12c0-4.69 3.81-8.5 8.5-8.5 4.69 0 8.5 3.81 8.5 8.5 0 2.32-.94 4.43-2.46 5.97-.29-.37-.66-.71-1.1-1z"
                 fill="#FFFFFF"
               />
               <Path
                 d="M12 6.93c-2.07 0-3.75 1.68-3.75 3.75 0 2.03 1.59 3.68 3.7 3.74h.18a3.743 3.743 0 003.62-3.74c0-2.07-1.68-3.75-3.75-3.75z"
                 fill="#FFFFFF"
                 />
             </Svg>
                 </View>
                     </View>
                    )
                    }} />
        </Stack.Navigator>
      </SQLiteProvider>
    </React.Suspense>
    </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default Index