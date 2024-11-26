import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

interface Props {
    setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login' | 'signup' | 'dashboard' | 'createclass' | 'classmanagement'|'camera'| 'files') => void;
}

const CameraComponent: React.FC<Props> = ({ setCurrentPage }) => {
  const [image, setImage] = useState<string | null>(null);

  // Handle Capture Image
  const handleCapture = () => {
    launchCamera(
      { mediaType: 'photo', cameraType: 'back', saveToPhotos: true },
      (response) => {
        if (response.assets && response.assets[0]) {
          setImage(response.assets[0].uri || null);
        }
      }
    );
  };

  // Handle Image Upload
  const handleUpload = () => {
    launchImageLibrary(
      { mediaType: 'photo' },
      (response) => {
        if (response.assets && response.assets[0]) {
          setImage(response.assets[0].uri || null);
        }
      }
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Camera</Text>

        {/* Camera or Image */}
        <View style={styles.cameraBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imageText}>No image selected</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button2} onPress={handleCapture}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button2} onPress={handleUpload}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation Buttons */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentPage('dashboard')}
        >
          <Image source={require('../../assets/images/home.png')} style={styles.buttonImage} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentPage('classmanagement')}
        >
          <Image source={require('../../assets/images/document-gear.png')} style={styles.buttonImage} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button1}
          onPress={() => setCurrentPage('camera')}
        >
          <Image source={require('../../assets/images/camera.png')} style={styles.buttonImage} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentPage('files')}
        >
          <Image source={require('../../assets/images/folder-open.png')} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  container: {
    height: 610,
    width: 350,
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    bottom: 50,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: -30,
    marginBottom: 10,
    marginLeft: -25,
    backgroundColor: 'lightgray',
    width: 350,
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cameraBox: {
    height: 400,
    width: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  imageText: {
    fontSize: 18,
    color: '#7f7f7f',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    width: 70,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 25,
    position: 'absolute',
    bottom: -90,
    borderTopWidth: 2,
    borderTopColor: 'black',
    backgroundColor: 'white',
    paddingVertical: 15,
  },
  button1: {
    width: 70,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    borderRadius: 30,
  },
  buttonImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  button2: {
    width: 120, // Adjust width to make the button larger
    height: 50, // Adjust height for better touch area
    backgroundColor: '#FFE31A', // Green background color for the button
    justifyContent: 'center',
    alignItems: 'center',
    color:'black',
    borderRadius: 10,
    marginHorizontal: 10, // Add space between buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,}
});

export default CameraComponent;
