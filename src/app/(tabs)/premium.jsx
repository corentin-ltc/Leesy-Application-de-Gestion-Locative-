import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { images } from "../../constants"
import CustomButton from '../../components/CustomButton';
import { ScrollView } from 'react-native-gesture-handler';

const Premium = () => {
  return (
    <View className="justify-center items-center h-full">
      <Image
        source={images.logo}
        className="w-[150px] h-[150px] mt-7"
        resizeMode='contain'
      />
      <Text className="font-pregular text-center w-3/4">
        Vous devez être un membre premium pour débloquer toutes les fonctionnalités.
      </Text>
      <CustomButton
        title="Devenir membre premium"
        handlePress={() => router.push('./../sign-in')}
        containerStyles="w-10/12 mt-7"
      />
    </View>
  )
}

export default Premium
