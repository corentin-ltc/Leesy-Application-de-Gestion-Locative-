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
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Auth } from "../../components/Auth"

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
    <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center">
          <Button title="Bouton inscription" onPress={handlePresentModal} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  title: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 16,
  },
  subtitle: {
    color: "#101318",
    fontSize: 14,
    fontWeight: "bold",
  },
  description: {
    color: "#56636F",
    fontSize: 13,
    fontWeight: "normal",
    width: "100%",
    textAlign: "center",
  },
});
