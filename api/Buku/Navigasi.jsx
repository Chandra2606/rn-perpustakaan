import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Data from './Data';
import DetailData from './Detaildata';
import {StatusBar} from 'react-native';
import FormTambah from './FormTambah';
import FormEdit from './FormEdit';
import FormUpload from './FormUpload';

export default function Navigasi() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#6420AA"
        translucent={true}
      />
      <Stack.Navigator initialRouteName="DataBuku">
        <Stack.Screen
          name="DataBuku"
          component={Data}
          options={{
            headerTitle: 'Data Buku',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#6420AA',
            },
          }}
        />
        <Stack.Screen
          name="DetailBuku"
          component={DetailData}
          options={{
            headerTitle: 'Detail Buku',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#6420AA',
            },
          }}
        />
        <Stack.Screen
          name="FormTambah"
          component={FormTambah}
          options={{
            headerTitle: 'Tambah Buku',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#6420AA',
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="FormEdit"
          component={FormEdit}
          options={{
            headerTitle: 'Edit Buku',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#6420AA',
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="FormUpload"
          component={FormUpload}
          options={{
            headerTitle: 'Update Foto Buku',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#6420AA',
            },
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </>
  );
}

const styles = StyleSheet.create({});
