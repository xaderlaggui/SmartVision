import React, { useState, useRef, useEffect } from 'react';
import { 
  View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Animated, Image, 
  KeyboardTypeOptions
} from 'react-native';
import { supabase } from '../../lib/supabase'; // Import Supabase client
import { Ionicons } from '@expo/vector-icons'; // You can install this package for icons

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login' | 'signup') => void;
}

const SignupPage: React.FC<Props> = ({ setCurrentPage }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | ''>('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const slideAnim = useRef(new Animated.Value(800)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 200,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  };

  const isPasswordValid = (password: string) => {
    // Check if password contains at least one letter and one number
    return /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };

  const handleSendOtp = async () => {
    if (!username || !email || !password || !role) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (!isPasswordValid(password)) {
      Alert.alert('Error', 'Password must contain at least one letter and one number.');
      return;
    }

    const otp = generateOtp();
    setIsOtpSent(true);

    try {
      // Store OTP in the database
      const { error } = await supabase.from('otps').insert([
        { email, otp }
      ]);

      if (error) {
        Alert.alert('Error', 'Failed to save OTP. Please try again.');
        setIsOtpSent(false);
        return;
      }

      Alert.alert('Success', 'OTP has been sent to your email.');
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setIsOtpSent(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }

    try {
      // Fetch the OTP from the database
      const { data, error } = await supabase
        .from('otps')
        .select('*')
        .eq('email', email)
        .eq('otp', otp)
        .single();

      if (!data || error) {
        Alert.alert('Error', 'Invalid OTP or OTP has expired.');
        return;
      }

      // Optionally, delete or mark the OTP as verified
      await supabase
        .from('otps')
        .delete()
        .eq('id', data.id);

      // Insert user into the users table
      const { error: userError } = await supabase.from('users').insert([
        { username, email, password, role }
      ]);

      if (userError) {
        Alert.alert('Error', userError.message);
        return;
      }

      Alert.alert('Registration Complete', 'You have successfully signed up!', [
        {
          text: 'OK',
          onPress: () => setCurrentPage('home'),
        },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/images/sv-logo.png')} style={styles.personalImage} />
      </View>
      {!isOtpSent ? (
        <>
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
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!passwordVisible} // Toggle visibility
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
              <Ionicons 
                name={passwordVisible ? 'eye-off' : 'eye'} 
                size={24} 
                color="gray" 
              />
            </TouchableOpacity>
          </View>
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
          <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.text}>ENTER OTP</Text>
          <TextInput
            placeholder="Enter OTP"
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}

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
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
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
    
  },
  personalImage: {
    width: '50%',
    height: '50%',
    borderRadius: 100,
    
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    width: 350, // Slightly smaller to make room for the icon
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 13,
    zIndex:1,
  },
});

export default SignupPage;
