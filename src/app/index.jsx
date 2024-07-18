import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter
import React, { useState, useEffect, useRef } from 'react';
import AddRentalWelcome from './forms/AddRentalWelcome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from "../constants";
import "../global.css";
import CustomButton from '../components/CustomButton';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useSQLiteContext } from 'expo-sqlite/next';

export default function Welcome() {
  const bottomSheetModalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const snapPoints = ["100%"];
  const router = useRouter(); // Get the router object
  const db = useSQLiteContext();

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  }


  function handleCloseModal() {
    bottomSheetModalRef.current?.dismiss();
    setIsOpen(false);
  }

  function handleSave() {
    handleCloseModal();
    router.replace('/home'); // Navigate to the tabs route after saving
  }

  if (userExists) {
    return null; // Render nothing while redirecting
  }

  return (
    <SafeAreaView className='bg-secondary'>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center min-h-[65vh]">
          <Image
            source={images.logo}
            className="w-[150px] h-[150px] mt-7"
            resizeMode='contain'
          />
          <Text 
            className={"text-4xl mt-7 font-psemibold"} 
            style={{ color: "black" }}
          >
            Bonjour !
          </Text>
          <Text 
            className={"text-1xl mt-6 font-pregular"} 
            style={{ color: "black" }}
          >
            Je suis Leesy, votre agent de gestion locative.
          </Text>

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 50 }}
            onDismiss={handleCloseModal}
          >
            <AddRentalWelcome onClose={handleCloseModal} onSave={handleSave} />
          </BottomSheetModal>
          <CustomButton
            title="Commencer"
            handlePress={handlePresentModal}
            containerStyles="w-10/12 mt-64"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#2c2e2e' style='light' />
    </SafeAreaView>
  );
}
