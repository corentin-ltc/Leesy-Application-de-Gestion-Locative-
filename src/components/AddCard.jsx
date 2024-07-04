import {TouchableOpacity, Text, StyleSheet, Image, View} from 'react-native'
import React from 'react'
import Svg, { Circle, Path } from "react-native-svg"
import "../global.css"
import { images } from "../constants"
import { VirtualizedList } from 'react-native-web'


const AddCard = ({ title, handlePress, containerStyles, 
    textStyles, isLoading, rent}) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7}
    className={`rounded-xl min-h-[62px] mt-6
      ${containerStyles} ${isLoading ? 'opacity-80' : ''}`} 
      disabled={isLoading}
      style={styles.card}
      >
    <View className="mt-6 items-center justify-center h-full">
    <Text className="text-9xl font-pthin justify-center">+</Text>
    </View>
    </TouchableOpacity>
  )
}

export default AddCard

const styles = StyleSheet.create({
  card:{
    height:230,
    width:"40%",
    backgroundColor:"white",
    borderRadius:15,
    borderColor:'blue',
    padding:10,
    elevation:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginLeft: '6.5%',
  },
  profileImg:{
    width:30,
    height:30,
    borderRadius:50,
    marginRight:10,
  },
});
