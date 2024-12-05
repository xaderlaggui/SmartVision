import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

interface Props {
  setCurrentPage: (page: 'home' | 'personal' | 'login-student' | 'signup' | 'dashboard' | 'classroom') => void;
}

const LoginPageStudent: React.FC<Props> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(800)).current; // Initial position off-screen

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 200, // Final position on-screen
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address!');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('role', 'student')
        .single();

      setLoading(false);

      if (error) {
        Alert.alert('Login Failed', 'Invalid credentials or not a student account!');
      } else if (data) {
        await AsyncStorage.setItem('userSession', JSON.stringify(data));
        await AsyncStorage.setItem('user', data.username);

        Alert.alert('Login Successful', `Welcome back, ${data.username}!`, [
          {
            text: 'OK',
            onPress: () => setCurrentPage('classroom'),
          },
        ]);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(error);
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/images/sv-logo.png')} style={styles.personalImage} />
      </View>
      <Text style={styles.title}>WELCOME!!</Text>
      <Text style={styles.text}>EMAIL</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.text}>PASSWORD</Text>
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCurrentPage('signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeButton} onPress={() => setCurrentPage('home')}>
        <Text style={styles.homeButtonText}>Return</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    zIndex: +2,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#d7e0ee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    position: 'absolute', // Positioning required for animation
  },
  input: {
    backgroundColor: 'white',
    width: 350,
    padding: 10,
    marginBottom: 20,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 50,
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: 250,
    alignItems: 'center',
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
    
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  text: {
    color: 'black',
    textAlign: 'left',
    width: '78%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: 'red',
    marginTop: 15,
  },
  homeButton: {
    backgroundColor: 'orange',
    padding: 8,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
    marginTop: 80,
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
  },
  homeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 300,
    height: 300,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: -150,
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
  },
  personalImage: {
    width: '50%',
    height: '50%',
    borderRadius: 100,
  },
});

export default LoginPageStudent;
