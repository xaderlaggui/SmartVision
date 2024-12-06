import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { supabase } from '../../lib/supabase'; // Supabase client
import { Audio } from 'expo-av'; // Import Audio from expo-av

interface File {
  id: string;
  class_name: string;
  class_code: string;
}

interface Feedback {
  id: string;
  feedback_text: string;
  feedback_audio: string; // Assuming this is a URL or path to an audio file
  class_id: string; // Ensure this matches the ID type in your feedback table
}

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login' | 'signup' | 'dashboard' | 'createclass' | 'classmanagement' | 'camera' | 'files') => void;
}

const Files: React.FC<Props> = ({ setCurrentPage }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedClass, setSelectedClass] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('id, class_name, class_code');

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          console.log('Files fetched:', data); // Debugging
          setFiles(data);
        } else {
          console.log('No files found.');
          setFiles([]);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);
  

  const fetchFeedback = async (classId: string) => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('id, feedback_text, feedback_audio')
        .eq('class_id', classId); // Ensure this matches the column name in your feedback table

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        console.log('Feedback fetched:', data); // Debugging
        setFeedback(data);
        setModalVisible(true); // Show modal when feedback is loaded
      } else {
        console.log('No feedback found.');
        setFeedback([]);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const playAudio = async (audioUri: string) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: true }
    );
    setSound(newSound);
  };

  const renderFileItem = ({ item }: { item: File }) => (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => {
        setSelectedClass(item);
        fetchFeedback(item.id); // Use item.id for class_id connection
      }}
    >
      <Text style={styles.fileText}>{item.class_name}</Text>
      <Text style={styles.fileText}>{item.class_code}</Text>
    </TouchableOpacity>
  );

  const renderFeedbackItem = ({ item }: { item: Feedback }) => (
  <View style={styles.feedbackItem}>
    <Text style={styles.feedbackText}>{item.feedback_text}</Text>
    {item.feedback_audio && (
      <TouchableOpacity
        onPress={async () => {
          try {
            const { data, error } = await supabase.storage
              .from('feedback_audio')
              .getPublicUrl(item.feedback_audio);

            if (error) {
              throw new Error(error.message);
            }

            if (data && data.publicUrl) {
              const audioUrl = data.publicUrl;
              console.log('Playing audio:', audioUrl);
              playAudio(audioUrl);
            } else {
              console.log('No public URL returned.');
            }
          } catch (error) {
            console.error('Error fetching audio URL:', error);
          }
        }}
      >
        <Text style={styles.audioText}>Play Audio Feedback</Text>
      </TouchableOpacity>
    )}
  </View>
);

  const pauseAudio = async () => {
    if (sound) {
      try {
        await sound.pauseAsync();
      } catch (error) {
        console.error('Error pausing audio:', error);
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Files</Text>

        {/* FlatList for Files */}
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />

        {/* Modal for feedback */}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Feedback for {selectedClass?.class_name}</Text>
              <FlatList
                data={feedback}
                renderItem={renderFeedbackItem}
                keyExtractor={(item) => item.id}
              />
              <TouchableOpacity style={styles.audioControlButton1} onPress={pauseAudio}>
                <Text style={styles.audioControlButtonText1}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Bottom Navigation Buttons */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.button}
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
          style={styles.button1}
          onPress={() => setCurrentPage('files')}
        >
          <Image source={require('../../assets/images/folder-open.png')} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
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
  fileItem: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    width: '100%',
  },
  fileText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedbackItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  feedbackText: {
    fontSize: 14,
    marginBottom: 5,
  },
  audioText: {
    fontSize: 12,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  closeButton: {
    backgroundColor: '#007BFF', // Customize the background color as needed
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
  closeButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
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
  audioControlButtonText1: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default Files;
