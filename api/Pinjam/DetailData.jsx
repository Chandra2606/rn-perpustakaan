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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailData = ({ route }) => {
    const { kodepinjam } = route.params;
    const [mahasiswa, setMahasiswa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const unsubcribe = navigation.addListener('focus', () => {
            const fetchData = async () => {
                try {
                    token = await AsyncStorage.getItem('userToken');
                    const response = await fetch(`${apiUrl}pinjam/${kodepinjam}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const json = await response.json();
                    setMahasiswa(json);
                } catch (error) {
                    setError('Tidak dapat memuat data');
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        });
        return unsubcribe;
    }, [navigation, kodepinjam]);

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
                    {mahasiswa && (
                        <Card>
                            <Card.Title style={styles.title}>{mahasiswa.kodepinjam}</Card.Title>
                            <Card.Divider />
                            <Text style={styles.detail}>Kode / Nama Anggota:</Text>
                            <Text style={styles.detailData}>
                                {mahasiswa.kdanggota}/{mahasiswa.nama_lengkap}
                            </Text>
                            <Text style={styles.detail}>Kode / Nama Buku:</Text>
                            <Text style={styles.detailData}>
                                {mahasiswa.kdbuku}/{mahasiswa.namabuku}
                            </Text>
                            <Text style={styles.detail}>Lama Pinjam</Text>
                            <Text style={styles.detailData}>{mahasiswa.lamahari} Hari</Text>
                            <Text style={styles.detail}>Tanggal Dipinjam:</Text>
                            <Text style={styles.detailData}>{mahasiswa.tanggalpinjam}</Text>
                            <Text style={styles.detail}>Tanggal Dikembalikan:</Text>
                            <Text style={styles.detailData}>{mahasiswa.tanggalkembali}</Text>
                        </Card>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    avatarContainer: {
        alignSelf: 'right',
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
export default DetailData;
