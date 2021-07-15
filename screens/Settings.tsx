import * as React from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
// import EditScreenInfo from '../components/EditScreenInfo';
// import { Text, View } from '../components/Themed';

const Settings = ({ }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.navigate("Settings")} />
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

