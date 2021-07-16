import * as React from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Menu from "../components/Menu"
// import EditScreenInfo from '../components/EditScreenInfo';
// import { Text, View } from '../components/Themed';

const Settings: React.FC<any> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
      {/* <View>
        <Text>Designs:</Text>
        <ScrollView>
          <Text>Stitched</Text>
          <Text>Un-stitched</Text>
          <Text>Tops</Text>
          <Text>Trousers</Text>
          <Text>Dupattas</Text>
        </ScrollView>
      </View> */}
      <Menu />
    </View>
  );
};

export default Settings;

