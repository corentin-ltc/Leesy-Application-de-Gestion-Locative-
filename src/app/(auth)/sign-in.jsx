import { Image, View, Text, ScrollView } from 'react-native'
import React, { useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import "../../global.css"
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'


const SignIn = () => {
  const [form, setForm] = useState({
    email:'',
    password:'',
  })
  const [isSubmitting, setisSubmitting] = useState(false)
  
  const submit = () => {

  }

  return (
    <SafeAreaView style = {{ backgroundColor: '#2c2e2e' }}>
     <ScrollView contentContainerStyle={{ height: '100%'}}>
        <View className="w-full min-h-[85vh] px-4 my-6 h-full">
          <Image 
            source={images.logo}
            className="w-[115px] h-[100px] mt-7"
            resizeMode='contain'
          />
          <Text className="text-2xl text-semibold mt-10 font-psemibold" 
          style={{ color:'white'}}>Accéder à son profil</Text>

          <FormField 
            title="Adresse e-mail"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, 
            email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField 
            title="Mot de passe"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, 
            password: e})}
            otherStyles="mt-7"
          />

          <CustomButton 
          title="Se connecter"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Pas de compte ?
            </Text>
            <Link href="/sign-up" className= " text-lg text-secondary font-psemibold">
            S'inscrire
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn