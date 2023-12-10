import React, { useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const AddVinScreen = ({ navigation }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [embouteillage, setEmbouteillage] = useState('');
  const [cepage, setCepage] = useState('');
  const [chateau, setChateau] = useState('');
  const [prix, setPrix] = useState('');
  const [photoBlob, setPhotoBlob] = useState(null);
  const backendURL = 'http://192.168.4.36:3000/';

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
      setPhotoBlob(result.uri);
    }
  };

  const handleCreateWine = async () => {
    try {
      const response = await axios.post(`${backendURL}/wine/create`, {
        nom,
        description,
        embouteillage,
        cepage,
        chateau,
        prix,
        photoBlob,
      });

      // Traitez la réponse ou affichez un message de succès
      console.log('Vin créé avec succès:', response.data);
      navigation.navigate('FicheVin', { matchedWine: response.data.wine });
    } catch (error) {
      // Gérez les erreurs
      console.error('Erreur lors de la création du vin:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../images/bg1.png')} // Remplacez par le chemin de votre image
      style={styles.backgroundImage}
      blurRadius={8} // Ajustez la valeur pour le flou souhaité
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Add a Wine</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={nom}
            onChangeText={setNom}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Embouteillage"
            value={embouteillage}
            onChangeText={setEmbouteillage}
          />
          <TextInput
            style={styles.input}
            placeholder="Cepage"
            value={cepage}
            onChangeText={setCepage}
          />
          <TextInput
            style={styles.input}
            placeholder="Chateau"
            value={chateau}
            onChangeText={setChateau}
          />
          <TextInput
            style={styles.input}
            placeholder="Prix"
            value={prix}
            onChangeText={setPrix}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#3498db' }]}
            onPress={handleChoosePhoto}
          >
            <MaterialIcons name="add-a-photo" size={24} color="white" />
            <Text style={styles.buttonText}>Importer photo</Text>
          </TouchableOpacity>
          {photoBlob && (
            <Image source={{ uri: photoBlob }} style={styles.image} />
          )}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#2ecc71' }]}
            onPress={handleCreateWine}
          >
            <MaterialIcons name="add" size={24} color="white" />
            <Text style={styles.buttonText}>Ajouter le Vin</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
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
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginVertical: 10,
  },
});

export default AddVinScreen;
