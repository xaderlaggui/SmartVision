import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login' | 'signup' | 'dashboard' | 'createclass' | 'classmanagement' | 'camera' | 'files') => void;
}

const CreateClass: React.FC<Props> = ({ setCurrentPage }) => {
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [subjectSchedule, setSubjectSchedule] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Check if all fields are filled
    if (!className || !section || !subjectSchedule) {
      setMessage('Please complete the details');
    } else {
      setMessage('Class added successfully');
      // Reset form fields (optional)
      setClassName('');
      setSection('');
      setSubjectSchedule('');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Create Class</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Class Name"
            value={className}
            onChangeText={setClassName}
          />
          <Text style={styles.label}>Class Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Section"
            value={section}
            onChangeText={setSection}
          />
          <Text style={styles.label}>Section</Text>
          <TextInput
            style={styles.input}
            placeholder="Subject and Schedule"
            value={subjectSchedule}
            onChangeText={setSubjectSchedule}
          />
          <Text style={styles.label}>Subject and Schedule</Text>
          <TouchableOpacity style={styles.button1} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>

      {/* Separate Bottom Navigation Button Container */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentPage('dashboard')} // Navigate to Dashboard
        >
          <Image source={require('../../assets/images/home.png')} style={styles.buttonImage} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentPage('classmanagement')} // Navigate to Teacher page
        >
          <Image source={require('../../assets/images/document-gear.png')} style={styles.buttonImage} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentPage('camera')} // Navigate to Personal page
        >
          <Image source={require('../../assets/images/camera.png')} style={styles.buttonImage} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentPage('files')} // Navigate to Login page
        >
          <Image source={require('../../assets/images/folder-open.png')} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    zIndex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 300, // Adjusting to full height
  },
  container: {
    width: 350,
    padding: 25,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 20,
    bottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 30,
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button1: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 25,
    position: 'absolute',
    bottom: -340,
    borderTopWidth: 2,
    borderTopColor: 'black',
    backgroundColor: 'white',
    paddingVertical: 13,
  },
  button: {
    width: 70,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});

export default CreateClass;
