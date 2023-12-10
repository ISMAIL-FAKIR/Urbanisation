import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Alert, FlatList, KeyboardAvoidingView, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';


const FicheVinScreen = ({ navigation, route }) => {
  const { matchedWine, userId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const backendURL = 'http://192.168.4.36:3000/';
  const isFocused = useIsFocused();

  useEffect(() => {
    loadComments();
    loadUserRating();
    loadAverageRating();
    getUserIdFromStorage();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadComments();
      loadUserRating();
      loadAverageRating();
      getUserIdFromStorage();
    }, [isFocused])
  );

  const getUserIdFromStorage = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ID utilisateur depuis AsyncStorage:', error);
    }
  };

  const loadComments = async () => {
    try {
      const response = await axios.get(`${backendURL}comments/get/${matchedWine.id}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires :', error);
    }
  };

  const loadUserRating = async () => {
    try {
      if (userId) {
        const response = await axios.get(`${backendURL}notes/user/${userId}/wine/${matchedWine.id}`);
        setUserRating(response.data.note.valeur);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la note utilisateur :', error);
    }
  };

  const loadAverageRating = async () => {
    try {
      const response = await axios.get(`${backendURL}notes/${matchedWine.id}`);
      setAverageRating(response.data.averageValue);
    } catch (error) {
      console.error('Erreur lors du chargement de la note moyenne :', error);
    }
  };

  const handleAddComment = async () => {
    try {
      await axios.post(`${backendURL}comments/create`, {
        description: newComment,
        userId: userId,
        wineId: matchedWine.id,
      });
      loadComments();
      setNewComment('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire :', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.get(`${backendURL}comments/user/${userId}/wine/${matchedWine.id}`);
      const userComment = response.data.comment;

      if (userComment && userComment.id === commentId) {
        await axios.delete(`${backendURL}comments/delete/${commentId}`, {
          data: { userId: userId, wineId: matchedWine.id }
        });
        loadComments();
      } else {
        console.log('You can only delete your own comments.');
        Alert.alert(
          'Error',
          'You can only delete your own comments.',
          [
            { text: 'OK', style: 'cancel', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire :', error);
    }
  };

  const handleRating = async (rating) => {
    setSelectedRating(rating);
    try {
      await axios.post(`${backendURL}notes/create`, {
        valeur: rating,
        userId: userId,
        wineId: matchedWine.id,
      });
      loadUserRating();
      loadAverageRating();
    } catch (error) {
      console.error('Erreur lors de la notation :', error);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRating(i)}
        >
          <Text style={i <= rating ? styles.ratingStarFilled : styles.ratingStarOutline}>★</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.ratingContainer}>
        {stars}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../images/bg.png')} // Remplacez par le chemin de votre image
      style={styles.backgroundImage}
      blurRadius={8} // Ajustez la valeur pour le flou souhaité
      onLoadEnd={() => setBackgroundImageLoaded(true)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {backgroundImageLoaded && (
          <View style={styles.container}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.appName}>{matchedWine.nom}</Text>

            {matchedWine.photo_blob && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${matchedWine.photo_blob}` }}
                style={styles.logo}
              />
            )}

            <Text style={styles.label}>Description:</Text>
            <Text style={styles.description}>{matchedWine.description}</Text>

            <Text style={styles.label}>Château:</Text>
            <Text style={styles.chateau}>{matchedWine.chateau}</Text>

            <Text style={styles.label}>Prix:</Text>
            <Text style={styles.prix}>{matchedWine.prix}</Text>

            {userId && (
              <TouchableOpacity
                style={styles.commentButton}
                onPress={() => setShowComments(!showComments)}
              >
                <AntDesign name="eye" size={15} color="white" />
                <Text style={styles.commentButtonText}>
                  {showComments ? 'Hide Comments' : 'Show Comments'}
                </Text>
              </TouchableOpacity>
            )}

            {showComments && userId && (
              <>
                <FlatList
                  data={comments}
                  keyExtractor={(item, index) => `${item.id.toString()}_${index}`}
                  renderItem={({ item }) => (
                    <View style={styles.commentContainer}>
                      <Text>{item.description}</Text>
                      <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                        <AntDesign name="delete" size={15} color="white" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </>
            )}

            {userId !== null ? (
              <>
                <View style={styles.commentInputContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                  />
                  <TouchableOpacity
                    style={styles.commentButton}
                    onPress={handleAddComment}
                  >
                    <AntDesign name="plus" size={15} color="white" />
                    <Text style={styles.commentButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Rating:</Text>
                {averageRating !== null && (
                  <Text style={styles.averageRatingText}>Average Rating: {averageRating.toFixed(1)}/5</Text>
                )}
                {true && (
                  renderRatingStars(userRating !== null ? userRating : 0)
                )}
                {userRating !== null && (
                  <Text style={styles.userRatingText}>Your Rating: {userRating}/5</Text>
                )}
              </>
            ) : (
              <View style={styles.loginMessageContainer}>
                <Text style={styles.loginMessage}>
                  Login to comment and rate.
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>click here !</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 5,
  },
  description: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
    color: 'gray',
  },
  chateau: {
    marginBottom: 5,
    fontSize: 16,
    color: 'gray',
  },
  prix: {
    marginBottom: 5,
    fontSize: 16,
    color: 'gray',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(3, 142, 158, 0.8)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 18,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: 'black',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 18,
    marginVertical: 10,
  },
  commentButtonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  ratingStarFilled: {
    color: '#bfaf02',
    fontSize: 24,
    marginRight: 5,
  },
  ratingStarOutline: {
    color: 'white',
    fontSize: 24,
    marginRight: 5,
  },
  userRatingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  averageRatingText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  loginMessage: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
  loginMessageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginMessage: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  loginLink: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default FicheVinScreen;
