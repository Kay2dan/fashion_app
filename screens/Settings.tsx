import * as React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
// import EditScreenInfo from '../components/EditScreenInfo';
// import { Text, View } from '../components/Themed';

const Settings = () => {
  return (
    <View>
      <Text>Settings:</Text>
      <View>
        <Text>Designs:</Text>
        <ScrollView>
          <Text>Stitched</Text>
          <Text>Un-stitched</Text>
          <Text>Tops</Text>
          <Text>Trousers</Text>
          <Text>Dupattas</Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default Settings;

