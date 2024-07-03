import GoodCard from '../../components/GoodCard';
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


export default function Bookmark() {
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
      <View className="bg-secondary h-full w-full">
        <View className="w-full h-16 bg-primary items-center justify-center">
          <Text className="font-psemibold text-3xl text-white">Vos biens</Text>
        </View>

        <View>
        <GoodCard
        title="Appart bessieres 02"
        textStyles="w-48"
        containerStyles="mt-2"
        rent='620'
      /> 
        
        </View>

      </View>
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  row: {
    flexDirection: 'row', // Arrange children in a row
  },
  card:{
    height:250,
    width:"40%",
    backgroundColor:"white",
    borderRadius:15,
    padding:10,
    elevation:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginLeft: '4%'
  },
  profileImg:{
    width:30,
    height:30,
    borderRadius:50,
    marginRight:10,
  },
});