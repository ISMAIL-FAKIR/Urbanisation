import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const backendURL = 'http://192.168.4.36:3000/';

  const showToast = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      visibilityTime: 2000,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${backendURL}personne/login`, {
        email,
        password,
      });

      if (response.data.user.role === 'user') {
        showToast('success', 'Connexion réussie!');
        setTimeout(() => {
          navigation.navigate('HomeUser', { user: response.data.user });
        }, 3000);
      } else if (response.data.user.role === 'admin') {
        showToast('success', 'Connexion réussie!');
        setTimeout(() => {
          navigation.navigate('HomeAdmin', { user: response.data.user });
        }, 3000);
      }

    } catch (error) {
      showToast('error', 'Identifiants incorrects');
      console.error('Erreur de connexion :', error);
    }
  };

  return (
    <ImageBackground
      source={require('../images/bg.png')} // Remplacez par le chemin de votre image
      style={styles.backgroundImage}
      blurRadius={8} // Ajustez la valeur pour le flou souhaité
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Mot de passe"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4285f4' }]} 
          onPress={handleLogin}
        >
          <AntDesign name="login" size={24} color="white" > Se connecter</AntDesign>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Inscription')}>
          <Text style={styles.link}>Pas de compte? Inscrivez-vous ici</Text>
        </TouchableOpacity>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 29,
    marginBottom: 20,
    color: '#4285f4',
  },
  input: {
    height: 40,
    borderColor: '#0d0d0d',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    width: '80%',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  link: {
    fontWeight: 'bold',
    marginTop: 20,
    color: '#e74c3c',
  },
  button: {
    margin: 10,
    padding: 20,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
});

export default LoginScreen;
