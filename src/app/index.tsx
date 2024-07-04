import { View, Text, ActivityIndicator } from 'react-native';
import * as React from 'react';
import * as FileSystem from'expo-file-system';
import { Asset } from 'expo-asset';
import { SQLiteProvider } from 'expo-sqlite/next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Create from "./forms/Create"

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
        
        </Stack.Navigator>
      </SQLiteProvider>
    </React.Suspense>
    </NavigationContainer>
  );
}

export default Index