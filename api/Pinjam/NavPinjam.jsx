import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import FormInput from './FormInput';
import DataPinjam from './DataPinjam';
import DetailPinjam from './DetailData';

export default function NavPinjam() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#6420AA"
        translucent={true}
      />

      <Stack.Navigator initialRouteName="DataPinjam">
        <Stack.Screen
          name="DataPinjam"
          component={DataPinjam}
          options={{
            headerTitle: 'Data Pinjam',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#6420AA',
            },
            headerTitleAlign: 'center',
          }}
        />

        <Stack.Screen
          name="DetailData"
          component={DetailPinjam}
          options={{
            headerTitle: 'Detail Pinjam',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#6420AA',
            },
          }}
        />

        <Stack.Screen
          name="FormInput"
          component={FormInput}
          options={{
            headerTitle: 'Input Pinjam',
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
