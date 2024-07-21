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
        className={`rounded-xl min-h-[62px] items-center justify-between
          ${containerStyles} ${isLoading ? 'opacity-80' : ''}`} 
          disabled={isLoading}
          style={styles.card}
          >
        <View className='ml-4 '>
       <Svg
      height="50px"
      width="50px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <Path
        d="M256 0C177.328 82.672 46.672 64 46.672 64v224C46.672 420 256 512 256 512s209.328-92 209.328-224V64S334.672 82.672 256 0z"
        fill="#32bea6"
      />
      <Path
        d="M240.88 355.664L148.048 283.152 167.728 257.936 233.632 309.376 340.576 151.888 367.04 169.856z"
        fill="#fff"
      />
       </Svg>
       </View>
      <Text 
        className={`${textStyles} font-pregular text-base mr-7`}>
            {title}
      </Text>
      <View style={styles.arrow}>
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
    borderRadius: 10,
    borderColor:'#32bea6',
    borderWidth: 2,
    marginLeft: '4%',
    flexDirection: 'row',
    overflow: "hidden"
  },
  arrow:{
    backgroundColor: '#32bea6', 
    overflow: 'hidden',
    height: '100%',
    width: 48, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImg:{
    width:30,
    height:30,
    borderRadius:50,
    marginRight:10,
  },
});
