import React, { useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import { images } from '../../constants';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUsername } from '../../utils/UserContext';

export default function AddRental({ onClose, onSave }) {
  const [newRental, setNewRental] = useState({
    rental_name: '',
    rental_city: '',
    rental_postal_code: '',
    rental_street: '',
    number_of_tenants: '',
    country: '',
    surface_area: '',
    rental_type: '',
    user_name: '',
    profile_picture: null, // New field for profile picture
  });

  const [step, setStep] = useState(1);
  const { setUsername, setProfilePicture } = useUsername();
  const db = useSQLiteContext();

  async function updateUserAndAddNewRental() {
    if (newRental.user_name === "")
      newRental.user_name = "Leeser";
    try {
      // Update user
      console.log('picture:',newRental.profile_picture);
      await db.runAsync(
        'UPDATE User SET USERNAME = ?, firstTimeConnection = 0, profile_picture = ?',
        [newRental.user_name, newRental.profile_picture]
      );

      // Update the username context
      setUsername(newRental.user_name);
      setProfilePicture(newRental.profile_picture);

      // Now create rental
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          'INSERT INTO Rental (rental_name, rental_city, rental_postal_code, rental_street, number_of_tenants, country, surface_area, rental_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
          [
            newRental.rental_name,
            newRental.rental_city,
            newRental.rental_postal_code,
            newRental.rental_street,
            newRental.number_of_tenants,
            newRental.country,
            newRental.surface_area,
            newRental.rental_type,
          ]
        );
      });

      // Call the onSave function to handle post-save actions
      if (onSave) onSave();

    } catch (error) {
      console.error('Error updating user or creating rental:', error);
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      console.log("prout");
      setNewRental({ ...newRental, profile_picture: pickerResult.assets[0].uri });
    }
  };

  return (
    <View>
      <KeyboardAvoidingView behavior='padding'>
        <SafeAreaView>
          {step === 1 && (
            <View style={styles.container}>
              <Text style={styles.label}>User Name</Text>
              <TextInput
                style={styles.input}
                value={newRental.user_name}
                onChangeText={(text) => setNewRental({ ...newRental, user_name: text })}
                placeholder="Enter your name"
              />
              <TouchableOpacity onPress={pickImage}>
                <Text style={styles.label}>Upload Profile Picture</Text>
                {newRental.profile_picture ? (
                  <Image source={{ uri: newRental.profile_picture }} style={styles.profilePicture} />
                ) : (
                  <View style={styles.profilePicturePlaceholder}>
                    <Ionicons name="camera" size={40} color="#736ced" />
                  </View>
                )}
              </TouchableOpacity>
              <View className='justify-center w-full items-center mt-10'>
                <CustomButton 
                  handlePress={() => setStep(2)}
                  title={"SUIVANT"}
                  containerStyles={"w-3/4"}
                />
              </View>
            </View>
          )}
          {step === 2 && (
            <>
              <TouchableOpacity className="ml-4" onPress={onClose}>
                <Ionicons name="close-circle" size={40} color="#736ced" />
              </TouchableOpacity>
              <View id="Logo_and_text" className='flex-row justify-between items-start'>
                <View className="flex-row flex-1 justify-center items-center ml-4 mt-14 rounded-lg p-2 border-primary border-2"> 
                  <Text className='flex-wrap text-center flex-1 font-pmedium'>
                    Veuillez entrer le nom et les caractéristiques du bien à ajouter.
                  </Text>
                </View>
                <Image 
                  source={images.logo}
                  className="w-[115px] h-[100px] mt-7"
                  resizeMode='contain'
                />
              </View>
              <ScrollView className='ml-6 mr-6 flex my-auto flex-grow mt-5'>
                <Text className='font-pregular text-xl mb-2'>Nom</Text>
                <TextInput
                  style={styles.input}
                  value={newRental.rental_name}
                  onChangeText={(text) => setNewRental({ ...newRental, rental_name: text })}
                  placeholder="Studio Rivoli"
                />
                <View className='flex-row gap-4'>
                  <View className='flex-1'>
                    <Text className='font-pregular text-xl mb-2'>Ville</Text>
                    <TextInput
                      style={styles.input}
                      value={newRental.rental_city}
                      onChangeText={(text) => setNewRental({ ...newRental, rental_city: text })}
                      placeholder="Paris"
                    />
                  </View>
                  <View className='flex-1'>
                    <Text className='font-pregular text-xl mb-2'>Code postal</Text>
                    <TextInput
                      style={styles.input}
                      value={newRental.rental_postal_code}
                      onChangeText={(text) => setNewRental({ ...newRental, rental_postal_code: text })}
                      placeholder="75004"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <Text className='font-pregular text-xl mb-2'>Rue</Text>
                <TextInput
                  style={styles.input}
                  value={newRental.rental_street}
                  onChangeText={(text) => setNewRental({ ...newRental, rental_street: text })}
                  placeholder="45 rue François Miron"
                />
                <View className='flex-row gap-4'>
                  <View className='flex-1'>
                    <Text className='font-pregular text-xl mb-2'>Pays</Text>
                    <TextInput
                      style={styles.input}
                      value={newRental.country}
                      onChangeText={(text) => setNewRental({ ...newRental, country: text })}
                      placeholder="France"
                    />
                  </View>
                  <View className=' flex-1'>
                    <Text className='font-pregular text-xl mb-2'>Surface (m²)</Text>
                    <TextInput
                      style={styles.input}
                      value={newRental.surface_area}
                      onChangeText={(text) => setNewRental({ ...newRental, surface_area: text })}
                      placeholder="31"
                      keyboardType="numeric"
                    />
                  </View>
                </View>          
              </ScrollView>
              <View className='justify-center w-full items-center mt-10'>
                <CustomButton 
                  handlePress={updateUserAndAddNewRental}
                  title={"ENREGISTRER"}
                  containerStyles={"w-3/4"}
                />
              </View>
            </>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 20,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});
