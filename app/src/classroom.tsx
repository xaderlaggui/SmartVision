import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Modal,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';


if (Platform.OS === 'android') {
  // Android-specific code
}

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
  const [user, setUser] = useState<any>(null);
  const [classCode, setClassCode] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const session = await AsyncStorage.getItem('userSession');
        if (session) {
          const parsedSession = JSON.parse(session);
          setUser(parsedSession);
        } else {
          setCurrentPage('login-student');
        }
      } catch (error) {
        console.error('Error loading session:', error);
        setCurrentPage('login-student');
      }
    };
    fetchUserSession();
  }, []);

  const fetchClasses = async () => {
    if (user && user.id) {
      try {
        const { data: studentClasses } = await supabase
          .from('student_class')
          .select('class_id')
          .eq('student_id', user.id);

        const { data: classDetails } = await supabase
          .from('classes')
          .select('id, class_name, class_code');

        if (studentClasses && classDetails) {
          const enrolledClasses = studentClasses.map((sc) => sc.class_id);
          const filteredClasses = classDetails.filter((c) =>
            enrolledClasses.includes(c.id)
          );
          setClasses(filteredClasses);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [user]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userSession');
      const { error } = await supabase.auth.signOut();
      if (!error) {
        Alert.alert('Success', 'You have successfully logged out.');
        setCurrentPage('login-student');
      } else {
        Alert.alert('Error', 'Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };
  

  const handleJoinClass = async () => {
    if (!classCode) {
      Alert.alert('Error', 'Please enter a class code.');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, class_name, class_code')
        .eq('class_code', classCode)
        .single();

      if (error || !data) {
        Alert.alert('Error', 'Class not found.');
        return;
      }

      const { error: joinError } = await supabase
        .from('student_class')
        .insert([{ student_id: user.id, class_id: data.id }]);

      if (joinError) {
        Alert.alert('Error', 'Unable to join the class. Please try again.');
      } else {
        Alert.alert('Success', 'You have successfully joined the class!');
        setClassCode('');
        fetchClasses();
      }
    } catch (error) {
      console.error('Error during join class operation:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const fetchFeedback = async (classId: string) => {
    if (!user || !user.id) return;
  
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('feedback_audio')
        .eq('class_id', classId)
        .eq('student_id', user.id);
  
      if (error) {
        console.error('Error fetching feedback:', error);
      } else {
        if (data && data.length > 0) {
          const validUrls = await Promise.all(
            data.map(async (fb) => {
              if (fb.feedback_audio) {
                const { data: urlData } = supabase.storage
                  .from('feedback_audio')
                  .getPublicUrl(fb.feedback_audio);
  
                if (urlData?.publicUrl) {
                  return urlData.publicUrl;
                }
              }
              return null;
            })
          );
  
          const filteredUrls = validUrls.filter((url): url is string => url !== null);
          setFeedback(filteredUrls);
        } else {
          setFeedback([]);
        }
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleClassClick = (item: Class) => {
    setSelectedClass(item);
    fetchFeedback(item.id);
    setModalVisible(true);
  };

  const playAudio = async (url: string) => {
    console.log('Playing audio from URL:', url);
    if (sound) {
      await sound.unloadAsync();
    }
  
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      try {
        await sound.pauseAsync();
      } catch (error) {
        console.error('Error pausing audio:', error);
      }
    }
  };

  const renderClassItem = ({ item }: { item: Class }) => (
    <TouchableOpacity
      style={styles.classItem}
      onPress={() => handleClassClick(item)}
    >
      <Text style={styles.classText}>{item.class_name}</Text>
      <Text style={styles.classText}>Code: {item.class_code}</Text>
    </TouchableOpacity>
  );
  const chunkArray = (array: string[], size: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };
  
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>CLASSROOM</Text>
        <Text style={styles.welcomeText}>
          Welcome, {user?.username || 'User'}!
        </Text>
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter class code"
          value={classCode}
          onChangeText={setClassCode}
        />
        <TouchableOpacity style={styles.joinButton} onPress={handleJoinClass}>
          <Text style={styles.joinButtonText}>Join Class</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal
  visible={modalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>
        {selectedClass?.class_name || 'Class Details'}
      </Text>
      {feedback.length > 0 ? (
        <FlatList
          data={chunkArray(feedback, 3)} // Chunk the feedback array into groups of 3
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.feedbackRow}>
              {item.map((feedbackUrl, i) => (
                <TouchableOpacity
                key={i}
                onPress={() => playAudio(feedbackUrl)}
                style={styles.feedbackButton}
              >
                <View style={styles.feedbackButtonContent}>
                  <Text style={styles.feedbackButtonText}>Feedback {index * 3 + i + 1}</Text>
                  <Ionicons name="play-circle-outline" size={24} color="#FFE31A" />
                </View>
              </TouchableOpacity>
              
              ))}
            </View>
          )}
        />
      ) : (
        <Text>No feedback available for this class.</Text>
      )}
      <TouchableOpacity style={styles.audioControlButton1} onPress={pauseAudio}>
  <Text style={styles.audioControlButtonText1}>Pause</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.audioControlButton2} onPress={() => setModalVisible(false)}>
  <Text style={styles.audioControlButtonText2}>Close</Text>
</TouchableOpacity>
    </View>
  </View>
</Modal>

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
    height: 650,
    width: 350,
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    bottom: 50,
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
  },
  title: {
    fontSize: 30,
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
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
  },
  classText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
    marginBottom: 15,
    width: '100%',
    
  },
  joinButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    overflow: 'scroll',
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    
  },
  feedbackItem: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 10,
  },
  audioControls: {
    marginVertical: 10,
    
  },
  feedbackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  feedbackButton: {
    backgroundColor: '#0471ff',
    padding: 10,
    borderRadius: 50,
    flex: 1, // Allow buttons to expand equally
    marginHorizontal: 5, // Add space between buttons
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
  },
  feedbackButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  feedbackButtonText: {
    color: '#FFE31A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  audioControlButton1: {
    backgroundColor: '#80C4E9', // Customize the background color as needed
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5, // Space between buttons
    borderWidth:0.5,
    borderColor:'black',
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
  },
  audioControlButton2: {
    backgroundColor: '#F1F0E8', // Customize the background color as needed
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5, // Space between buttons
    borderWidth:0.5,
    borderColor:'black',
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.5, // Blur radius of the shadow
    // Android shadow property
    elevation: 5, // Elevation for Android devices
  },
  audioControlButtonText1: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  audioControlButtonText2: {
    color: '#black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default Classroom;
