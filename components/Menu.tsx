import React, { useState } from 'react';
import { Button, Modal, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
// import EditScreenInfo from '../components/EditScreenInfo';
// import { Text, View } from '../components/Themed';


// const Item: React.FC<any> = ({ item, onPress }) => {
//   return (
//     <View>
//       <Text>{item}</Text>
//     </View>
//   )
// };




const Menu: React.FC<any> = ({ }) => {
  const [modalVisible, setModalVisible] = useState(false);


  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.container}>
          <View>
            <Text>Category:</Text>
          </View>
          <View>
            <Text>Stitched</Text>
            <Text>Un-Stitched</Text>
            <Text>Tops</Text>
            <Text>Trousers</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "nowrap"
  }

})

export default Menu;

