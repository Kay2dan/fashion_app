import * as React from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const DesignView: React.FC<any> = ({ navigation }) => {
  return (
    <View style={styles.mainView}>
      {/* <Text style={{ textAlign: 'center' }}>Salam</Text> */}
      <View style={styles.imgContainer}>
        <Image resizeMethod={'auto'} resizeMode={"contain"} source={{ width: 600, height: 250, uri: "https://picsum.photos/seed/picsum/200/300" }} style={styles.img} />
      </View>
      <View style={styles.btnsContainer}>
        <Button title="like" onPress={() => { }} />
        <Button title="dislike" onPress={() => { }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView:
    { width: "100vw", height: "100vh", backgroundColor: "yellow", borderColor: "black", borderWidth: 1, borderStyle: "solid" },
  imgContainer:
    { backgroundColor: "rgba(11,222, 123, 0.25)", width: "92%", height: "80%", marginLeft: "4%" },
  img: { width: "100%", height: "100%" },
  btnsContainer: { flex: 1, flexDirection: "row", justifyContent: "space-around", backgroundColor: "pink" }
})

export default DesignView;





