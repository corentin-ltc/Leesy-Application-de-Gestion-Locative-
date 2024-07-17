import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { Link, Redirect, router} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from "../constants"
import "../global.css"
import CustomButton from '../components/CustomButton';

export default function Welcome() {
  return (
    <SafeAreaView style = {{ backgroundColor: '#2c2e2e' }}>
     <ScrollView contentContainerStyle={{ height: '100%'}}>
      <View className="w-full justify-center items-center min-h-[65vh]">
      <Image
        source={images.logo}
        className="w-[150px] h-[150px] mt-7"
        resizeMode='contain'
      />
      <Text 
      className={"text-4xl mt-7 font-psemibold"} style={{ color:"white" }}>Bonjour !
      </Text>
      <Text 
      className={"text-1xl mt-6 font-pregular"} style={{ color:"white" }} >Je suis Leesy, votre agent de gestion locative.
      </Text>

      <CustomButton
        title="Ajouter un bien"
        handlePress={() => router.push('./../home')}
        containerStyles="w-10/12 mt-64"
      />
      <CustomButton
        title="Se connecter"
        handlePress={() => router.push('./../sign-in')}
        containerStyles="w-10/12 mt-7"
      />
      </View>
     </ScrollView>
     <StatusBar backgroundColor='#2c2e2e'
      style='light' />
     </SafeAreaView>
  );
}