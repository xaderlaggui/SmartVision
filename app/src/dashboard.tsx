import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for session management

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login' | 'signup' | 'dashboard' | 'createclass' | 'classmanagement' | 'camera' | 'files') => void;
}

const DashboardPage: React.FC<Props> = ({ setCurrentPage }) => {
  const [username, setUsername] = useState<string | null>(null);  // State to hold the username
  const [logoutSuccess, setLogoutSuccess] = useState(false);  // State for logout success popup

  // Check session when the component is mounted
  useEffect(() => {
    checkUserSession();
    fetchUsername();  // Fetch username when the component mounts
  }, []);

  // Check if the user is logged in when accessing any page
  const checkUserSession = async () => {
    try {
      const userSession = await AsyncStorage.getItem('userSession');
      if (!userSession) {
        Alert.alert("Session Expired", "You need to log in again.");
        setCurrentPage('login'); // Redirect to login if no session
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setCurrentPage('login'); // Redirect to login if error occurs
    }
  };

  const fetchUsername = async () => {
    try {
      const user = await AsyncStorage.getItem('user'); // Assuming 'user' stores the username
      console.log('Fetched user from AsyncStorage:', user); // Debugging statement
      if (user) {
        setUsername(user);
      } else {
        console.log('No user found in AsyncStorage'); // Debugging statement
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  // Navigate to the CreateClass page if session is valid
  const navigateToCreateClass = async () => {
    try {
      const userSession = await AsyncStorage.getItem('userSession');
      if (userSession) {
        setCurrentPage('createclass'); // Navigate to the Create Class page if session exists
      } else {
        Alert.alert("Session Expired", "Please log in again to access this page.");
        setCurrentPage('login'); // Redirect to login if session is missing
      }
    } catch (error) {
      console.error('Error while checking session:', error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userSession');  // Clear session
      setLogoutSuccess(true); // Show the logout success popup
      setTimeout(() => {
        setCurrentPage('login');  // Redirect to login page after the popup
      }, 1500); // Close the popup after 1.5 seconds
    } catch (error) {
      console.error("Error clearing session: ", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title1}>CLASSROOM</Text>

        {/* Display the username below the title */}
        {username ? (
          <Text style={styles.usernameText}>Welcome, {username}!</Text>
        ) : (
          <Text style={styles.usernameText}>Loading...</Text> // Show loading state if username is not yet available
        )}

        {/* Boxes with text */}
        <View style={styles.box2}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={navigateToCreateClass} // Open the Create Class screen
          >
            <Image 
              source={require('../../assets/images/add.png')} 
              style={styles.addImage} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Separate Bottom Navigation Button Container */}
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

      {/* Logout Button */}
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Logout Success Modal */}
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
  mainContainer: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  container: {
    height: 610,
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
  title1: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: -20,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  box2: {
    width: 300,
    height: 500,
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    bottom: -20,
    position: 'relative',
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
  },
  addImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
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
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
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
