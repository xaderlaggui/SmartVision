import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login' | 'signup' | 'dashboard' | 'createclass' | 'classmanagement' | 'camera' | 'files') => void;
}

const DashboardPage: React.FC<Props> = ({ setCurrentPage }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null); // Stores full user data
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');

  useEffect(() => {
    checkUserSession();
    fetchUserDetails();
  }, []);

  const checkUserSession = async () => {
    try {
      const userSession = await AsyncStorage.getItem('userSession');
      if (!userSession) {
        Alert.alert("Session Expired", "You need to log in again.");
        setCurrentPage('login');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setCurrentPage('login');
    }
  };

  const fetchUserDetails = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      console.log('Fetched user from AsyncStorage:', user);
      if (user) {
        setUsername(user);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', user)
          .single(); // Assumes username is unique

        if (error) {
          throw error;
        }

        setUserDetails(data);
      } else {
        console.log('No user found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleCreateClass = async () => {
    try {
      if (!username || !userDetails || !userDetails.id) {
        Alert.alert("Error", "User details not found. Please log in again.");
        return;
      }

      const teacherId = userDetails.id; // Use the teacher ID from userDetails

      const { data, error } = await supabase
        .from('classes')
        .insert([
          {
            class_name: className,
            class_code: classCode,
            teacher_id: teacherId, // Use teacher ID from the user
          },
        ]);

      if (error) {
        throw error;
      }

      Alert.alert("Success", "Class created successfully!");
      setClassName('');
      setClassCode('');
    } catch (error) {
      console.error("Error creating class:", error);
      Alert.alert("Error", "An error occurred while creating the class.");
    }
    
  };
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userSession');
      setLogoutSuccess(true);
      setTimeout(() => {
        setCurrentPage('login');
      }, 1500);
    } catch (error) {
      console.error("Error clearing session: ", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title1}>CLASSROOM</Text>

        {username ? (
          <Text style={styles.usernameText}>Welcome, {username}!</Text>
          
        ) : (
          <Text style={styles.usernameText}>Loading...</Text>
        )}


        <View style={styles.box2}>
          <Image
            source={require('../../assets/images/sv-logo.png')}
            style={styles.addImage}
          />
        <Text style={styles.createclass}>
            Create Class:
        </Text>
          <TextInput
            style={styles.input}
            placeholder="Class Name"
            value={className}
            onChangeText={setClassName}
          />
          <TextInput
            style={styles.input}
            placeholder="Class Code"
            value={classCode}
            onChangeText={setClassCode}
          />
          <TouchableOpacity
            style={styles.createClassButton}
            onPress={handleCreateClass}
          >
            <Text style={styles.createClassText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.button1}
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
          style={styles.button}
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

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutSuccess}
        onRequestClose={() => setLogoutSuccess(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logged Out Successfully</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Add your existing styles here, including the new style for userDetails
  userDetails: {
    marginVertical: -10,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    textAlign:'center',
  },
  // Other existing styles...
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
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    bottom: 50,
  },
  title1: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: -15,
    borderRadius:10,
    backgroundColor: '#f4f4f4',
    padding:5,
    textAlign:'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom:5,
    color: '#333',
    textAlign:'center',
    backgroundColor: '#f4f4f4',
    bottom: -5,
    borderRadius:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  box2: {
    width: 300,
    height: 470,
    marginBottom: 20,
    backgroundColor: '#D4EBF8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    bottom: -20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius:500,
    bottom:20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor:'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  createClassButton: {
   width: 100,
  height: 30,
  backgroundColor: '#4caf50',
  borderRadius: 10,
  marginTop: 20,
  alignSelf: 'center',
  left: 70,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
  justifyContent: 'center', // Centers text vertically
  alignItems: 'center',      // Centers text horizontally
  bottom: 14,
  },
  createclass:{
    fontWeight:'bold',
    fontSize:20,
    marginTop:-10,
    marginBottom:10,
  },
  createClassText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
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
  button: {
    width: 70,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  logoutButton: {
    width:100,
    height:30,
    resizeMode:'contain',
    backgroundColor: 'red',
    borderRadius: 10,
    marginTop: 20,
    bottom:140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    left:71,
    justifyContent: 'center', // Centers text vertically
    alignItems: 'center',      // Centers text horizontally
    
  },
  logoutText: {
    textAlign:'center',
    color: 'white',
    fontSize: 18,
    fontWeight:'bold',
    
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default DashboardPage;
