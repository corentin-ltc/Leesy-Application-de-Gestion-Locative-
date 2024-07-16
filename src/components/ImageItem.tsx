import { Image, View, Text, TouchableOpacity } from 'react-native';
import { supabase } from './../../config/initSupabase';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const ImageItem = ({ item, userId, onRemoveImage }: { item: { file: { name: string }; description: string }; userId: string; onRemoveImage: () => void }) => {
  const [image, setImage] = useState<string>('');
  const [localFileUri, setLocalFileUri] = useState<string>('');

  useEffect(() => {
    const loadFile = async () => {
      try {
        const fullPath = `${userId}/${item.file.name}`;
        console.log('Attempting to download file from path:', fullPath);
        const { data, error } = await supabase.storage.from('files').download(fullPath);
        if (error) {
          console.error('Error downloading file:', error);
          return;
        }

        const fileUri = FileSystem.documentDirectory + item.file.name;
        const base64 = await convertBlobToBase64(data);
        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        setLocalFileUri(fileUri);

        const fr = new FileReader();
        fr.readAsDataURL(data!);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      } catch (error) {
        console.error('Error loading file:', error);
      }
    };

    loadFile();
  }, [item.file.name, userId]);

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSharing = async () => {
    if (localFileUri) {
      await Sharing.shareAsync(localFileUri);
    } else {
      console.log('File not available for sharing');
    }
  };

  return (
    <View style={{ flexDirection: 'row', margin: 1, alignItems: 'center', gap: 5 }}>
      {image ? <Image style={{ width: 80, height: 80 }} source={{ uri: image }} /> : <View style={{ width: 80, height: 80, backgroundColor: '#1A1A1A' }} />}
      <Text style={{ flex: 1, color: '#000' }}>{item.description}</Text>
      <TouchableOpacity onPress={handleSharing}>
        <Ionicons name="share-outline" size={20} color={'#000'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onRemoveImage}>
        <Ionicons name="trash-outline" size={20} color={'#000'} />
      </TouchableOpacity>
    </View>
  );
};

export default ImageItem;
