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
    // <NavigationContainer independent={true}>
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#6420AA"
        translucent={true}
      />
      <Stack.Navigator initialRouteName="DataAnggota">
        <Stack.Screen
          name="DataAnggota"
          component={Data}
          options={{
            headerTitle: 'Data Anggota',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#6420AA',
            },
          }}
        />
        <Stack.Screen
          name="DetailAnggota"
          component={DetailData}
          options={{
            headerTitle: 'Detail Anggota',
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
            headerTitle: 'Tambah Anggota',
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
            headerTitle: 'Edit Anggota',
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
            headerTitle: 'Update Foto Anggota',
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
