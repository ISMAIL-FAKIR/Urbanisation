import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';

const InscriptionScreen = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const navigation = useNavigation();
  const toastRef = useRef(null);
  const backendURL = 'http://192.168.4.36:3000/';

  const handleInscription = async () => {
    // Vérifier si un champ est vide
    if (!prenom || !nom || !email || !motDePasse) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Veuillez remplir tous les champs',
        visibilityTime: 2000,
      });
      return;
    }

    try {
      const response = await axios.post(`${backendURL}personne/register`, {
        prenom,
        nom,
        email,
        password: motDePasse,
        role: 'admin',
      });

      // Si l'inscription réussit, afficher une notification
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Inscription réussie!',
        visibilityTime: 2000,
      });
      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);

    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Erreur lors de l\'inscription',
        visibilityTime: 2000,
      });
      console.error('Erreur d\'inscription :', error);
    }
  };

  return (
    <ImageBackground
      source={require('../images/bg.png')} // Remplacez par le chemin de votre image
      style={styles.backgroundImage}
      blurRadius={8} // Ajustez la valeur pour le flou souhaité
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>Inscription</Text>
          <TextInput
            placeholder="Prénom"
            style={styles.input}
            value={prenom}
            onChangeText={setPrenom}
          />
          <TextInput
            placeholder="Nom"
            style={styles.input}
            value={nom}
            onChangeText={setNom}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Mot de passe"
            secureTextEntry
            style={styles.input}
            value={motDePasse}
            onChangeText={setMotDePasse}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#4285f4' }]}
            onPress={handleInscription}
          >
            <AntDesign name="user" size={24} color="white" > S'inscrire</AntDesign>
          </TouchableOpacity>
          <Toast ref={toastRef} />
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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

export default InscriptionScreen;
