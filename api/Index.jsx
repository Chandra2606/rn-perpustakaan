import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Anggota from './Anggota/Navigasi';
import Buku from './Buku/Navigasi';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DataUser from './DataUser';
import NavPinjam from './Pinjam/NavPinjam';

const Tab = createBottomTabNavigator();

export default function Index(props) {
  const {setUserToken} = props;
  return (
    <Tab.Navigator
      initialRouteName="Anggota"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Anggota') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'Buku') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'UserAccount') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Pinjam') {
            iconName = focused ? 'library' : 'library-outline';
          }
          return <IonIcon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6420AA',
        tabBarInactiveTintColor: '#164863',
      })}>
      <Tab.Screen
        name="Anggota"
        component={Anggota}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Buku" component={Buku} options={{headerShown: false}} />

      <Tab.Screen
        name="Pinjam"
        component={NavPinjam}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="UserAccount"
        options={{headerShown: false, title: 'User'}}>
        {props => <DataUser {...props} setUserToken={setUserToken} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
