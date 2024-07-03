import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import React from 'react'
import "../global.css"
import { images } from "../constants"

const CustomButton = ({ title, handlePress, containerStyles, 
    textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        className={`rounded-xl min-h-[62px] justify-center items-center 
        ${containerStyles} ${isLoading ? 'opacity-50' : ''}`} 
        disabled={isLoading}
        style={{ backgroundColor : '#8ebfb0'}}
     >
      <Text 
        className={`${textStyles} font-psemibold text-lg`}>
            {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton