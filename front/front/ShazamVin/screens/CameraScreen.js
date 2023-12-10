import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const CameraScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const backendURL = 'http://192.168.4.36:3000/';

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      setImageUri(photo.uri);
      sendImageToBackend(photo.uri);
    }
  };

  const sendImageToBackend = async (uri) => {
    try {
      // Créez une instance de FormData
      const formData = new FormData();
      formData.append('image', {
        uri,
        type: 'image/jpeg', // ou le type de votre image
        name: 'photo.jpg',
      });
  
      const response = await axios.post(`${backendURL}ocr/process-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Backend response:', response.data);
  
      // Naviguez vers la page FicheVinScreen avec les données du vin correspondant
      navigation.navigate('FicheVin', { matchedWine: response.data.matchedWine });
    } catch (error) {
      console.error('Error sending image to backend:', error);
    }
  };

  return (
    
      <View style={{ flex: 1 }}>
        {hasPermission === null ? (
          <View />
        ) : hasPermission === false ? (
          <Text>No access to camera</Text>
        ) : (
          <View style={{ flex: 1 }}>
            <Camera
              style={{ flex: 1 }}
              type={Camera.Constants.Type.back}
              ref={(ref) => setCameraRef(ref)}
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                  <FontAwesome name="camera" size={30} color="#073fa8" />
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
        )}
      </View>
    
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  captureButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignSelf: 'center',
    marginBottom: -500,
    borderColor: '#073fa8',
    borderWidth: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default CameraScreen;
