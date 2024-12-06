import React, { useRef, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Animated, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure you install react-native-vector-icons

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login' | 'signup') => void; // Added 'login' and 'signup' options
}

const TeacherPage: React.FC<Props> = ({ setCurrentPage }) => {
  const slideAnim = useRef(new Animated.Value(5000)).current;
  const footerAnim = useRef(new Animated.Value(0)).current; // Added for opacity control

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 50,
      useNativeDriver: true,
      friction: 8,
    }).start();

    // Trigger the fade-in animation for the footer
    Animated.timing(footerAnim, {
      toValue: 1,
      duration: 500, // Adjust duration as needed
      useNativeDriver: true,
    }).start();
  }, [slideAnim, footerAnim]);

  // Function to handle the fade-out animation before navigating away
  const fadeOutFooter = (callback: () => void) => {
    Animated.timing(footerAnim, {
      toValue: 0,
      duration: 300, // Adjust duration as needed for the fade-out effect
      useNativeDriver: true,
    }).start(callback);
  };

  const handleBackToHome = () => {
    fadeOutFooter(() => {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setCurrentPage('home');
      });
    });
  };

  const handleLoginPress = () => {
    fadeOutFooter(() => {
      setCurrentPage('login');
    });
  };

  const handleSignupPress = () => {
    fadeOutFooter(() => {
      setCurrentPage('signup');
    });
  };

  const handleOpenWikipedia = () => {
    Linking.openURL('https://en.wikipedia.org/wiki/Braille');
  };

  const handleOpenBritannica = () => {
    Linking.openURL('https://www.britannica.com/topic/Braille-writing-system');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.innerContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/images/teacher.png')} style={styles.teacherImage} />
          <Image source={require('../../assets/images/teacher-photo.png')} style={styles.overlayImage} />
        </View>

        <TouchableOpacity style={styles.authButton} onPress={handleLoginPress}>
          <Text style={styles.authButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authButton} onPress={handleSignupPress}>
          <Text style={styles.authButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.footerContainer, { opacity: footerAnim }]}>
        <TouchableOpacity style={styles.linkButton} onPress={handleOpenWikipedia}>
          <Image source={require('../../assets/images/wiki.png')} style={styles.linkImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton} onPress={handleOpenBritannica}>
          <Image source={require('../../assets/images/britannica.png')} style={styles.linkImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton} onPress={handleBackToHome}>
          <Icon name="arrow-left" size={34} color="black" />
        </TouchableOpacity>
      </Animated.View>
    </View>
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
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  authButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: -70,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  linkButton: {
    width: 60,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginHorizontal: 10,
    backgroundColor: '#0471ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  linkImage: {
    width: 50,
    height: 40,
    resizeMode: 'contain',
  },
});

export default TeacherPage;
