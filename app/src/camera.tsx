import React, { useState } from 'react';
import { View, Text, Image, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition'; // Ensure this import is correct

interface CameraComponentProps {
  setCurrentPage: (page: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ setCurrentPage }) => {
  const [image, setImage] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  const translateBrailleToEnglish = (brailleText: string): string => {
    const brailleToEnglishMap: { [key: string]: string } = {
      '100000': 'a', '101000': 'b', '110000': 'c', '110100': 'd', '100100': 'e',
      '111000': 'f', '111100': 'g', '101100': 'h', '011000': 'i', '011100': 'j',
      '100010': 'k', '101010': 'l', '110010': 'm', '110110': 'n', '100110': 'o',
      '111010': 'p', '111110': 'q', '101110': 'r', '011010': 's', '011110': 't',
      '100011': 'u', '101011': 'v', '011101': 'w', '110011': 'x', '110111': 'y',
      '100111': 'z',
    };

    let englishText = '';
    const brailleChars = brailleText.split(' ');

    brailleChars.forEach(brailleChar => {
      englishText += brailleToEnglishMap[brailleChar] || '?';
    });

    return englishText;
  };

  const handleCapture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access the camera is required!');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
  
      try {
        // Using ML Kit's text recognition method
        const textResult = await TextRecognition.recognize(imageUri);
  
        if (textResult && textResult.text) {
          console.log('OCR Result:', textResult.text);
  
          // Only update the translatedText state if OCR succeeds
          const translated = translateBrailleToEnglish(textResult.text);
          setTranslatedText(translated);
        }
      } catch (error) {
        console.error('Error recognizing text:', error);
        Alert.alert('Failed to extract text from the image.');
      }
    }
  };
  

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Camera</Text>
        <View style={styles.cameraBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imageText}>No image selected</Text>
          )}
        </View>
        {translatedText && (
          <View style={styles.translationBox}>
            <Text style={styles.translationText}>{translatedText}</Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button1} onPress={handleCapture}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentPage('dashboard')}>
          <Image source={require('../../assets/images/home.png')} style={styles.buttonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentPage('classmanagement')}>
          <Image source={require('../../assets/images/document-gear.png')} style={styles.buttonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={() => setCurrentPage('camera')}>
          <Image source={require('../../assets/images/camera.png')} style={styles.buttonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentPage('files')}>
          <Image source={require('../../assets/images/folder-open.png')} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  container: {
    height: 606,
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
  translationBox: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#e8e8e8',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  translationText: {
    fontSize: 16,
    color: '#333',
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
    borderRadius: 20,
    backgroundColor: 'lightgray',
  },
  buttonImage: {
    width: 30,
    height: 30,
  },
});

export default CameraComponent;
