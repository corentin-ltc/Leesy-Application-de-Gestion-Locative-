import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from '../components/CustomButton'
import { Link, Redirect, router} from 'expo-router';


const index = () => {
  return (
    <View>
   <CustomButton  
        title="Tabs"
        handlePress={() => router.push('../home')}
        containerStyles="w-10/12 mt-7"
      />
      <CustomButton  
      title="Se connecter"
      handlePress={() => router.push('../sign-in')}
      containerStyles="w-10/12 mt-7"
    />
    </View>
  )
}

export default index

const styles = StyleSheet.create({})