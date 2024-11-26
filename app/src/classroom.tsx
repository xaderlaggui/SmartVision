import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { supabase } from '../../lib/supabase'; // Import your Supabase client

interface Class {
  id: string;
  class_name: string;
  class_code: string;
}

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login-student' | 'signup' | 'dashboard' | 'createclass' | 'classmanagement' | 'camera' | 'files') => void;
}

const Classroom: React.FC<Props> = ({ setCurrentPage }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [user, setUser] = useState<any>(null); // State for storing logged-in user

  // Fetch the logged-in user's session from AsyncStorage
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const session = await AsyncStorage.getItem('userSession');
        if (session) {
          const parsedSession = JSON.parse(session);
          console.log('LOG Fetched user from AsyncStorage:', parsedSession); // Log the fetched user
          setUser(parsedSession); // Save the user session
        } else {
          // Redirect to login if no session is found
          setCurrentPage('login-student');
        }
      } catch (error) {
        console.error('Error loading session:', error);
        setCurrentPage('login-student');
      }
    };
  
    fetchUserSession();
  }, []);
  

  // Fetch classes for the logged-in user
  useEffect(() => {
    const fetchClasses = async () => {
      if (user && user.id) {
        try {
          const [studentClasses, classDetails] = await Promise.all([
            supabase
              .from('student_class')
              .select('class_id')
              .eq('student_id', user.id),
  
            supabase
              .from('classes')
              .select('id, class_name, class_code')
          ]);
  
          if (studentClasses.error || classDetails.error) {
            console.error('Error fetching data:', studentClasses.error || classDetails.error);
          } else {
            const enrolledClasses = studentClasses.data?.map((sc) => sc.class_id);
            const filteredClasses = classDetails.data?.filter((c) => enrolledClasses.includes(c.id));
            setClasses(filteredClasses || []);
          }
        } catch (error) {
          console.error('Error fetching classes:', error);
        }
      }
    };
  
    fetchClasses();
  }, [user]);
  

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear session from AsyncStorage and Supabase auth
      await AsyncStorage.removeItem('userSession');
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error logging out:', error);
        Alert.alert('Error', 'Unable to logout. Please try again.');
      } else {
        setCurrentPage('login-student'); // Redirect to login
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Render a class item in the list
  const renderClassItem = ({ item }: { item: Class }) => (
    <TouchableOpacity style={styles.classItem}>
      <Text style={styles.classText}>{item.class_name}</Text>
      <Text style={styles.classText}>Code: {item.class_code}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>CLASSROOM</Text>
        <Text style={styles.welcomeText}>Welcome, {user?.username || 'User'}!</Text>
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'gray',
  },
  classItem: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    width: '100%',
  },
  classText: {
    fontSize: 16,
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 120,
    marginLeft: 'auto',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Classroom;
