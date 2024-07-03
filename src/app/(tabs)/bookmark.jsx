import { View, Text , StyleSheet} from 'react-native'
import React from 'react'
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";


const Bookmark = () => {
  return (

    <View className="h-full bg-primary" >
    <ScrollView contentContainerStyle={{ height: '100%'}}>
      <View className="bg-secondary h-full w-full">
        <View className="w-full h-16 bg-primary items-center justify-center">
          <Text className="font-psemibold text-3xl text-white">Vos biens</Text>
        </View>



      </View>
    </ScrollView>
    </View>
  )
}

export default Bookmark

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  row: {
    flexDirection: 'row', // Arrange children in a row
  },
  card:{
    height:250,
    width:"40%",
    backgroundColor:"white",
    borderRadius:15,
    padding:10,
    elevation:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginLeft: '4%'
  },
  profileImg:{
    width:30,
    height:30,
    borderRadius:50,
    marginRight:10,
  },
});