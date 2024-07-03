import { Text, View, Image, StyleSheet } from 'react-native'
import { SplashScreen, Stack} from 'expo-router'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import "../global.css"
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

  if (!fontsLoaded && !error) return null;

  return (
    <GestureHandlerRootView>
    <BottomSheetModalProvider>
      <Stack>
        <Stack.Screen name = "index" options={{ headerShown: false}} />
        <Stack.Screen name = "(auth)" options={{ headerShown: false}} />
        <Stack.Screen name = "(tabs)" options={{
           headerLeft: () => (
            <View className="ml-7 mb-3">
              <Text className="font-psemibold">Level 4</Text>
              <View className="rounded-xl border-2 h-4 w-14 overflow-hidden">
                <View className="h-full w-2/4 bg-yellow-500 rounded-l-xl">
                </View>
              </View>
            </View>
          ),
           headerStyle: {
            backgroundColor:'#8783d1'
           },
           headerTitle: () =>(
            <View></View>
           ),
           headerRight:() => (
            <View className="justify-center items-center bg-secondary rounded-full mr-5 overflow-hidden h-10 w-10">
              <Image className="h-7 w-7 fill-primary"
                source={require('../assets/icons/profile.png')}
                />
            </View>
           )
           }} />
      </Stack>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default RootLayout

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelContainer: {
    alignItems: 'center',
    marginLeft: 10, // Adjust as needed for positioning
  },
  levelBarContainer: {
    width: 60,
    height: 15,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    justifyContent: 'center',
    overflow: 'hidden', // Ensure the gradient doesn't overflow the container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 12,
  },
  levelBar: {
    width: '50%', // Adjust this value to represent the level progress
    height: '100%',
    borderRadius: 10,
  },
});
