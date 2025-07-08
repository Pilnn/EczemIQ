import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock Camera Component (replace with react-native-image-picker in real app)
const CameraView = ({ onCapture }) => (
  <View style={styles.cameraContainer}>
    <View style={styles.cameraPreview}>
      <Text style={styles.cameraText}>Camera Preview</Text>
      <Text style={styles.cameraSubtext}>Point camera at affected skin area</Text>
    </View>
    <TouchableOpacity style={styles.captureButton} onPress={onCapture}>
      <View style={styles.captureButtonInner} />
    </TouchableOpacity>
  </View>
);

const ScanPage = ({ onImageCaptured }) => {
  const handleCapture = () => {
    // In a real app, this would capture an image using react-native-image-picker
    Alert.alert('Photo Captured', 'Image captured successfully!', [
      { text: 'Analyze', onPress: onImageCaptured },
      { text: 'Retake', style: 'cancel' }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scanContainer}>
        <View style={styles.scanHeader}>
          <Text style={styles.scanTitle}>Scan Your Skin</Text>
          <Text style={styles.scanSubtitle}>
            Position the affected area in the camera frame
          </Text>
        </View>

        <CameraView onCapture={handleCapture} />

        <View style={styles.scanInstructions}>
          <Text style={styles.instructionTitle}>Tips for best results:</Text>
          <Text style={styles.instructionText}>
            • Ensure good lighting
            {'\n'}• Hold camera steady
            {'\n'}• Fill frame with affected area
            {'\n'}• Avoid shadows and reflections
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scanContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scanHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scanTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scanSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    width: width - 40,
    height: width - 40,
    backgroundColor: '#000',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  cameraText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cameraSubtext: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563eb',
  },
  scanInstructions: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 100,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
});

export default ScanPage;