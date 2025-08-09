import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Feature } from '../types/Feature';
import { apiService } from '../services/api';

interface AddFeatureModalProps {
  visible: boolean;
  onClose: () => void;
  onFeatureAdded: (feature: Feature) => void;
}

export const AddFeatureModal: React.FC<AddFeatureModalProps> = ({
  visible,
  onClose,
  onFeatureAdded,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    authorName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.authorName.trim()) {
      Alert.alert('Error', 'Title and author name are required');
      return;
    }

    if (formData.title.length > 255) {
      Alert.alert('Error', 'Title must be less than 255 characters');
      return;
    }

    if (formData.authorName.length > 100) {
      Alert.alert('Error', 'Author name must be less than 100 characters');
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiService.createFeature({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        authorName: formData.authorName.trim(),
      });

      onFeatureAdded(response.data);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        authorName: '',
      });
      
    } catch (error: any) {
      console.error('Error creating feature:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create feature';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      authorName: '',
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Suggest Feature</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              (!formData.title.trim() || !formData.authorName.trim() || loading) &&
                styles.submitButtonDisabled,
            ]}
            disabled={!formData.title.trim() || !formData.authorName.trim() || loading}
          >
            <Text style={[
              styles.submitButtonText,
              (!formData.title.trim() || !formData.authorName.trim() || loading) &&
                styles.submitButtonTextDisabled,
            ]}>
              {loading ? 'Creating...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Feature Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="What feature would you like to see?"
              maxLength={255}
              multiline={false}
              returnKeyType="next"
            />
            <Text style={styles.charCount}>{formData.title.length}/255</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Provide more details about this feature..."
              maxLength={1000}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{formData.description.length}/1000</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.authorName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, authorName: text }))}
              placeholder="Who's suggesting this feature?"
              maxLength={100}
              multiline={false}
              returnKeyType="done"
            />
            <Text style={styles.charCount}>{formData.authorName.length}/100</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  submitButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    maxHeight: 150,
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
});