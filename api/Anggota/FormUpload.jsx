import {
  Alert,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Avatar } from 'react-native-elements';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import defaultAvatar from './img/avatar.png';
import { apiImage, apiUrl } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormUploadPelanggan({ route, navigation }) {
  const { kdanggota } = route.params;
  const { foto } = route.params;

  const [Pic, setPic] = useState(null);
  const [uriImage, setUriImage] = useState();
  const [typeImage, setTypeImage] = useState();
  const [fileNameImage, setFileNameImage] = useState();

  const [isUploadButtonDisabled, setIsUploadButtonDisabled] = useState(true); //Untuk menonaktifkan tombol Upload sebelum user melakukan searchImage atau takePicture

  const [loading, setLoading] = useState(false); //membuat loading ketika upload image di klik

  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
    };
    getToken();

    if (foto) {
      setPic(`${apiImage}${foto}`);
    }
  }, [foto]);

  const options = {
    title: 'Select Image',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: true,
      includeExtra: true,
    },
  };

  const setToastMsg = msg => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };

  const searchImage = async () => {
    setIsUploadButtonDisabled(true);

    const result = await launchImageLibrary(options, response => {
      if (response.didCancel) {
        setToastMsg('Canceled Selection Image');
        setIsUploadButtonDisabled(true);
      } else if (response.errorCode == 'permission') {
        setToastMsg('Not Permission');
        setIsUploadButtonDisabled(true);
      } else if (response.errorCode == 'others') {
        setToastMsg(response.errorMessage);
        setIsUploadButtonDisabled(true);
      } else if (response.assets[0].fileSize > 5000000) {
        Alert.alert('Maximum File 5Mb', 'Please Choice other', [{ text: 'OK' }]);
        setIsUploadButtonDisabled(true);
      } else {
        setPic(response.assets[0].uri);
        setUriImage(response.assets[0].uri);
        setTypeImage(response.assets[0].type);
        setFileNameImage(response.assets[0].fileName);
        setIsUploadButtonDisabled(false);
      }
    });
  };

  const takePicture = async () => {
    setIsUploadButtonDisabled(true);
    const result = await launchCamera(options, response => {
      if (response.didCancel) {
        setToastMsg('Canceled Selection Image');
        setIsUploadButtonDisabled(true);
      } else if (response.errorCode == 'permission') {
        setToastMsg('Not Permission');
        setIsUploadButtonDisabled(true);
      } else if (response.errorCode == 'others') {
        setToastMsg(response.errorMessage);
        setIsUploadButtonDisabled(true);
      } else if (
        response.assets &&
        response.assets.length > 0 &&
        response.assets[0].fileSize <= 4194304
      ) {
        const uri = response.assets[0].uri;
        setPic(uri);
        setUriImage(uri);
        setTypeImage(response.assets[0].type);
        setFileNameImage(response.assets[0].fileName);

        setIsUploadButtonDisabled(false);
      } else {
        Alert.alert('Maximum File 4Mb', 'Please Choice other', [{ text: 'OK' }]);
        setIsUploadButtonDisabled(true);
      }
    });
  };

  const doRemovePicture = () => {
    if (foto) {
      setPic(`${apiImage}${foto}`);
    } else {
      setPic('');
    }
    setIsUploadButtonDisabled(true);
  };

  const doUploadImage = async () => {
    let token = await AsyncStorage.getItem('userToken');
    setLoading(true);
    const formdata = new FormData();
    formdata.append('_method', 'PUT');
    formdata.append('foto', {
      uri: uriImage,
      type: typeImage,
      name: fileNameImage,
    });

    try {
      let res = await fetch(`${apiUrl}anggota/uploadImage/${kdanggota}`, {
        method: 'POST',
        body: formdata,
        headers: {
          'Content-Type': 'multipart/form-data; ',
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to upload image');
      }

      let responseJson = await res.json();
      setToastMsg(responseJson.message);
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.toString());
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20,
      }}>
      <TouchableOpacity onPress={searchImage} underlayColor="rgba(0,0,0,0)">
        <Avatar
          size="xlarge"
          rounded
          source={Pic ? { uri: Pic } : defaultAvatar}
          containerStyle={{
            alignSelf: 'center',
            marginBottom: 10,
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: isUploadButtonDisabled ? '#aaa' : '#65B741', // Ubah warna jika disabled
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            borderRadius: 5,
            elevation: 3,
            marginHorizontal: 5,
          }}
          onPress={doUploadImage}
          disabled={isUploadButtonDisabled}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 14,
            }}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              'Upload Foto'
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#19376D',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            borderRadius: 5,
            elevation: 3,
            marginHorizontal: 5,
          }}
          onPress={takePicture}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 14,
            }}>
            Take Camera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#D21312',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            borderRadius: 5,
            elevation: 3,
            marginHorizontal: 5,
          }}
          onPress={doRemovePicture}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 14,
            }}>
            Remove Picture
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
