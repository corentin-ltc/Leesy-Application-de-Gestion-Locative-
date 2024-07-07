import { View, Text, SectionList } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'


const Page = () => {

    const { id } = useLocalSearchParams();
    console.log('id', id);

  return (

    <>
    <Stack.Screen options= {{ title:'Bitcoin'}} />
    <SectionList renderItem={({ item }) => (
        <Text>render item</Text>
    )}>

    </SectionList>
    </>
  );
};

export default Page