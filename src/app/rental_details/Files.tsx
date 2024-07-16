import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Text, TextInput, Modal, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '../../../provider/AuthProvider';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../../config/initSupabase';
import ImageItem from '../../components/ImageItem';
import { useRouter, useGlobalSearchParams } from 'expo-router';

const Files = () => {
  const { user } = useAuth();
  const { rentalId } = useGlobalSearchParams();
  const [files, setFiles] = useState<{ file: { name: string }; description: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDocument, setIsDocument] = useState(false);

  useEffect(() => {
    if (!user || !rentalId) return;
    loadImages();
  }, [user, rentalId]);

  const loadImages = async () => {
    const { data: filesData, error: filesError } = await supabase.storage.from('files').list(user!.id);
    const { data: descriptionsData, error: descriptionsError } = await supabase
      .from('file_descriptions')
      .select('*')
      .eq('user_id', user!.id);

    if (filesError) {
      console.error('Error loading files:', filesError);
      return;
    }
    if (descriptionsError) {
      console.error('Error loading descriptions:', descriptionsError);
      return;
    }

    if (filesData && descriptionsData) {
      const rentalFiles = filesData.filter(file => file.name.includes(`rental_${rentalId}_`));
      const filesWithDescriptions = rentalFiles.map(file => ({
        file,
        description: descriptionsData.find(desc => desc.file_path === file.name)?.description || ''
      }));
      setFiles(filesWithDescriptions);
    }
  };

  const onSelectImage = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      alert('Sorry, we need camera and media library permissions to make this work!');
      return;
    }

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
            if (!result.canceled) {
              setSelectedFile(result.assets[0]);
              setIsDocument(false);
              setModalVisible(true);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: false,
            });
            if (!result.canceled) {
              setSelectedFile(result.assets[0]);
              setIsDocument(false);
              setModalVisible(true);
            }
          },
        },
        {
          text: 'Documents',
          onPress: async () => {
            const result = await DocumentPicker.getDocumentAsync({});
            if (!result.canceled) {
              setSelectedFile(result);
              setIsDocument(true);
              setModalVisible(true);
            }
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

  const handleImageUpload = async () => {
    if (selectedFile && description) {
      setLoading(true);
      try {
        const base64 = await FileSystem.readAsStringAsync(selectedFile.uri, { encoding: 'base64' });
        const binary = atob(base64);
        const arrayBuffer = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          arrayBuffer[i] = binary.charCodeAt(i);
        }
        const filePath = `rental_${rentalId}_${new Date().getTime()}.png`;
        const fullPath = `${user!.id}/${filePath}`;
        const { error: uploadError } = await supabase.storage.from('files').upload(fullPath, arrayBuffer, { contentType: 'image/png' });
        if (uploadError) throw uploadError;

        const { error: insertError } = await supabase
          .from('file_descriptions')
          .insert([{ user_id: user!.id, file_path: filePath, description }]);
        if (insertError) throw insertError;

        setFiles(prevFiles => [...prevFiles, { file: { name: filePath }, description }]);
      } catch (error) {
        console.error('Error uploading image: ', error);
      } finally {
        setLoading(false);
        setModalVisible(false);
        setDescription('');
        setSelectedFile(null);
        loadImages();
      }
    }
  };

  const handleDocumentUpload = async () => {
    if (selectedFile && description) {
      setLoading(true);
      try {

        const base64 = await FileSystem.readAsStringAsync(selectedFile.assets[0].uri, { encoding: 'base64' });
        const binary = atob(base64);
        const arrayBuffer = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          arrayBuffer[i] = binary.charCodeAt(i);
        }
        const filePath = `rental_${rentalId}_${new Date().getTime()}_${selectedFile.assets[0].name}`;
        const fullPath = `${user!.id}/${filePath}`;
        const { error: uploadError } = await supabase.storage.from('files').upload(fullPath, arrayBuffer, { contentType: selectedFile.mimeType });
        if (uploadError) throw uploadError;

        const { error: insertError } = await supabase
          .from('file_descriptions')
          .insert([{ user_id: user!.id, file_path: filePath, description }]);
        if (insertError) throw insertError;

        setFiles(prevFiles => [...prevFiles, { file: { name: filePath }, description }]);
      } catch (error) {
        console.error('Error uploading document: ', error);
      } finally {
        setLoading(false);
        setModalVisible(false);
        setDescription('');
        setSelectedFile(null);
        loadImages();
      }
    }
  };

  const onRemoveImage = async (item: { file: { name: string }; description: string }, listIndex: number) => {
    try {
      const fullPath = `${user!.id}/${item.file.name}`;
      console.log('Removing file from path:', fullPath);
      const { error: removeFileError } = await supabase.storage.from('files').remove([fullPath]);
      if (removeFileError) throw removeFileError;

      const { error: removeDescriptionError } = await supabase
        .from('file_descriptions')
        .delete()
        .eq('user_id', user!.id)
        .eq('file_path', item.file.name);
      if (removeDescriptionError) throw removeDescriptionError;

      const newFiles = [...files];
      newFiles.splice(listIndex, 1);
      setFiles(newFiles);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const handleFileUpload = async () => {
    if (isDocument) {
      await handleDocumentUpload();
    } else {
      await handleImageUpload();
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#2b825b" />}
      <ScrollView>
        {files.length === 0 && !loading && <Text>No file uploaded</Text>}
        {files.map((item, index) => (
          <ImageItem key={index} item={item} userId={user!.id} onRemoveImage={() => onRemoveImage(item, index)} />
        ))}
      </ScrollView>

      <TouchableOpacity onPress={onSelectImage} style={styles.fab}>
        <Ionicons name="camera-outline" size={30} color={'#fff'} />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter a description for the file:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <Button title="Upload" onPress={handleFileUpload} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default Files;
