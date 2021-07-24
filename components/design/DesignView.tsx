import * as React from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const DesignView: React.FC<any> = ({ navigation }) => {
  return (
    <View style={{ flex: 2 }}>
      <View style={{ flex: 4, backgroundColor: "yellow" }}>
        <Image resizeMethod={'auto'} resizeMode={"contain"} source={{ uri: "https://picsum.photos/seed/picsum/200/300" }} />
      </View>
      <View style={{ flex: 1 }}>
        <Button title="like" onPress={() => { }} />
        <Button title="dislike" onPress={() => { }} />
      </View>
    </View>
  );
};

export default DesignView;





