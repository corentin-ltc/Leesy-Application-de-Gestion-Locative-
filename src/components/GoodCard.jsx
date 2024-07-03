import {TouchableOpacity, Text, StyleSheet, Image, View} from 'react-native'
import React from 'react'
import Svg, { G, Path } from "react-native-svg"
import "../global.css"
import { images } from "../constants"
import { VirtualizedList } from 'react-native-web'


const GoodCard = ({ title, handlePress, containerStyles, 
    textStyles, isLoading, rent}) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7}
    className={`rounded-xl min-h-[62px]
      ${containerStyles} ${isLoading ? 'opacity-80' : ''}`} 
      disabled={isLoading}
      style={styles.card}
      >
    <View className="items-center">
      <Text 
        className={`${textStyles} font-pmedium text-base w-28 text-center`}>
            {title}
      </Text>
      <View className = "w-3/4 mt-2 items-center bg-gray-400" style={{ height: 1 }}></View>
    </View>
    <Text className=" mt-2 font-pregular">Loyer: <Text className="text-green-600"> {rent}€</Text></Text>
    </TouchableOpacity>
  )
}

export default GoodCard

const styles = StyleSheet.create({
  card:{
    height:230,
    width:"40%",
    backgroundColor:"white",
    borderRadius:15,
    borderColor:'#000',
    padding:10,
    elevation:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginLeft: '4%',
    flexDirection: 'col'
  },
  profileImg:{
    width:30,
    height:30,
    borderRadius:50,
    marginRight:10,
  },
});
