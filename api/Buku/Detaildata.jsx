import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Card, Avatar } from 'react-native-elements';
import { apiImage, apiUrl } from '../config';
import defaultAvatar from './img/avatar.png';
import ActionButton from './ActionButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Detailmobil = ({ route }) => {
  const { kdbuku } = route.params;
  const [mobil, setmobil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const goToPageFormUpload = () => {
    navigation.navigate('FormUpload', {
      kdbuku: kdbuku,
      foto: mobil.foto_thumb,
    });
  };

  useEffect(() => {
    const unsubcribe = navigation.addListener('focus', () => {
      const fetchData = async () => {
        try {
          let token = await AsyncStorage.getItem('userToken');
          const response = await fetch(`${apiUrl}buku/${kdbuku}`, {
            headers: {
              Authorization: ` Bearer ${token}`,
            },
          });
          const json = await response.json();
          setmobil(json);
        } catch (error) {
          setError('Tidak dapat memuat data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    });
    return unsubcribe;
  }, [navigation, kdbuku]);
  if (loading) {
    return <ActivityIndicator size="large" />;
  }
  if (error) {
    return <Text>{error}</Text>;
  }
  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          {mobil && (
            <Card>
              <Card.Title style={styles.title}>{mobil.kdbuku}</Card.Title>
              <Card.Divider />
              <Text style={styles.detail}>Nama Buku:</Text>
              <Text style={styles.detailData}>{mobil.namabuku}</Text>
              <Text style={styles.detail}>Jenis Buku:</Text>
              <Text style={styles.detailData}>{mobil.jenisbuku}</Text>
              <Text style={styles.detail}>Penerbit Buku:</Text>
              <Text style={styles.detailData}>{mobil.penerbit}</Text>
              <Text style={styles.detail}>Jumlah:</Text>
              <Text style={styles.detailData}>{mobil.jumlah}</Text>
            </Card>
          )}
        </View>
      </ScrollView>
      <ActionButton kdbuku={mobil.kdbuku} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detail: {
    fontSize: 14,
    marginBottom: 5,
    color: '#ccd',
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailData: {
    fontSize: 18,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'black',
    fontWeight: 'bold',
  },
});
export default Detailmobil;
