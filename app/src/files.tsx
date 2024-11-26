import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal } from 'react-native';

interface File {
  id: string;
  name: string;
  size: string;
  type: 'PNG' | 'JPEG'; // Restricting file type to PNG or JPEG
  date: string;
  translation: string; // Added translation field to each file
}

interface Props {
  setCurrentPage: (page: 'home' | 'teacher' | 'personal' | 'login' | 'signup' | 'dashboard' | 'createclass' | 'classmanagement' | 'camera' | 'files') => void;
}

const Files: React.FC<Props> = ({ setCurrentPage }) => {
  const [files, setFiles] = useState<File[]>([
    { id: '1', name: 'Image 1', size: '1.2MB', type: 'PNG', date: '2024-11-10', translation: 'Translation for Image 1' },
    { id: '2', name: 'Photo 1', size: '500KB', type: 'JPEG', date: '2024-11-09', translation: 'Translation for Photo 1' },
    { id: '3', name: 'Image 2', size: '200KB', type: 'PNG', date: '2024-11-08', translation: 'Translation for Image 2' },
    { id: '4', name: 'Photo 2', size: '1.5MB', type: 'JPEG', date: '2024-11-07', translation: 'Translation for Photo 2' },
    { id: '5', name: 'Image 3', size: '2.3MB', type: 'PNG', date: '2024-11-06', translation: 'Translation for Image 3' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState<string>('');

  // Handle File Management
  const handleFileManagement = () => {
    setCurrentPage('files'); // This can be used to switch pages if necessary.
  };

  // Open modal with translation when file is clicked
  const handleFileClick = (translation: string) => {
    setSelectedTranslation(translation);
    setModalVisible(true);
  };

  // Render each file item with individual boxes
  const renderFileItem = ({ item }: { item: File }) => (
    <TouchableOpacity style={styles.fileItem} onPress={() => handleFileClick(item.translation)}>
      <Text style={styles.fileText}>{item.name}</Text>
      <Text style={styles.fileText}>{item.type} - {item.size}</Text>
      <Text style={styles.fileText}>Last Modified: {item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Files</Text>

        {/* FlatList for Files */}
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false} // Optional: hides the vertical scroll indicator
        />
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

      {/* Modal to display translation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.translationText}>{selectedTranslation}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  translationText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Files;
