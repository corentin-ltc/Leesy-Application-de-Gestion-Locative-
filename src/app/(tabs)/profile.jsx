import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';
import { useAuth } from '../../../provider/AuthProvider';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const Profile = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Text>Profile</Text>
      <TouchableOpacity onPress={signOut}>
              <Ionicons name="log-out-outline" size={30} color={'black'} />
      </TouchableOpacity>
    </View>
  )
}

export default Profile