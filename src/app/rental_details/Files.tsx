import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '../../../provider/AuthProvider';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../../config/initSupabase';
import { FileObject } from '@supabase/storage-js';
import ImageItem from '../../components/ImageItem';
import { useRouter, useGlobalSearchParams } from 'expo-router';

const Files = () => {
  const { user } = useAuth();
  const { rentalId } = useGlobalSearchParams();
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !rentalId) return;

    // Load rental images
    loadImages();
  }, [user, rentalId]);

  const loadImages = async () => {
    const { data } = await supabase.storage.from('files').list(user!.id);
    if (data) {
      const rentalFiles = data.filter(file => file.name.includes(`rental_${rentalId}_`));
      setFiles(rentalFiles);
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

    // Prompt the user to choose between camera, gallery, and documents
    Alert.alert(
      'Upload File',
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
          text: 'Documents',
          onPress: async () => {
            const result = await DocumentPicker.getDocumentAsync({});
            handleDocumentResult(result);
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
    if (!result.canceled) {
      setLoading(true);
      try {
        const img = result.assets[0];
        const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' });
        const binary = atob(base64);
        const arrayBuffer = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          arrayBuffer[i] = binary.charCodeAt(i);
        }
        const filePath = `${user!.id}/rental_${rentalId}_${new Date().getTime()}.png`;
        const { error } = await supabase.storage.from('files').upload(filePath, arrayBuffer, { contentType: 'image/png' });
        if (error) throw error;
        loadImages();
      } catch (error) {
        console.error('Error uploading image: ', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDocumentResult = async (result) => {
    if (!result.canceled) {
      setLoading(true);
      try {
        const file = result.assets[0];
        const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });
        const binary = atob(base64);
        const arrayBuffer = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          arrayBuffer[i] = binary.charCodeAt(i);
        }
        const filePath = `${user!.id}/rental_${rentalId}_${new Date().getTime()}_${file.name}`;
        const { error } = await supabase.storage.from('files').upload(filePath, arrayBuffer, { contentType: file.mimeType });
        if (error) throw error;
        loadImages();
      } catch (error) {
        console.error('Error uploading document: ', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const onRemoveImage = async (item: FileObject, listIndex: number) => {
    try {
      const { error } = await supabase.storage.from('files').remove([`${user!.id}/${item.name}`]);
      if (error) throw error;
      const newFiles = [...files];
      newFiles.splice(listIndex, 1);
      setFiles(newFiles);
    } catch (error) {
      console.error('Error removing image: ', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#2b825b" />}
      <ScrollView>
        {files.length === 0 && !loading && <Text>No file uploaded</Text>}
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

export default Files;
