import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase'; // Supabase client

interface Class {
  id: string;
  class_name: string;
  class_code: string;
  created_at: string;
}

interface Student {
  id: string;
  username: string;
}

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login' | 'signup' | 'dashboard' | 'createclass' | 'classmanagement' | 'camera' | 'files') => void;
}

const ClassManagement: React.FC<Props> = ({ setCurrentPage }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedUserId = await AsyncStorage.getItem('user_id');
        if (storedUser) {
          setUsername(storedUser);
        }
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      if (username) {
        try {
          console.log('Fetching user ID for username:', username); // Debugging
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('username', username)
            .single();
  
          if (userError) {
            throw new Error(userError.message);
          }
  
          if (userData) {
            console.log('User ID fetched:', userData.id); // Debugging
            const { data, error } = await supabase
              .from('classes')
              .select('id, class_name, class_code, created_at')
              .eq('teacher_id', userData.id);
  
            if (error) {
              throw new Error(error.message);
            }
  
            if (data && data.length > 0) {
              console.log('Classes fetched:', data); // Debugging
              setClasses(data);
            } else {
              console.log('No classes found for this user.');
              setClasses([]);
            }
          } else {
            console.log('User ID not found.');
            setClasses([]);
          }
        } catch (error) {
          console.error('Error fetching classes:', error);
        }
      }
    };
  
    fetchClasses();
  }, [username]);

  const fetchStudents = async (classId: string) => {
    try {
      const { data: studentClassData, error: studentClassError } = await supabase
        .from('student_class')
        .select('student_id')
        .eq('class_id', classId);

      if (studentClassError) throw new Error(studentClassError.message);

      const studentIds = studentClassData?.map((item: { student_id: string }) => item.student_id);

      if (studentIds && studentIds.length > 0) {
        const { data, error } = await supabase
          .from('users')
          .select('id, username')
          .in('id', studentIds);

        if (error) throw new Error(error.message);
        setStudents(data || []);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleClassClick = (classItem: Class) => {
    setSelectedClass(classItem);
    fetchStudents(classItem.id);
    setModalVisible(true);
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setFeedbackModalVisible(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedStudent || !selectedClass || !feedback) {
      alert('Please fill in all fields before submitting.');
      return;
    }
  
    try {
      // Construct the feedback data object (no `id` field)
      const feedbackData = {
        student_id: selectedStudent.id,
        feedback_text: feedback,
        class_id: selectedClass.id,
      };
  
      // Insert the feedback into the Supabase `feedback` table
      const { data, error } = await supabase
        .from('feedback')
        .insert([feedbackData]);
  
      if (error) {
        throw new Error(error.message);
      }
  
      console.log('Feedback successfully submitted:', data);
      alert('Feedback submitted successfully');
  
      // Reset feedback and close modal
      setFeedback('');
      setFeedbackModalVisible(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };
  

  const renderClassItem = ({ item }: { item: Class }) => (
    <TouchableOpacity style={styles.classItem} onPress={() => handleClassClick(item)}>
      <Text style={styles.classText}>{item.class_name}</Text>
      <Text style={styles.classText}>Class Code: {item.class_code}</Text>
      <Text style={styles.classText}>Created At: {item.created_at}</Text>
    </TouchableOpacity>
  );

  const renderStudentItem = ({ item }: { item: Student }) => (
    <TouchableOpacity style={styles.studentItem} onPress={() => handleStudentClick(item)}>
      <Text style={styles.studentText}>{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Classes</Text>
        {username && <Text style={styles.welcomeText}>Welcome, {username}!</Text>}
        {classes.length === 0 ? (
          <Text style={styles.noClassesText}>No classes available</Text>
        ) : (
          <FlatList
            data={classes}
            renderItem={renderClassItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentPage('dashboard')}>
          <Image source={require('../../assets/images/home.png')} style={styles.buttonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={() => setCurrentPage('classmanagement')}>
          <Image source={require('../../assets/images/document-gear.png')} style={styles.buttonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentPage('camera')}>
          <Image source={require('../../assets/images/camera.png')} style={styles.buttonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentPage('files')}>
          <Image source={require('../../assets/images/folder-open.png')} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>

      {/* Modal for class details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Students in {selectedClass?.class_name}</Text>
            {students.length === 0 ? (
              <Text style={styles.noStudentsText}>No students enrolled in here</Text>
            ) : (
              <FlatList
                data={students}
                renderItem={renderStudentItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for feedback */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={feedbackModalVisible}
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Feedback/Comment for {selectedStudent?.username}</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Enter your feedback here..."
              value={feedback}
              onChangeText={setFeedback}
            />
            <Button title="Submit" onPress={handleFeedbackSubmit} />
            <TouchableOpacity style={styles.closeButton} onPress={() => setFeedbackModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles omitted for brevity; add `feedbackInput` style to your existing styles.

const styles = StyleSheet.create({
  feedbackInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  container: {
    height: 606,
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
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: -30,
    marginBottom: 10,
    marginLeft: -25,
    backgroundColor: 'lightgray',
    width: 350,
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
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
  noClassesText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 40,
        position: 'absolute',
        bottom: -90,
        borderTopWidth: 2,
        borderTopColor: 'black',
        backgroundColor: 'white',
        paddingVertical: 10,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noStudentsText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  studentItem: {
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  studentText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ClassManagement;
