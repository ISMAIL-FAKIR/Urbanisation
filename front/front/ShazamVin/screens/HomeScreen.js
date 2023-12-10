import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Searchbar, Card, Title, Button, IconButton } from 'react-native-paper';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { Animated } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const backendURL = 'http://192.168.4.36:3000/';

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const fadeInAnim = new Animated.Value(0);

  const handleSearch = async (text) => {
    setSearchText(text);

    if (text.trim() !== '') {
      try {
        const response = await axios.get(`${backendURL}wine/search/${text}`);
        setSearchResults(response.data.wines);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching wines:', error.response?.data || error.message);
      }
    } else {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>WineScanner</Text>
        <Searchbar
          placeholder="Search for wines by name"
          value={searchText}
          onChangeText={(text) => handleSearch(text)}
          style={styles.searchInput}
          placeholderTextColor="#808080"
        />
      </View>

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
                  <Button onPress={() => navigation.navigate('FicheVin', { matchedWine: item, userId: null })}>
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
            navigation.navigate('Login');
          }}
        >
          <AntDesign name="login" size={24} color="white" />
          <Text style={styles.buttonText}>Se connecter</Text>
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
    alignItems: 'center',
    marginTop: 20,
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
});

export default HomeScreen;
