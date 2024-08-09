import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
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
import { Auth } from "../../components/Auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import CustomButton from '../../components/CustomButton';
import GlobalSummaryChart from '@/components/GlobalSummaryChart';
import SignUpButton from '../../components/SignUpButton';
import RandomAdvice from '../../components/RandomAdvice'; // Import RandomAdvice
import { useAuth } from "../../../provider/AuthProvider"; // Import useAuth hook

export default function Home() {
  const [device, setDevice] = useState(false);
  const { width } = useWindowDimensions();
  const [theme, setTheme] = useState("dim");
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Get the user from the useAuth hook

  const bottomSheetModalRef = useRef(null);

  const snapPoints = ["50%"];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  }

  return (
    <View className="h-full bg-secondary">
      <View className="w-full h-16 bg-primary justify-center items-center">
      <Text className="font-psemibold text-3xl text-white">Vue d'ensemble</Text>
      </View>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="bg-secondary h-full mt-6">
          <View className="w-full h-full">
            <View>
              {!user ? (
                <SignUpButton
                  title="Sauvegardez vos données en créant un compte!"
                  handlePress={handlePresentModal}
                  textStyles="w-48 ml-3"
                />
              ) : (
                <RandomAdvice
                />
              )}
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
                  <Text className="w-full color-slate-500 text-center mt-4">
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
                  <TouchableOpacity>
                  <Text>S'inscrire avec Google</Text>
                  </TouchableOpacity>
                </View>
              </BottomSheetModal>
            </View>
            <View></View>
            <View className="justify-center items-center">
              <GlobalSummaryChart />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 130,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    position: 'absolute',
    marginLeft: '9%'
  },
  profileImg: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
});
