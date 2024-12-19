import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Button, Input} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import ModalDataAnggota from './ModalDataAnggota';
import ModalDataBuku from './ModalDataBuku';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {apiUrl} from '../config';
import {useNavigation} from '@react-navigation/native';

export default function FormInput() {
  const navigation = useNavigation();
  const [modalAnggotaVisible, setModalAnggotaVisible] = useState(false);
  const [modalBukuVisible, setModalBukuVisible] = useState(false);
  const [koderental, setKodeRental] = useState('');
  const [lamahari, setLamahari] = useState('');
  const [selectedAnggota, setSelectedAnggota] = useState({
    kdanggota: '',
    nama: '',
  });
  const [selectedBuku, setSelectedBuku] = useState({
    kode: '',
    nama: '',
  });
  const [TanggalMulai, setTanggalMulai] = useState(new Date());
  const [TanggalSelesai, setTanggalSelesai] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('start');
  const [total, setTotal] = useState('');
  const [hargaBuku, setHargaBuku] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onAnggotaSelected = (kdanggota, nama) => {
    setSelectedAnggota({kdanggota, nama});
    setModalAnggotaVisible(false); // Menutup modal setelah pemilihan
  };

  const onBukuSelected = (kode, nama) => {
    setSelectedBuku({kode, nama});
    setModalBukuVisible(false); // Menutup modal setelah pemilihan
  };

  const onChangeTime = (event, selectedTime) => {
    setShowPicker(Platform.OS === 'ios'); // Untuk iOS, tetap tampilkan picker
    const currentTime = selectedTime || new Date();
    if (currentPicker === 'start') {
      setTanggalMulai(currentTime);
    } else {
      setTanggalSelesai(currentTime);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || TanggalMulai;
    setShowPicker(Platform.OS === 'ios');
    if (currentPicker === 'start') {
      setTanggalMulai(currentDate);
    } else {
      setTanggalSelesai(currentDate);
    }
  };

  const formatDate = date => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  const modalSearchAnggota = () => {
    setModalAnggotaVisible(true); // Buka hanya modal Anggota
  };

  const modalSearchBuku = () => {
    setModalBukuVisible(true); // Buka hanya modal Buku
  };

  const submitRental = async () => {
    setLoading(true);
    setValidationErrors({});
    // Hitung total berdasarkan harga Buku dan lama hari
    const totalHarga = parseFloat(selectedBuku.hargaBuku) * parseInt(lamahari);

    const dataToSend = {
      kodepinjam: koderental,
      kdanggota: selectedAnggota.kdanggota,
      kdbuku: selectedBuku.kode,
      lamahari: lamahari,
      tanggalpinjam: formatDate(TanggalMulai),
      tanggalkembali: formatDate(TanggalSelesai),
    };
    let token = await AsyncStorage.getItem('userToken');
    fetch(`${apiUrl}pinjam`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          setLoading(false);
          if (response.status === 422) {
            let errors = {};
            Object.keys(data.errors).forEach(key => {
              errors[key] = data.errors[key][0];
            });
            setValidationErrors(errors);
          } else {
            throw new Error(
              data.message || 'Terjadi kesalahan saat menyimpan data.',
            );
          }
          return;
        }
        setLoading(false);
        Alert.alert('Berhasil', 'Data Peminjaman berhasil disimpan', [
          {
            text: 'Ok',
            onPress: () => {
              setKodeRental('');
              setLamahari('');
              setSelectedAnggota({kdanggota: '', nama: ''});
              setSelectedBuku({kode: '', nama: ''});
              setTanggalMulai(new Date());
              setTanggalSelesai(new Date());
              setShowPicker(false);
              setTotal('');
              setHargaBuku('');
              setValidationErrors({});
              navigation.navigate('DataPinjam', {dataAdded: true});
            },
          },
        ]);
      })
      .catch(error => {
        console.log(`Gagal Simpan Data : ${error}`);
      });
  };
  useEffect(() => {
    // Konversi harga Buku dan lama hari menjadi angka
    const hargaBukuNumber = parseFloat(selectedBuku.hargaBuku);
    const lamaHariNumber = parseFloat(lamahari);

    // Hitung total
    if (!isNaN(hargaBukuNumber) && !isNaN(lamaHariNumber)) {
      const total = hargaBukuNumber * lamaHariNumber;
      setTotal(total.toString());
    }
  }, [selectedBuku.hargaBuku, lamahari]);

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.container}>
        <Input
          value={koderental}
          onChangeText={setKodeRental}
          label="Kode Pinjam"
          labelStyle={styles.labelInput}
          placeholder="Input Kode Pinjam..."
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          errorMessage={validationErrors.kodepinjam}
        />
        <View style={styles.inputRow}>
          <View style={{flex: 4, marginRight: 10}}>
            <Input
              label="Kode Anggota"
              labelStyle={styles.labelInput}
              placeholder="Cari Anggota..."
              disabled={true}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              value={`${selectedAnggota.kdanggota} - ${selectedAnggota.nama}`}
              errorMessage={validationErrors.kdanggota}
            />
          </View>
          <View style={{flex: 1}}>
            <Button
              title="Cari"
              containerStyle={styles.buttonContainer}
              buttonStyle={{
                height: 50,
                backgroundColor: '#6420AA',
                borderRadius: 10,
              }}
              onPress={modalSearchAnggota}
            />
            <ModalDataAnggota
              isVisible={modalAnggotaVisible}
              onClose={() => setModalAnggotaVisible(false)}
              onAnggotaSelected={onAnggotaSelected}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={{flex: 4, marginRight: 10}}>
            <Input
              label="Kode Buku"
              labelStyle={styles.labelInput}
              placeholder="Cari Buku..."
              disabled={true}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              value={`${selectedBuku.kode} - ${selectedBuku.nama}`}
              errorMessage={validationErrors.kdBuku}
            />
          </View>
          <View style={{flex: 1}}>
            <Button
              title="Cari"
              containerStyle={styles.buttonContainer}
              buttonStyle={{
                height: 50,
                backgroundColor: '#6420AA',
                borderRadius: 10,
              }}
              onPress={modalSearchBuku}
            />
            <ModalDataBuku
              isVisible={modalBukuVisible}
              onClose={() => setModalBukuVisible(false)}
              onBukuSelected={onBukuSelected}
            />
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Button
            title="Pilih Tanggal Dipinjam"
            buttonStyle={{
              backgroundColor: '#6420AA',
            }}
            onPress={() => {
              setCurrentPicker('start');
              setShowPicker(true);
            }}
            icon={<Icon name="calendar" size={15} color="white" />}
          />
          {showPicker && currentPicker === 'start' && (
            <DateTimePicker
              value={TanggalMulai}
              mode="date"
              display="default"
              onChange={onDateChange} // Perubahan disini
              isVisible={showPicker}
            />
          )}
          <Text style={styles.dateDisplay}>
            Tanggal Mulai: {formatDate(TanggalMulai)}
          </Text>
        </View>

        <View style={styles.dateContainer}>
          <Button
            title="Pilih Tanggal Dikembalikan"
            buttonStyle={{
              backgroundColor: '#6420AA',
            }}
            onPress={() => {
              setCurrentPicker('end');
              setShowPicker(true);
            }}
            icon={<Icon name="calendar" size={15} color="white" />}
          />
          {showPicker && currentPicker === 'end' && (
            <DateTimePicker
              value={TanggalSelesai}
              mode="date"
              display="default"
              onChange={onDateChange} // Perubahan disini
              isVisible={showPicker}
            />
          )}
          <Text style={styles.dateDisplay}>
            Tanggal Selesai: {formatDate(TanggalSelesai)}
          </Text>
        </View>

        <Input
          value={lamahari}
          onChangeText={setLamahari}
          label="Lama Dipinjam"
          labelStyle={styles.labelInput}
          placeholder="Input Lama Pinjam..."
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          errorMessage={validationErrors.lamahari}
        />
        <Button
          title={loading ? 'Tunggu...' : 'Simpan Data'}
          disabled={loading}
          onPress={submitRental}
          buttonStyle={{
            marginHorizontal: 10,
            backgroundColor: '#6420AA',
          }}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    marginBottom: 5,
  },
  labelInput: {
    color: '#000',
    borderBottomColor: '#000',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingLeft: 10,
    elevation: 3,
  },
  inputText: {
    color: '#000',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    marginRight: 10,
    marginTop: 25,
  },
  dateContainer: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  dateDisplay: {
    marginTop: 10,
    marginLeft: 10,
  },
});
