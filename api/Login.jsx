import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from './config';

export default function Login({navigation, setUserToken}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const saveToken = async token => {
    try {
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    } catch (e) {
      //menyimpan token gagal
      console.log('Token Gagal Disimpan');
    }
  };

  const ActionLogin = async () => {
    setLoading(true);
    fetch(`${apiUrl}login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then(async response => {
      const json = await response.json();
      if (json.status == 'success') {
        console.log(json.data.token);
        await AsyncStorage.setItem('userToken', json.data.token);
        setUserToken(json.data.token);
        navigation.navigate('Index');
      } else {
        if (response.status == 403) {
          setErrorEmail(json.data.email ? json.data.email[0] : '');
          setErrorPassword(json.data.password ? json.data.password[0] : '');
        }
        if (response.status == 401) {
          Alert.alert('Gagal', `${json.message}`);
          setEmail('');
          setPassword('');
          setErrorEmail('');
          setErrorPassword('');
        }
      }
      setLoading(false);
    });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={styles.container}>
      <View style={styles.form}>
        <Image source={require('./img/buku.png')} style={styles.img} />
        <Text style={{ fontSize:23,fontWeight:'bold',marginBottom:10,color:'black' }}>Perpustakaan SMA PGRI 2 PADANG</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your E-Mail"
          value={email}
          onChangeText={setEmail}
        />
        {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Passowrd"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errorPassword ? (
          <Text style={styles.errorText}>{errorPassword}</Text>
        ) : null}
        <Button
          title={loading ? 'Tunggu...' : 'Login'}
          onPress={ActionLogin}
          disabled={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    color: 'black',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 5,
    padding: 10,
    borderRadius: 5,
  },
  img: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
    resizeMode: 'contain',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
});
