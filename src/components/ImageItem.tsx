import { Image, View, Text, TouchableOpacity } from 'react-native';
import { supabase } from './../../config/initSupabase';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

// Image item component that displays the image from Supabase Storage and a delete button
const ImageItem = ({ item, userId, onRemoveImage }: { item: FileObject; userId: string; onRemoveImage: () => void }) => {
  const [image, setImage] = useState<string>('');
  const [localFileUri, setLocalFileUri] = useState<string>('');

  useEffect(() => {
    const loadFile = async () => {
      const { data, error } = await supabase.storage
        .from('files')
        .download(`${userId}/${item.name}`);
      if (error) {
        console.error('Error downloading file: ', error);
        return;
      }

      const fileUri = FileSystem.documentDirectory + item.name;
      const base64 = await convertBlobToBase64(data);
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      setLocalFileUri(fileUri);

      const fr = new FileReader();
      fr.readAsDataURL(data!);
      fr.onload = () => {
        setImage(fr.result as string);
      };
    };

    loadFile();
  }, [item.name, userId]);

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
      <Text style={{ flex: 1, color: '#000' }}>{item.name}</Text>
      {/* Share image button */}
      <TouchableOpacity onPress={handleSharing}>
        <Ionicons name="share-outline" size={20} color={'#000'} />
      </TouchableOpacity>
      {/* Delete image button */}
      <TouchableOpacity onPress={onRemoveImage}>
        <Ionicons name="trash-outline" size={20} color={'#000'} />
      </TouchableOpacity>
    </View>
  );
};

export default ImageItem;
