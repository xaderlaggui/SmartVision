import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal') => void;
}

const HomePage: React.FC<Props> = ({ setCurrentPage }) => {
  // Initialize animated value for slide animations
  const slideAnim = useRef(new Animated.Value(10000)).current; // Start 300 pixels below for initial slide-up

  // Animated value for fade effect
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // State for managing the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of images for the blinking effect
  const images = [
    require('../../assets/images/sample-pic-1.jpg'),
    require('../../assets/images/sample-pic-2.jpg'),
    require('../../assets/images/sample-pic-3.jpg'),
    require('../../assets/images/sample-pic-4.jpg'),
  ];

  useEffect(() => {
    // Slide up animation on mount
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();

    // Change image every second with fade-in and fade-out effect
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000, // Fade out duration
        useNativeDriver: true,
      }).start(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000, // Fade in duration
          useNativeDriver: true,
        }).start();
      });
    }, 4000); // Change image every 1 second

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handlePageChange = (nextPage: 'teacher' | 'personal') => {
    // Slide down animation before navigating to next page
    Animated.timing(slideAnim, {
      toValue: 300, // Slide down to original position
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      // After slide-down animation completes, set next page
      setCurrentPage(nextPage);
    });
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      
      <Text style={styles.title}></Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handlePageChange('teacher')}>
          <View style={styles.imageStack}>
            <Image source={require('../../assets/images/teacher-photo.png')} style={styles.overlayImage} />
            <Image source={require('../../assets/images/teacher.png')} style={styles.buttonImage} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handlePageChange('personal')}>
          <View style={styles.imageStack}>
            <Image source={require('../../assets/images/personal-photo.jpg')} style={styles.overlayImage1} />
            <Image source={require('../../assets/images/student-use.png')} style={styles.buttonImage1} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Blinking image container */}
      <Animated.View style={[styles.blinkContainer, { opacity: fadeAnim }]}>
        <Image source={images[currentImageIndex]} style={styles.blinkImage} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  button: {
    marginHorizontal: 10,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  imageStack: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 300,
  },
  overlayImage: {
    width: 200,
    height: 200,
    marginBottom: -60,
    resizeMode: 'contain',
  },
  overlayImage1: {
    width: 150,
    height: 200,
    resizeMode: 'contain',
    marginBottom: -60,
    marginTop: 20,
  },
  buttonImage: {
    width: 180,
    height: 120,
    resizeMode: 'contain',
  },
  buttonImage1: {
    zIndex: 1,
    width: 180,
    height: 180,
    marginTop: -10,
  },
  blinkContainer: {
    width: 350,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'black',
    bottom: -10,
    borderRadius: 1000,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 1, // Shadow opacity
    shadowRadius: 3.5, // Shadow blur radius
    elevation: 5, // Elevation for Android devices
  },
  
  blinkImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default HomePage;
