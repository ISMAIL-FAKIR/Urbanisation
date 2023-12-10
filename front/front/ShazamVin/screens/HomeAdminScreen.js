// Import des modules nécessaires
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { Searchbar, Card, Title, Button, IconButton } from 'react-native-paper';
import { Animated } from 'react-native';

// Définition du composant HomeAdminScreen
const HomeAdminScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [searchText, setSearchText] = useState('');
  const backendURL = 'http://192.168.4.36:3000/';
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const fadeInAnim = new Animated.Value(0);

  // Fonction de recherche
  const handleSearch = async (text) => {
    setSearchText(text);

    if (text.trim() !== '') {
      try {
        const response = await axios.get(`${backendURL}wine/search/${text}`);
        setSearchResults(response.data.wines);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching wines:', error.response?.data || error.message);
        // Handle the error, e.g., show an error message to the user
      }
    }
    else {
      setSearchResults([]);
      setShowResults(false);
    }
  };
  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: showResults ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [showResults]);

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      const response = await axios.post(`${backendURL}personne/logout`, {
        userId: user.id,
      });

      console.log(response.data.message);
      navigation.navigate('Home');
      // Redirect to the login screen or any other appropriate screen after logout
    } catch (error) {
      console.error('Error logging out:', error.response?.data || error.message);
      // Handle the error, e.g., show an error message to the user
    }
  };

  // Rendu du composant
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Welcome {user.nom}</Text>
        <TouchableOpacity
          style={[styles.buttonLogout, { backgroundColor: '#e74c3c' }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonLogoutText}>Logout</Text>
          <AntDesign name="logout" size={15} color="white" />
          
        </TouchableOpacity>
      </View>

      {/* Barre de recherche ajoutée */}
      <Searchbar
        placeholder="Search for wines by name"
        value={searchText}
        onChangeText={(text) => handleSearch(text)}
        style={styles.searchInput}
        placeholderTextColor="#808080"
      />

      <Animated.View style={{ opacity: fadeInAnim, flex: 1 }}>
        {searchResults.length > 0 && (
          <FlatList
            style={styles.wineList}
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.wineItem}>
                <Card.Content>
                  <Title style={styles.cardTitle}>{item.nom}</Title>
                  {/* Add other wine details you want to display */}
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => navigation.navigate('FicheVin', { matchedWine: item, userId: user.id })}>
                    View Details
                  </Button>
                </Card.Actions>
              </Card>
            )}
          />
        )}
      </Animated.View>

      <View style={styles.imageContainer}>
        <Image source={require('../images/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4285f4' }]}
          onPress={() => {
            navigation.navigate('Camera');
          }}
        >
          <AntDesign name="camerao" size={24} color="white" />
          <Text style={styles.buttonText}>Scanner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4285f4' }]}
          onPress={() => {
            navigation.navigate('AddVin');
          }}
        >
          <AntDesign name="plus" size={24} color="white" />
          <Text style={styles.buttonText}>Ajouter vin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    position: 'relative',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 400,
    height: 350,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingRight: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4285f4',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#e0e0e0',
    width: '80%',
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '20%',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 15,
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  wineList: {
    width: '100%',
  },
  wineItem: {
    marginBottom: 10,
    backgroundColor: '#4285f4',
  },
  cardTitle: {
    color: 'white',
  },
  buttonLogout: {
    top: 'absolute',
    right:'absolute' , 
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#e74c3c',
  },
  buttonLogoutText:{
    fontWeight: 'bold',
    color: 'white',
    fontSize: 12,
  },
});

export default HomeAdminScreen;
