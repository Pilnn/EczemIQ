import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { TensorflowModel, useTensorflowModel } from 'react-native-fast-tflite';
import ImageResizer from 'react-native-image-resizer';
import ImageBase64 from 'react-native-image-base64';
import jpeg from 'jpeg-js';


const { width, height } = Dimensions.get('window');

const ScanPage = ({ onModelFinished }) => {
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Use the hook to load the model
  const model = useTensorflowModel(require('../assets/model.tflite'));
  
  const imagePickerOptions = {
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1200,
    maxHeight: 1200,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  // Check model loading status
  useEffect(() => {
    if (model.state === 'loaded') {
      console.log('Model loaded successfully');
    } else if (model.state === 'error') {
      console.error('Error loading model:', model.error);
      Alert.alert(
        'Model Loading Error', 
        `Failed to load AI model: ${model.error.message}\n\nPlease check:\n1. Model file exists in assets folder\n2. Native module is properly linked\n3. App permissions are granted`
      );
    }
  }, [model.state]);

const loadAndRun = async () => {
  if (model.state !== 'loaded') {
    Alert.alert('Error', 'Model is not loaded yet. Please wait a moment and try again.');
    return;
  }

  if (!capturedImage) {
    Alert.alert('Error', 'No image captured');
    return;
  }

  setIsAnalyzing(true);

  try {
    console.log('Starting analysis for ResNet-152...');
    
    // Preprocess the image for ResNet-152
    const preprocessedInput = await preprocessImageForResNet152(capturedImage.uri);
    console.log('finished preprocessing');
    
    // Run inference with the model - pass as array
    const modelOutput = await model.model.run([preprocessedInput]);
    console.log(modelOutput);
    // Process the model output to get predictions
    
    const probabilities=modelOutput[0];
    // Call the transition function with formatted results
    onModelFinished(probabilities);

    

  } catch (error) {
    console.error('Error running ResNet-152 model:', error);
    Alert.alert('Error', `Failed to analyze image: ${error.message}`);
    
    
  } finally {
    setIsAnalyzing(false);
  }
};

// ResNet-152 specific image preprocessing
const preprocessImageForResNet152 = async (imageUri) => {
  const INPUT_SIZE = 224;
  const IMAGENET_MEAN_BGR = [103.939, 116.779, 123.68];

  try {
    // Step 1: Resize image
    const resized = await ImageResizer.createResizedImage(
      imageUri, INPUT_SIZE, INPUT_SIZE, 'JPEG', 100
    );

    // Step 2: Get base64
    const base64 = await ImageBase64.getBase64String(resized.uri);
    
    // Step 3: Convert base64 to buffer for jpeg-js
    const binaryString = atob(base64);
    const buffer = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      buffer[i] = binaryString.charCodeAt(i);
    }

    // Step 4: Decode JPEG to get raw RGBA pixels
    const decoded = jpeg.decode(buffer, { useTArray: true });
    
    // Step 5: Apply ResNet preprocessing
    const preprocessed = new Float32Array(INPUT_SIZE * INPUT_SIZE * 3);
    let idx = 0;
    
    // decoded.data is RGBA, we need RGB->BGR conversion
    for (let i = 0; i < decoded.data.length; i += 4) {
      const r = decoded.data[i];
      const g = decoded.data[i + 1];
      const b = decoded.data[i + 2];
      // Skip alpha channel (i + 3)
      
      // Convert RGB to BGR and subtract means
      preprocessed[idx] = b - IMAGENET_MEAN_BGR[0];     // B
      preprocessed[idx + 1] = g - IMAGENET_MEAN_BGR[1]; // G
      preprocessed[idx + 2] = r - IMAGENET_MEAN_BGR[2]; // R
      idx += 3;
    }
    
    return preprocessed;
    
  } catch (error) {
    console.error('Preprocessing error:', error);
    throw error;
  }
};

  const handleCameraCapture = () => {
    launchCamera(imagePickerOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
        return;
      }
      
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageData = response.assets[0];
        setCapturedImage(imageData);
        
        // Show confirmation dialog
        Alert.alert(
          'Photo Captured',
          'Would you like to analyze this image?',
          [
            { text: 'Retake', style: 'cancel', onPress: () => setCapturedImage(null) },
            { 
              text: 'Analyze', 
              onPress: loadAndRun
            }
          ]
        );
      }
    });
  };

  const handleGallerySelect = () => {
    launchImageLibrary(imagePickerOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled gallery');
        return;
      }
      
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageData = response.assets[0];
        setCapturedImage(imageData);
        
        // Show confirmation dialog
        Alert.alert(
          'Image Selected',
          'Would you like to analyze this image?',
          [
            { text: 'Choose Different', style: 'cancel', onPress: () => setCapturedImage(null) },
            { 
              text: 'Analyze', 
              onPress: loadAndRun
            }
          ]
        );
      }
    });
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to capture your image',
      [
        { text: 'Camera', onPress: handleCameraCapture },
        { text: 'Gallery', onPress: handleGallerySelect },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const RecommendationsModal = () => (
    <Modal
      visible={showRecommendations}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowRecommendations(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>📸 Photography Tips</Text>
          
          <View style={styles.tipsContainer}>
            <Text style={styles.tipItem}>💡 Ensure good, natural lighting</Text>
            <Text style={styles.tipItem}>📱 Hold your device steady</Text>
            <Text style={styles.tipItem}>🎯 Fill the frame with the affected area</Text>
            <Text style={styles.tipItem}>🚫 Avoid shadows and reflections</Text>
            <Text style={styles.tipItem}>📏 Keep a consistent distance (6-8 inches)</Text>
            <Text style={styles.tipItem}>🔍 Make sure the image is clear and focused</Text>
          </View>

          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => setShowRecommendations(false)}
          >
            <Text style={styles.dismissButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <RecommendationsModal />
      
      <View style={styles.scanContainer}>
        <View style={styles.scanHeader}>
          <Text style={styles.scanTitle}>Scan Your Skin</Text>
          <Text style={styles.scanSubtitle}>
            Capture a clear image of the affected area
          </Text>
          {model.state === 'loading' && (
            <Text style={styles.loadingText}>Loading AI model...</Text>
          )}
          {model.state === 'error' && (
            <Text style={styles.errorText}>Failed to load model</Text>
          )}
          {model.state === 'loaded' && (
            <Text style={styles.successText}>Model ready!</Text>
          )}
        </View>

        <View style={styles.cameraContainer}>
          {capturedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: capturedImage.uri }} style={styles.imagePreview} />
              <Text style={styles.imagePreviewText}>
                {isAnalyzing ? 'Analyzing...' : 'Image captured successfully!'}
              </Text>
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.cameraPlaceholderText}>📷</Text>
              <Text style={styles.cameraSubtext}>
                Tap the button below to capture an image
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.captureButton, model.state !== 'loaded' && styles.disabledButton]}
            onPress={showImagePickerOptions}
            disabled={model.state !== 'loaded' || isAnalyzing}
          >
            <View style={styles.captureButtonInner}>
              <Text style={styles.captureButtonText}>
                {isAnalyzing ? '⏳' : '📸'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => setShowRecommendations(true)}
          >
            <Text style={styles.helpButtonText}>💡 Show Tips</Text>
          </TouchableOpacity>
          
          {capturedImage && (
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => setCapturedImage(null)}
              disabled={isAnalyzing}
            >
              <Text style={styles.retakeButtonText}>🔄 Retake</Text>
            </TouchableOpacity>
          )}
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
  loadingText: {
    fontSize: 14,
    color: '#f59e0b',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  successText: {
    fontSize: 14,
    color: '#059669',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    width: width - 40,
    height: width - 40,
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  cameraPlaceholderText: {
    fontSize: 48,
    marginBottom: 16,
  },
  cameraSubtext: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imagePreview: {
    width: width - 40,
    height: width - 40,
    borderRadius: 20,
    marginBottom: 16,
  },
  imagePreviewText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '600',
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
  disabledButton: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    fontSize: 24,
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 100,
  },
  helpButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  helpButtonText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  },
  retakeButton: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  retakeButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    maxWidth: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  tipsContainer: {
    marginBottom: 24,
  },
  tipItem: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 24,
  },
  dismissButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScanPage;
