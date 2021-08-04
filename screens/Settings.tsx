import * as React from 'react';
import { Button, StyleSheet, Text, TouchableHighlight, View, } from 'react-native';
import { useForm } from "react-hook-form"
import FitImage from 'react-native-fit-image';

const icon1 = "../assets/appIcons/icon_dress01.png";
const icon2 = "../assets/appIcons/icon_dress02.png";
const icon3 = "../assets/appIcons/icon_dress03.png";
const icon4 = "../assets/appIcons/icon_dress04.png";
const icon5 = "../assets/appIcons/icon_dress01.png";

const Settings: React.FC<any> = ({ navigation }) => {
  const { getValues, handleSubmit, setValue, register } = useForm();
  register("dressType");

  const submitHandler = (value: any) => {
    console.log("value in submit: ", value);
  }

  const selectDressType = (type: string) => setValue("dressType", type);

  return (
    <View style={styles.mainView}>
      {/* <Button title="Go to Home" onPress={() => navigation.navigate("Home")} /> */}
      <View style={styles.formParent}>
        <Text>Designs:</Text>
        <View>
          <View style={styles.iconParent}>
            <TouchableHighlight onPress={() => selectDressType("unStitched")}>
              <View>
                <FitImage style={styles.icon} source={require(icon1)} />
                <Text>Un-stitched</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight onPress={() => selectDressType("stitched")}>
              <View>
                <FitImage source={require("../assets/appIcons/icon_dress02.png")} />
                <Text>Stitched</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight onPress={() => selectDressType("top")}>
              <View>
                <FitImage source={require("../assets/appIcons/icon_dress03.png")} />
                <Text>Top</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight onPress={() => selectDressType("trousers")}>
              <View>
                <FitImage source={require("../assets/appIcons/icon_dress04.png")} />
                <Text>Trousers</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight onPress={() => selectDressType("dupattas")}>
              <View>
                <FitImage source={require("../assets/appIcons/icon_dress01.png")} />
                <Text>Dupattas</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
      <Button title="Search" onPress={handleSubmit(submitHandler)} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  formParent: {
    display: "flex",
    flexDirection: "row",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 10,
  },
  iconParent: {

  },
  icon: {
    width: 32,
    height: 32,
  }
})



export default Settings;

