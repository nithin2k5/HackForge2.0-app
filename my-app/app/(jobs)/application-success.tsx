import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { COLORS } from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

export default function ApplicationSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const jobTitle = params.jobTitle || 'Job Position';
  const company = params.company || 'Company Name';
  const jobId = params.jobId;

  useEffect(() => {
    const saveAppliedJob = async () => {
      if (jobId) {
        try {
          const appliedJobs = await AsyncStorage.getItem('appliedJobs');
          const appliedJobsList = appliedJobs ? JSON.parse(appliedJobs) : [];
          const jobIdNum = parseInt(jobId as string);
          if (!appliedJobsList.includes(jobIdNum)) {
            appliedJobsList.push(jobIdNum);
            await AsyncStorage.setItem('appliedJobs', JSON.stringify(appliedJobsList));
          }
        } catch (error) {
          console.error('Error saving applied job:', error);
        }
      }
    };
    saveAppliedJob();
  }, [jobId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.checkmarkCircle}>
            <Ionicons name="checkmark" size={isSmallScreen ? 48 : 56} color="#ffffff" />
          </View>
        </View>

        <Text style={styles.title}>Application Submitted!</Text>
        <Text style={styles.subtitle}>
          Your application for {jobTitle} at {company} has been successfully submitted.
        </Text>

        <View style={styles.infoCard}>
          <View style={[styles.infoRow, styles.infoRowFirst]}>
            <Ionicons name="time-outline" size={20} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.infoText}>
              We'll review your application and get back to you within 3-5 business days.
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.infoText}>
              You'll receive email notifications about your application status.
            </Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Ionicons name="document-text-outline" size={20} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.infoText}>
              Track your application progress in the Applications section.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/applications')}
          >
            <Ionicons name="list-outline" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>View Applications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace('/dashboard')}
          >
            <Text style={styles.secondaryButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  content: {
    flex: 1,
    paddingHorizontal: isSmallScreen ? 24 : 32,
    paddingTop: isSmallScreen ? 40 : 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: isSmallScreen ? 32 : 40,
  },
  checkmarkCircle: {
    width: isSmallScreen ? 120 : 140,
    height: isSmallScreen ? 120 : 140,
    borderRadius: isSmallScreen ? 60 : 70,
    backgroundColor: COLORS.SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: isSmallScreen ? 28 : 32,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: isSmallScreen ? 12 : 16,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: isSmallScreen ? 16 : 18,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: isSmallScreen ? 24 : 26,
    marginBottom: isSmallScreen ? 32 : 40,
    paddingHorizontal: isSmallScreen ? 8 : 0,
  },
  infoCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: isSmallScreen ? 20 : 24,
    width: '100%',
    marginBottom: isSmallScreen ? 32 : 40,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: isSmallScreen ? 18 : 22,
  },
  infoRowFirst: {
    marginTop: 0,
  },
  infoRowLast: {
    marginBottom: 0,
  },
  infoText: {
    fontSize: isSmallScreen ? 14 : 15,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: isSmallScreen ? 14 : 16,
    flex: 1,
    lineHeight: isSmallScreen ? 22 : 24,
  },
  buttonContainer: {
    width: '100%',
    gap: isSmallScreen ? 12 : 16,
  },
  primaryButton: {
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
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '800',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingVertical: isSmallScreen ? 16 : 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.PRIMARY,
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
