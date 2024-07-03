import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
  Image,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { Auth } from "../../components/Auth"
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants"


export default function Home() {
  const [darkmode, setDarkmode] = useState(false);
  const [device, setDevice] = useState(false);
  const { width } = useWindowDimensions();
  const [theme, setTheme] = useState("dim");
  const [isOpen, setIsOpen] = useState(false);

  const bottomSheetModalRef = useRef(null);

  const snapPoints = ["50%"];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  }


  return (
    <View className="h-full bg-primary" >
    <ScrollView contentContainerStyle={{ height: '100%'}}>
      <View className="bg-white h-full">

      <View className="w-full h-32">
        <View className="w-full h-16 bg-primary"></View>
        <View className="w-full h-16 bg-gray-50"></View>
        <View className="bg-white rounded-2xl border-2 b bg-slate-400order-primary  w-11/12 absolute top-1/4 ml-1" style={{ marginLeft: '4.00%' }}>
        <Image
        source={images.logo}
        className="w-[100px] h-[100px]"
        resizeMode='contain'
        />
      <View className="w-full justify-center items-center min-h-[65vh] absolute">
    <GestureHandlerRootView className="flex-1">
        <View>
          <Button title="Pensez à sécurisez vos données en créant un compte !" onPress={handlePresentModal} color="#000000" />
          <StatusBar style="auto" />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 50 }}
            onDismiss={() => setIsOpen(false)}
            >
            <View className="px-5 justify-center items-center">
              <Text className="font-psemibold text-2xl tracking-wide">
                Création de compte
              </Text>
               <Text className="w-full color-slate-500 text-center  mt-4"> 
                Créez votre compte afin de sécuriser vos données.
              </Text>
              <View
                style={{
                  width: width,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: "gray",
                  marginVertical: 30,
                }}
                />
              <Auth />
            </View>
          </BottomSheetModal>
        </View>
    </GestureHandlerRootView>
    <View className="bg-slate-200">
      <Text>Test</Text>
    </View>
  </View>
      </View>
        </View>
                </View>
    </ScrollView>
    </View>
  );
}

