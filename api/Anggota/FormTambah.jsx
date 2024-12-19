import React, {useState} from 'react';
import {ScrollView, StyleSheet, Alert, View, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {apiUrl} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormTambah = () => {
  const [kdanggota, setkdAnggota] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('L,P');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState(new Date());
  const [alamat, setAlamat] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const navigation = useNavigation();
  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  let token;
  const submitForm = () => {
    checkToken();
    setIsSaving(true);
    setValidationErrors({});
  };

  const checkToken = async () => {
    token = await AsyncStorage.getItem('userToken');
    if (!token) {
      navigation.navigate('Login');
    } else {
      const formData = {
        kdanggota: kdanggota,
        nama_lengkap: namaLengkap,
        jenis_kelamin: jenisKelamin,
        tmp_lahir: tempatLahir,
        tgl_lahir: tanggalLahir.toISOString().split('T')[0],
        alamat: alamat,
        notelp: noTelp,
      };
      fetch(`${apiUrl}anggota`, {
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
                data.message || 'Terjadi kesalahan saat menyimpan data.',
              );
            }
            //jangan lupa untuk return disini untuk menghentikan eksekusi lebih lanjut
            return;
          }
          setIsSaving(false);
          //jika tidak ada error,maka tampilkan pesan sukse
          Alert.alert('Success', 'Data Anggota berhasil ditambahkan', [
            {
              text: 'ok',
              onPress: () =>
                navigation.navigate('DataAnggota', {dataAdded: true}),
            },
          ]);
        })
        .catch(error => {
          //handle failure
          setIsSaving(false);
          Alert.alert('Error', error.toString());
        });
    }
  };
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tanggalLahir;
    setDatePickerVisible(Platform.OS === 'ios');
    setTanggalLahir(currentDate);
  };
  const formatDate = date => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Input
        placeholder="Kode Anggota"
        value={kdanggota}
        onChangeText={setkdAnggota}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        leftIcon={<Icon name="user-circle" size={24} color="black" />}
        errorMessage={validationErrors.kdanggota}
      />

      <Input
        placeholder="Nama Lengkap"
        value={namaLengkap}
        onChangeText={setNamaLengkap}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        leftIcon={<Icon name="user" size={24} color="black" />}
        errorMessage={validationErrors.nama_lengkap}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={jenisKelamin}
          onValueChange={(itemValue, itemIndex) => setJenisKelamin(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Pilih Jenis Kelamin" value="" />
          <Picker.Item label="Laki-laki" value="L" />
          <Picker.Item label="Perempuan" value="P" />
        </Picker>
      </View>

      <Input
        placeholder="Tempat Lahir"
        value={tempatLahir}
        onChangeText={setTempatLahir}
        leftIcon={<Icon name="home" size={24} color="black" />}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.tmp_lahir}
      />

      <View style={styles.dateContainer}>
        <Button
          title="Pilih Tanggal Lahir"
          buttonStyle={{
            backgroundColor: '#6420AA',
          }}
          onPress={() => setDatePickerVisible(true)}
          icon={<Icon name="calendar" size={15} color="white" />}
        />
        {datePickerVisible && (
          <DateTimePicker
            value={tanggalLahir}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <Text style={styles.dateDisplay}>
          Tanggal Lahir: {formatDate(tanggalLahir)}
        </Text>
      </View>

      <Input
        placeholder="Alamat"
        value={alamat}
        onChangeText={setAlamat}
        leftIcon={<Icon name="map-marker-alt" size={24} color="black" />}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.alamat}
      />

      <Input
        placeholder="Nomor Telpon"
        value={noTelp}
        onChangeText={setNoTelp}
        leftIcon={<Icon name="phone" size={24} color="black" />}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.notelpss}
        keyboardType="number-pad"
      />

      <Button
        title="Simpan Data"
        onPress={submitForm}
        buttonStyle={styles.submitButton}
        titleStyle={styles.submitTitle}
        loading={isSaving}
      />
    </ScrollView>
  );
};

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

export default FormTambah;
