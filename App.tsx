// import 'react-native-gesture-handler';
// import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// import useCachedResources from './hooks/useCachedResources';
// import useColorScheme from './hooks/useColorScheme';
// import Navigation from './navigation';

// export default function App() {
//   const isLoadingComplete = useCachedResources();
//   const colorScheme = useColorScheme();

//   if (!isLoadingComplete) {
//     return null;
//   } else {
//     return (
//       <SafeAreaProvider>
//         <Navigation colorScheme={colorScheme} />
//         <StatusBar />
//       </SafeAreaProvider>
//     );
//   }
// }

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from "react-native"
import Settings from "./screens/Settings";
import Home from "./screens/Home";
import RateDesign from "./screens/RateDesign";

// function HomeScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Home Screen</Text>
//     </View>
//   );
// }

const { Navigator, Screen } = createStackNavigator();

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Navigator initialRouteName="Home" screenOptions={{
          headerStyle: {
            backgroundColor: "pink",
          },
          headerTintColor: "#555",
        }}>
          <Screen name="Home" component={Home} options={{ title: "Rate Designs" }} />
          <Screen name="Settings" component={Settings} options={{ title: "Settings" }} />
          <Screen name="Rate Design" component={RateDesign} options={{ title: "Rate Design" }} />
        </Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;