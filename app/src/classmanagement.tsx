import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { supabase } from '../../lib/supabase'; // Supabase client

// Interface for Class data
interface Class {
  id: string;
  class_name: string;
  class_code: string;
  created_at: string;
}

// Interface for Student data
interface Student {
  id: string;
  username: string;
}

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login' | 'signup' | 'dashboard' | 'createclass' | 'classmanagement' | 'camera' | 'files') => void;
}

const ClassManagement: React.FC<Props> = ({ setCurrentPage }) => {
  const [classes, setClasses] = useState<Class[]>([]); // List of classes
  const [students, setStudents] = useState<Student[]>([]); // List of students enrolled in selected class
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [selectedClass, setSelectedClass] = useState<Class | null>(null); // Selected class for viewing students

  // Fetch classes from Supabase
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data, error } = await supabase.from('classes').select('*');
        if (error) throw new Error(error.message);
        setClasses(data || []);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch students based on class ID
  const fetchStudents = async (classId: string) => {
    try {
      // First, fetch the student_class table to get student IDs for the selected class
      const { data: studentClassData, error: studentClassError } = await supabase
        .from('student_class')
        .select('student_id')
        .eq('class_id', classId);

      if (studentClassError) throw new Error(studentClassError.message);

      // Extract student IDs from student_class data
      const studentIds = studentClassData?.map((item: { student_id: string }) => item.student_id);

      if (studentIds && studentIds.length > 0) {
        // Now fetch the students from the users table using these student IDs
        const { data, error } = await supabase
          .from('users')
          .select('id, username') // Only fetch student name and id
          .in('id', studentIds);

        if (error) throw new Error(error.message);
        setStudents(data || []);
      } else {
        setStudents([]); // No students enrolled, set empty list
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Handle click on a class to open its students' list
  const handleClassClick = (classItem: Class) => {
    setSelectedClass(classItem);
    fetchStudents(classItem.id); // Fetch students based on the selected class
    setModalVisible(true);
  };

  // Render class item in FlatList
  const renderClassItem = ({ item }: { item: Class }) => (
    <TouchableOpacity style={styles.classItem} onPress={() => handleClassClick(item)}>
      <Text style={styles.classText}>{item.class_name}</Text>
      <Text style={styles.classText}>Class Code: {item.class_code}</Text>
      <Text style={styles.classText}>Created At: {item.created_at}</Text>
    </TouchableOpacity>
  );

  // Render student name in Modal
  const renderStudentItem = ({ item }: { item: Student }) => (
    <View style={styles.studentItem}>
      <Text style={styles.studentText}>{item.username}</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Classes</Text>
        {/* FlatList for displaying class list */}
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Bottom Navigation Buttons */}
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

      {/* Modal to display students' names */}
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
    </View>
  );
};

// Styles for the component
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly darker overlay for better contrast
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
  studentItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
  },
  studentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  noStudentsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
    marginTop: 20,
  },
});

export default ClassManagement;
