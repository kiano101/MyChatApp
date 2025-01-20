import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/components/login.js';
import GroupChat from './src/components/groupchat.js';
import { AuthProvider } from './src/context/authcontext.js';
import { SocketProvider } from './src/context/socketcontext.js';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SocketProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="GroupChat" component={GroupChat} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SocketProvider>
  );
};

export default App;
