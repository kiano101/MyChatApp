import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/authcontext.js';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);


  const handleSubmit = async () => {
    if (!login) {
      return <Text>Error: Login function is not available</Text>;
    }
    try {
      const response = await axios.post('http://192.168.1.104:5000/api/auth/login', { email, password });
      const { token, username } = response.data;
      login({ token, username });
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('username', username);
      Toast.show({ text1: 'Welcome Back!', type: 'success' });
      setTimeout(() => navigation.navigate('GroupChat'), 750);
    } catch (error) {
      Toast.show({ text1: 'Login failed! Check your credentials.', type: 'error' });
    }
  };

  return (
    <View style={styles.container}>
      <Toast />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleSubmit} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default Login;
