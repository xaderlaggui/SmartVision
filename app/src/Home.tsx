import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal') => void;
}

const HomePage: React.FC<Props> = ({ setCurrentPage }) => {
  // Initialize animated value for slide animations
  const slideAnim = useRef(new Animated.Value(10000)).current; // Start 300 pixels below for initial slide-up

  useEffect(() => {
    // Slide up animation on mount
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [slideAnim]);

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
    bottom: 80,
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
    resizeMode:'contain',
    marginBottom: -60,
    marginTop:20,
  },
  buttonImage: {
    width: 180,
    height: 120,
    resizeMode: 'contain',
  },
  buttonImage1: {
    zIndex: 1 ,
    width: 180,
    height: 180,
    marginTop:-10,
  },
});

export default HomePage;
