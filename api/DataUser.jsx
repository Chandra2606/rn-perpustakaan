import React from 'react';
import {View, Button, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from './config';

export default function DataUser({setUserToken}) {
  const navigation = useNavigation();

  const confirmLogout = () => {
    Alert.alert('Logout', 'Apakah Anda yakin ingin logout?', [
      {
        text: 'Batal',
        onPress: () => console.log('Logout dibatalkan'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => handleLogout(), cancelable: false},
    ]);
  };

  const handleLogout = async () => {
    const token = await AsyncStorage.getItem('userToken');

    try {
      let response = await fetch(`${apiUrl}logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await AsyncStorage.removeItem('userToken');
        setUserToken(null);
        navigation.navigate('Login');
      } else {
        console.log('Logout failed');
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={confirmLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
