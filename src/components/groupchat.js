import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSocket } from '../context/socketcontext.js';
import Toast from 'react-native-toast-message';

const GroupChat = ({ navigation }) => {
  const { socket, reconnectSocket } = useSocket();
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const setupSocket = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      setUsername(storedUsername);

      if (!socket) {
        reconnectSocket();
        return;
      }
      socket.emit('join', username);
      socket.emit('getMessageHistory');

      socket.on('updateUsers', (onlineUsers) => {
        const filteredUsers = onlineUsers.filter((user) => user !== username);
        setUsers(filteredUsers);
      });

      socket.on('groupMessage', (data) => {
        setMessages((prev) => [...prev, data]);
        Toast.show({ text1: `New message from ${data.sender}`, text2: data.message, type: 'info' });
      });

      socket.on('messageHistory', (history) => setMessages(history));

      return () => {
        socket.off('updateUsers');
        socket.off('groupMessage');
        socket.off('messageHistory');
      };
    };

    setupSocket();
  }, [socket]);

  const sendMessage = () => {
    if (message.trim() && username) {
      socket.emit('sendMessage', { sender: username, message, timestamp: new Date().toISOString() });
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Toast />
      <Text style={styles.title}>Group Chat</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.message}>
            <Text style={styles.sender}>{item.sender}: </Text>
            {item.message}
          </Text>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sender: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});

export default GroupChat;
