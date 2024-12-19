import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  View,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {apiUrl} from '../config';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormEdit({route}) {
  const {kdbuku} = route.params;
  const [mobil, setMobil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [namaMobil, setNamaMobil] = useState('');
  const [jenisMobil, setJenisMobil] = useState('A');
  const [platMobil, setPlatMobil] = useState('');
  const [warnaMobil, setWarnaMobil] = useState('');
  const [tahunMobil, setTahunMobil] = useState(new Date());
  const [hargaMobil, setHargaMobil] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const navigation = useNavigation();
  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tahunMobil;
    setDatePickerVisible(Platform.OS === 'ios');
    setTanggalLahir(currentDate);
  };

  const formatDate = date => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${apiUrl}buku/${kdbuku}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        setNamaMobil(json.namabuku);
        setPlatMobil(json.jenisbuku);
        setWarnaMobil(json.penerbit);
        setHargaMobil(json.jumlah);
      } catch (error) {
        setError('Tidak Dapat Memuat Data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kdbuku]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const submitForm = async () => {
    let token = await AsyncStorage.getItem('userToken');
    setIsSaving(true);
    setValidationErrors({});
    const formData = {
      namabuku: namaMobil,
      jenisbuku: platMobil,
      penerbit: warnaMobil,
      jumlah: hargaMobil,
      _method: 'PUT',
    };
    fetch(`${apiUrl}buku/${kdbuku}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          setIsSaving(false);
          //jika ada kesalahan validasi,akan masuk ke sini
          if (response.status === 422) {
            //Handle validation errors
            let errors = {};
            Object.keys(data.errors).forEach(key => {
              errors[key] = data.errors[key][0]; //Ambil hanya pesan pertama untuk setiap field
            });
            setValidationErrors(errors);
          } else {
            //JIKA ada jenis error lain,throw error untuk menangkap di catch block
            throw new Error(
              data.message || 'Terjadi kesalahan saat meng-update data.',
            );
          }
          //jangan lupa untuk return disini untuk menghentikan eksekusi lebih lanjut
          return;
        }
        setIsSaving(false);
        //jika tidak ada error,maka tampilkan pesan sukse
        Alert.alert('Success', 'Data Buku berhasil DiUpdate', [
          {
            text: 'ok',
            onPress: () => navigation.navigate('DetailBuku', {kdbuku: kdbuku}),
          },
        ]);
      })
      .catch(error => {
        //handle failure
        setIsSaving(false);
        Alert.alert('Error', error.toString());
      });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Input
        placeholder="Kode Buku"
        value={kdbuku}
        disabled={true}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.kdbuku}
      />

      <Input
        placeholder="Nama Buku"
        value={namaMobil}
        onChangeText={setNamaMobil}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.namabuku}
      />
      <Input
        placeholder="Jenis Buku"
        value={platMobil}
        onChangeText={setPlatMobil}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.jenisbuku}
      />

      <Input
        placeholder="Penerbit"
        value={warnaMobil}
        onChangeText={setWarnaMobil}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.penerbit}
      />

      <Input
        placeholder="Jumlah Buku"
        value={hargaMobil}
        onChangeText={setHargaMobil}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.jumlah}
        keyboardType="number-pad"
      />

      <Button
        title="Update Data"
        onPress={submitForm}
        buttonStyle={styles.submitButton}
        titleStyle={styles.submitTitle}
        loading={isSaving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 30,
  },
  container: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingLeft: 10,
  },
  inputText: {
    color: '#000',
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#6420AA',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
  },
  submitTitle: {
    color: '#fff', //warna text tombol
  },
  dateContainer: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  dateDisplay: {
    fontSize: 16,
    marginTop: 10,
  },
});
