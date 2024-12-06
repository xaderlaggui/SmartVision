import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, Animated, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import HomePage from '../src/Home';
import TeacherPage from '../src/Teacher';
import PersonalPage from '../src/Personal';
import LoginPage from '../src/login';
import LoginPageStudent from '../src/login-student';
import SignupPage from '../src/signup';
import DashboardPage from '../src/dashboard';  // Import DashboardPage
import CreateClass from '../src/createclass';
import ClassManagement from '../src/classmanagement';
import Camera from '../src/camera';
import Files from '../src/files';
import Classroom from '../src/classroom'

const smartvisionImg = require('../../assets/images/title.png');


const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'teacher' | 'personal' | 'login' |'login-student'|'classroom'| 'signup' | 'dashboard' | 'createclass'|'classmanagement'|'camera'| 'files'>('home');

  // Animated value for shaking the image
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Looping shake animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: -15,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -15,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shakeAnim]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'teacher':
        return <TeacherPage setCurrentPage={setCurrentPage} />;
      case 'personal':
        return <PersonalPage setCurrentPage={setCurrentPage} />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <SignupPage setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage setCurrentPage={setCurrentPage} />;
      case 'createclass': // New case for 'createclass'
        return <CreateClass setCurrentPage={setCurrentPage} />;
      case 'classmanagement': // New case for 'createclass'
        return <ClassManagement setCurrentPage={setCurrentPage} />;
      case 'camera': // New case for 'createclass'
        return <Camera setCurrentPage={setCurrentPage} />;
      case 'files': // New case for 'createclass'
        return <Files setCurrentPage={setCurrentPage} />;
      case 'login-student':
        return <LoginPageStudent setCurrentPage={setCurrentPage} />;
      case 'classroom':
        return <Classroom setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden={false} />
      
      {/* Animated image */}
      <Animated.View style={{ transform: [{ translateY: shakeAnim }] }}>
        <Image source={smartvisionImg} style={styles.image } />
      </Animated.View>

      {renderPage()}

      {/* Go to Home Button outside the container */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex:-1,
    height: '90%',
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#0471ff',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  image: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 0,
    bottom: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    backgroundColor: '#f1c40f',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: 'absolute',
    bottom: 30,
    width: '80%',
    alignItems: 'center',
    transform: [{ translateY: 40 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'relative',
  },
});

export default App;
