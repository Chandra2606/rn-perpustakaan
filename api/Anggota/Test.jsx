import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function Test({navigation}) {
  return (
    <View>
      <Text>Test</Text>
      <TouchableOpacity onPress={() => navigation.navigate('DetailData')}>
        <Text>Click</Text>
      </TouchableOpacity>
    </View>
  );
}
