import React, { useRef, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login' | 'signup') => void; // Added 'login' and 'signup' options
}

const TeacherPage: React.FC<Props> = ({ setCurrentPage }) => {
  // Initialize animated value for slide animations
  const slideAnim = useRef(new Animated.Value(5000)).current; // Start below for slide-up effect

  useEffect(() => {
    // Slide up animation on mount
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [slideAnim]);

  const handleBackToHome = () => {
    // Slide down animation before navigating back to home
    Animated.timing(slideAnim, {
      toValue: 300, // Slide down to original position
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      // After slide-down animation completes, navigate back to home
      setCurrentPage('home');
    });
  };

  const handleLoginPress = () => {
    setCurrentPage('login'); // Navigate to the Login page
  };

  const handleSignupPress = () => {
    setCurrentPage('signup'); // Navigate to the Signup page
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.innerContainer}>
        <View style={styles.imageContainer}>
          {/* Background image */}
          <Image source={require('../../assets/images/teacher.png')} style={styles.teacherImage} />
          {/* Overlay image */}
          <Image source={require('../../assets/images/teacher-photo.png')} style={styles.overlayImage} />
        </View>

        {/* Authentication buttons */}
        <TouchableOpacity style={styles.authButton} onPress={handleLoginPress}>
          <Text style={styles.authButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authButton} onPress={handleSignupPress}>
          <Text style={styles.authButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  innerContainer: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 20,
    alignItems: 'center',
    marginBottom: 170,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
  imageContainer: {
    width: 330,
    height: 400,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  teacherImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
    bottom: -150,
  },
  overlayImage: {
    position: 'absolute',
    width: 600,
    height: 250,
    resizeMode: 'contain',
    bottom: 130,
  },
  authButton: {
    backgroundColor: '#f1c40f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
  },
  authButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TeacherPage;
