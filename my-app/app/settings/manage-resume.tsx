import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { COLORS } from '@/constants/colors';
import { resumesApi } from '@/services/api';
import * as DocumentPicker from 'expo-document-picker';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

export default function ManageResumeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [resume, setResume] = useState<{ id: number; name: string; size: string; uri: string } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setFetching(true);
      const resumes = await resumesApi.getAll();
      const activeResume = Array.isArray(resumes)
        ? resumes.find((r: any) => r.is_active)
        : null;

      if (activeResume) {
        const sizeInMB = activeResume.file_size
          ? (activeResume.file_size / (1024 * 1024)).toFixed(1) + ' MB'
          : '0 MB';
        setResume({
          id: activeResume.id,
          name: activeResume.file_name,
          size: sizeInMB,
          uri: activeResume.file_url,
        });
      }
    } catch (error: any) {
      console.error('Error loading resumes:', error);
    } finally {
      setFetching(false);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setLoading(true);

      await resumesApi.upload(file.uri, file.name, file.mimeType || 'application/pdf');
      await loadResumes();
      Alert.alert('Success', 'Resume uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      Alert.alert('Error', error.message || 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveResume = async () => {
    if (!resume) return;

    Alert.alert(
      'Delete Resume',
      'Are you sure you want to delete this resume?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await resumesApi.delete(resume.id);
              setResume(null);
              Alert.alert('Success', 'Resume deleted successfully');
            } catch (error: any) {
              console.error('Error deleting resume:', error);
              Alert.alert('Error', 'Failed to delete resume');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSave = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={loading ? '#cbd5e0' : COLORS.PRIMARY}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Resume</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.PRIMARY} />
          <Text style={styles.infoText}>
            Upload your resume in PDF format. Make sure it's up to date and highlights your skills and experience.
          </Text>
        </View>

        {resume ? (
          <View style={styles.resumeCard}>
            <View style={styles.resumeIconContainer}>
              <Ionicons name="document-text" size={40} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.resumeInfo}>
              <Text style={styles.resumeName}>{resume.name}</Text>
              <Text style={styles.resumeSize}>{resume.size}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemoveResume}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyResumeCard}>
            <Ionicons name="document-outline" size={64} color="#cbd5e0" />
            <Text style={styles.emptyResumeText}>No Resume Uploaded</Text>
            <Text style={styles.emptyResumeSubtext}>
              Upload your resume to get started
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handlePickDocument}
          disabled={loading}
        >
          <Ionicons
            name={resume ? 'refresh-outline' : 'cloud-upload-outline'}
            size={24}
            color={COLORS.PRIMARY}
          />
          <Text style={styles.uploadButtonText}>
            {resume ? 'Replace Resume' : 'Upload Resume'}
          </Text>
        </TouchableOpacity>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Tips for a Great Resume</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10b981" />
            <Text style={styles.tipText}>Keep it concise - 1-2 pages maximum</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10b981" />
            <Text style={styles.tipText}>Highlight relevant skills and experience</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10b981" />
            <Text style={styles.tipText}>Use clear, professional formatting</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10b981" />
            <Text style={styles.tipText}>Update it regularly with new achievements</Text>
          </View>
        </View>
      </ScrollView>

      {resume && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingVertical: isSmallScreen ? 12 : 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    padding: 8,
    marginRight: isSmallScreen ? 12 : 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: isSmallScreen ? 16 : 24,
    paddingBottom: 100,
  },
  infoCard: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    padding: isSmallScreen ? 16 : 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: isSmallScreen ? 24 : 28,
    gap: isSmallScreen ? 12 : 16,
  },
  infoText: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: isSmallScreen ? 20 : 22,
  },
  resumeCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: isSmallScreen ? 20 : 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 20 : 24,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  resumeIconContainer: {
    width: isSmallScreen ? 64 : 72,
    height: isSmallScreen ? 64 : 72,
    borderRadius: 16,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isSmallScreen ? 16 : 20,
  },
  resumeInfo: {
    flex: 1,
  },
  resumeName: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  resumeSize: {
    fontSize: isSmallScreen ? 13 : 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  removeButton: {
    padding: 8,
  },
  emptyResumeCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: isSmallScreen ? 40 : 48,
    alignItems: 'center',
    marginBottom: isSmallScreen ? 20 : 24,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    borderStyle: 'dashed',
  },
  emptyResumeText: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyResumeSubtext: {
    fontSize: isSmallScreen ? 14 : 15,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 12,
    paddingVertical: isSmallScreen ? 16 : 18,
    paddingHorizontal: isSmallScreen ? 20 : 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    marginBottom: isSmallScreen ? 28 : 32,
    gap: 10,
  },
  uploadButtonText: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    letterSpacing: 0.3,
  },
  tipsSection: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: isSmallScreen ? 20 : 24,
  },
  tipsTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: isSmallScreen ? 16 : 20,
    letterSpacing: -0.3,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: isSmallScreen ? 12 : 16,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: isSmallScreen ? 20 : 22,
  },
  footer: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingTop: isSmallScreen ? 16 : 20,
    paddingBottom: isSmallScreen ? 20 : 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: isSmallScreen ? 16 : 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
