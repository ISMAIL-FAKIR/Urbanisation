import * as React from 'react';
import { NavigationContainer, StackRouter } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import CameraScreen from './screens/CameraScreen';
import InscriptionScreen from './screens/InscriptionScreen';
import FicheVinScreen from './screens/FicheVinScreen';
import HomeUserScreen from './screens/HomeUserScreen';
import HomeAdminScreen from './screens/HomeAdminScreen';
import AddVinScreen from './screens/AddVinScreen';



const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inscription" component={InscriptionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="FicheVin" component={FicheVinScreen} />
        <Stack.Screen name="HomeAdmin" component={HomeAdminScreen} />
        <Stack.Screen name="HomeUser" component={HomeUserScreen} />
        <Stack.Screen name="AddVin" component={AddVinScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
