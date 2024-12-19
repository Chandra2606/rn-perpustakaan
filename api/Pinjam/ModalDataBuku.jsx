import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { apiUrl } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function ModalDataBuku({
  isVisible,
  onClose,
  onBukuSelected,
}) {
  const [dataBuku, setDataBuku] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false); // Untuk loading data awal
  const [moreLoading, setMoreLoading] = useState(false); // Untuk loading data tambahan
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  // Fungsi untuk memanggil API
  const fetchDataBuku = async (pageNumber = 1, searchQuery = search) => {
    if (pageNumber === 1) {
      setInitialLoading(true);
    } else {
      setMoreLoading(true);
    }
    setError('');
    let token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(
        `${apiUrl}buku?page=${pageNumber}&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
      const json = await response.json();
      setPage(pageNumber);
      setLastPage(json.meta.last_page);
      setDataBuku(
        pageNumber === 1 ? json.data : [...dataBuku, ...json.data],
      );
    } catch (error) {
      setError(`Tidak bisa mengambil data: ${error}`);
    } finally {
      if (pageNumber === 1) {
        setInitialLoading(false);
        setRefreshing(false);
      } else {
        setMoreLoading(false);
      }
    }
  };
  useEffect(() => {
    if (isVisible) {
      fetchDataBuku();
    }
  }, [isVisible]);
  const handleSearch = () => {
    setIsSearching(true);
    fetchDataBuku(1, search);
  };
  const clearSearch = () => {
    setIsSearching(false);
    fetchDataBuku(1, '');
    setSearch('');
  };
  const onRefresh = () => {
    setRefreshing(true);
    setDataBuku([]);
    fetchDataBuku(1, search);
  };
  const pilihDataBuku = item => {
    onBukuSelected(item.kdbuku, item.namabuku);
  };
  // Render Item untuk FlatList
  const renderItemBuku = ({ item }) => (
    <TouchableOpacity
      onPress={() => pilihDataBuku(item)}
      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text>{item.namabuku}</Text>
      <Text>{item.kdbuku}</Text>
    </TouchableOpacity>
  );
  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onClose}
      overlayStyle={{
        width: '90%',
        padding: 20,
        height: '70%',
      }}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari berdasarkan Kode/Nama Buku"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity
            style={styles.clearIcon}
            onPress={() => clearSearch()}>
            <Icon name="close-circle" size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>
      {initialLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={dataBuku}
          renderItem={renderItemBuku}
          keyExtractor={item => item.idBuku}
          onEndReached={() => {
            if (!moreLoading && page < lastPage) {
              fetchDataBuku(page + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            moreLoading && page < lastPage ? (
              <ActivityIndicator size="large" color="#860A35" />
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <Button title="Close" onPress={onClose} />
    </Overlay>
  );
}
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    paddingLeft: 15,
    borderRadius: 25,
    fontSize: 16,
    marginVertical: 5,
  },
  clearIcon: {
    position: 'absolute',
    right: 10,
  },
});
