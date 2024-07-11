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
        className={`rounded-full min-h-[62px] justify-center items-center bg-primary
        ${containerStyles} ${isLoading ? 'opacity-50' : ''}`} 
        disabled={isLoading}
     >
      <Text 
        className={`${textStyles} font-psemibold text-lg text-white`}>
            {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton