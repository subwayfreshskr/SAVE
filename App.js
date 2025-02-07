import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgetScreen from './screens/ForgetScreen';
import MainScreen from './screens/MainScreen';
import Main1Screen from './screens/Main1Screen';
import Main2Screen from './screens/Main2Screen';
import save365 from './screens/save365';
import save52 from './screens/save52';
import savecos from './screens/savecos';
import Setting from './screens/setting';
import changepassword from './screens/changepassword';
import DeleteScreen from './screens/DeleteScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{gestureEnabled:false}}/>
        <Stack.Screen name="Register" component={RegisterScreen}  options={{gestureEnabled:false}}/>
        <Stack.Screen name="Forget" component={ForgetScreen} options={{gestureEnabled:false}}/>
        <Stack.Screen name="MainScreen" component={MainScreen} options={{gestureEnabled:false}}/>
        <Stack.Screen name="Main1Screen" component={Main1Screen} options={{gestureEnabled:false}}/>
        <Stack.Screen name="Main2Screen" component={Main2Screen} options={{gestureEnabled:false}}/>
        <Stack.Screen name="save365" component={save365} options={{gestureEnabled:false}}/>
        <Stack.Screen name="save52" component={save52} options={{gestureEnabled:false}}/>
        <Stack.Screen name="savecos" component={savecos} options={{gestureEnabled:false}} />
        <Stack.Screen name="Setting" component={Setting} options={{gestureEnabled:false}}/>
        <Stack.Screen name="changepassword" component={changepassword} options={{gestureEnabled:false}}/>
        <Stack.Screen name="Delete" component={DeleteScreen} options={{gestureEnabled:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}