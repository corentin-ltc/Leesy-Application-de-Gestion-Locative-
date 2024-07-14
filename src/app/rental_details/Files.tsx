import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../provider/AuthProvider';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../../config/initSupabase';
import { FileObject } from '@supabase/storage-js';
import ImageItem from '../../components/ImageItem';

const list = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileObject[]>([]);

  useEffect(() => {
    if (!user) return;

    // Load user images
    loadImages();
  }, [user]);

  const loadImages = async () => {
    const { data } = await supabase.storage.from('files').list(user!.id);
    if (data) {
      setFiles(data);
    }
  };

  const onSelectImage = async () => {
    // Request permissions for camera and media library access
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      alert('Sorry, we need camera and media library permissions to make this work!');
      return;
    }

    // Prompt the user to choose between camera and gallery
    Alert.alert(
      'Upload Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: false,
            });
            handleImageResult(result);
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: false,
            });
            handleImageResult(result);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleImageResult = async (result) => {
    // Save image if not cancelled
    if (!result.canceled) {
      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' });
      const binary = atob(base64);
      const arrayBuffer = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        arrayBuffer[i] = binary.charCodeAt(i);
      }
      const filePath = `${user!.id}/${new Date().getTime()}.${img.type === 'image' ? 'png' : 'mp4'}`;
      const contentType = img.type === 'image' ? 'image/png' : 'video/mp4';
      await supabase.storage.from('files').upload(filePath, arrayBuffer, { contentType });
      loadImages();
    }
  };

  const onRemoveImage = async (item: FileObject, listIndex: number) => {
    await supabase.storage.from('files').remove([`${user!.id}/${item.name}`]);
    const newFiles = [...files];
    newFiles.splice(listIndex, 1);
    setFiles(newFiles);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {files.map((item, index) => (
          <ImageItem key={item.id} item={item} userId={user!.id} onRemoveImage={() => onRemoveImage(item, index)} />
        ))}
      </ScrollView>

      {/* FAB to add images */}
      <TouchableOpacity onPress={onSelectImage} style={styles.fab}>
        <Ionicons name="camera-outline" size={30} color={'#fff'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  fab: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 40,
    right: 30,
    height: 70,
    backgroundColor: '#2b825b',
    borderRadius: 100,
  },
});

export default list;
