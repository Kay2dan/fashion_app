import * as React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import FitImage from 'react-native-fit-image';

const DesignView: React.FC<any> = ({ navigation }) => {
  return (
    <View style={styles.mainView}>
      <FitImage
        source={require("../../assets/appIcons/placeholder_design.png")}
        style={styles.img}
      />
      <View style={styles.abs}>
        <View style={styles.designInfo}>
          <Text style={styles.designText} >Style name</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: "96%",
    height: "92%",
    marginLeft: "2%",
    backgroundColor: "blue",
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid"
  },
  img: {
    borderRadius: 4,
  },
  abs: {
    position: "absolute",
    bottom: 15,
    marginLeft: 5,
  },
  designInfo: {
    backgroundColor: "hsla(158, 20%, 10%, 0.75)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  designText: {
    color: "white"
  }
})

export default DesignView;





