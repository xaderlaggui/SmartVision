import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Animated, Image } from 'react-native';
import { supabase } from '../../lib/supabase'; // Import Supabase client

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login' | 'signup') => void;
}

const SignupPage: React.FC<Props> = ({ setCurrentPage }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | ''>(''); // State for role

  const slideAnim = useRef(new Animated.Value(800)).current; // Initial position off-screen

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 200, // Final position on-screen
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignup = async () => {
    // Validate all fields
    if (!username || !email || !password || !role) {
      Alert.alert('Error', 'All fields are required, including role!');
      return;
    }

    try {
      // Check if the email or username already exists in the database
      const { data: existingUser, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      const { data: existingUsername, error: usernameError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (existingUser || existingUsername) {
        Alert.alert('Error', 'Email or username already exists!');
        return;
      }

      // Insert the new user into Supabase
      const { error } = await supabase.from('users').insert([
        { username, email, password, role },
      ]);

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      Alert.alert('Registration Complete', 'You have successfully signed up!', [
        {
          text: 'OK',
          onPress: () => setCurrentPage('home'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/images/sv-logo.png')} style={styles.personalImage} />
      </View>
      <Text style={styles.text}>USERNAME</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.text}>EMAIL</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.text}>PASSWORD</Text>
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.text}>SELECT ROLE</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setRole('student')}
        >
          <View style={[styles.radioCircle, role === 'student' && styles.selected]} />
          <Text style={styles.radioText}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setRole('teacher')}
        >
          <View style={[styles.radioCircle, role === 'teacher' && styles.selected]} />
          <Text style={styles.radioText}>Teacher</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Go Back to Home Button */}
      <TouchableOpacity 
        style={styles.homeButton} 
        onPress={() => setCurrentPage('home')}
      >
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
    position: 'absolute', // Required for animation
  },
  input: {
    backgroundColor: 'white',
    width: 350,
    padding: 10,
    marginBottom: 20,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 50,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: 250,
    alignItems: 'center',
  },
  text: {
    color: 'black',
    textAlign: 'left',
    width: '78%',
    fontWeight: '500',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: 'black',
    marginTop: 15,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'blue',
    marginRight: 10,
  },
  selected: {
    backgroundColor: 'blue',
  },
  radioText: {
    color: 'black',
  },
  homeButton: {
    backgroundColor: 'orange', // Button color
    padding: 8,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
    marginTop: 60,
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
  },
  personalImage: {
    width: '50%',
    height: '50%',
    borderRadius: 100,
  },
});

export default SignupPage;
