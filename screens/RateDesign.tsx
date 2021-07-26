import * as React from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import DesignView from "../components/design/DesignView";

const Home: React.FC<any> = ({ navigation }) => {
  return (
    <View style={styles.sectionParent}>
      <DesignView />
      <View style={styles.btnsContainer}>
        <Button title="like" onPress={() => { }} />
        <Button title="dislike" onPress={() => { }} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  sectionParent: {
    flex: 1,
  },
  btnsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "pink"
  }
})



export default Home;





