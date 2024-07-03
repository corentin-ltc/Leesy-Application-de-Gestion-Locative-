import {TouchableOpacity, Text, StyleSheet, Image, View} from 'react-native'
import React from 'react'
import Svg, { G, Path } from "react-native-svg"
import "../global.css"
import { images } from "../constants"


const CustomButton = ({ title, handlePress, containerStyles, 
    textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.8}
        className={`rounded-xl min-h-[62px] items-center justify-center
          ${containerStyles} ${isLoading ? 'opacity-80' : ''}`} 
          disabled={isLoading}
          style={styles.card}
          >
      <Image 
        source={images.logo}
        className="w-[80px] h-[80px] mr-5"
        resizeMode='contain'
        />
      <Text 
        className={`${textStyles} font-pregular text-base mr-7`}>
            {title}
      </Text>
      <View className="bg-primary overflow-hidden h-2/5 rounded-full justify-center">
        <Svg
        width="30px"
        height="30px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
        <Path
          d="M5 12h14m0 0l-6-6m6 6l-6 6"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  card:{
    height:100,
    width:"92%",
    backgroundColor:"white",
    borderRadius:15,
    borderColor:'#000',
    padding:10,
    elevation:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    position: 'absolute',
    marginLeft: '4%',
    flexDirection: 'row'
  },
  profileImg:{
    width:30,
    height:30,
    borderRadius:50,
    marginRight:10,
  },
});
