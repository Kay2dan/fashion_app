import * as React from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
// import EditScreenInfo from '../components/EditScreenInfo';
// import { Text, View } from '../components/Themed';

const Home: React.FC<any> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.navigate("Settings")} title="Settings" />
      <Button onPress={() => navigation.navigate("Rate Design")} title="Rate Design" />
    </View>
  );
};

export default Home;

