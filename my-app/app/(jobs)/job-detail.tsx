import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

export default function JobDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [saved, setSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const job = {
    id: params.id ? parseInt(params.id as string) : 1,
    title: params.title || 'Senior React Developer',
    company: params.company || 'Tech Corp Inc.',
    location: params.location || 'Remote',
    salary: params.salary || '₹6L - ₹9L',
    match: params.match ? parseInt(params.match as string) : 95,
    type: params.type || 'Full-time',
    posted: params.posted || '2 days ago',
    icon: params.icon || 'code',
    description: `We are looking for an experienced React Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using React.js and related technologies.

Key Responsibilities:
• Develop new user-facing features using React.js
• Build reusable components and front-end libraries
• Optimize components for maximum performance
• Collaborate with back-end developers and web designers
• Translate designs and wireframes into high-quality code
• Ensure technical feasibility of UI/UX designs

Requirements:
• 3+ years of experience with React.js
• Strong proficiency in JavaScript, including ES6+
• Experience with Redux or similar state management
• Familiarity with RESTful APIs
• Knowledge of modern authorization mechanisms
• Experience with common front-end development tools`,
    requirements: [
      '3+ years of React.js experience',
      'Strong JavaScript/TypeScript skills',
      'Experience with Redux or Context API',
      'Knowledge of RESTful APIs',
      'Familiarity with Git version control',
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance',
      'Remote work flexibility',
      'Professional development opportunities',
      '401(k) matching',
    ],
  };

  useFocusEffect(
    useCallback(() => {
      if (params.applied === 'true') {
        setIsApplied(true);
        return;
      }
      const checkAppliedStatus = async () => {
        try {
          const appliedJobs = await AsyncStorage.getItem('appliedJobs');
          const appliedJobsList = appliedJobs ? JSON.parse(appliedJobs) : [];
          setIsApplied(appliedJobsList.includes(job.id));
        } catch (error) {
          console.error('Error checking applied status:', error);
        }
      };
      checkAppliedStatus();
    }, [job.id, params.applied])
  );

  useFocusEffect(
    useCallback(() => {
      const checkSavedStatus = async () => {
        try {
          const savedJobs = await AsyncStorage.getItem('savedJobs');
          const savedJobsList = savedJobs ? JSON.parse(savedJobs) : [];
          setSaved(savedJobsList.includes(job.id));
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      };
      checkSavedStatus();
    }, [job.id])
  );

  const handleSave = async () => {
    try {
      const savedJobs = await AsyncStorage.getItem('savedJobs');
      const savedJobsList = savedJobs ? JSON.parse(savedJobs) : [];
      
      if (saved) {
        const updatedList = savedJobsList.filter((id: number) => id !== job.id);
        await AsyncStorage.setItem('savedJobs', JSON.stringify(updatedList));
        setSaved(false);
      } else {
        savedJobsList.push(job.id);
        await AsyncStorage.setItem('savedJobs', JSON.stringify(savedJobsList));
        setSaved(true);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleApply = () => {
    if (isApplied) {
      router.push('/applications');
    } else {
      router.push({
        pathname: '/job-application',
        params: {
          jobId: job.id.toString(),
          jobTitle: job.title,
          company: job.company,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={COLORS.PRIMARY}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.jobHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name={job.icon as any} size={32} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.titleSection}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.companyName}>{job.company}</Text>
            </View>
          </View>

          <View style={styles.badgesContainer}>
            <View style={styles.matchBadge}>
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              <Text style={styles.matchText}>{job.match}% Match</Text>
            </View>
            {isApplied && (
              <View style={styles.appliedBadge}>
                <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                <Text style={styles.appliedText}>Applied</Text>
              </View>
            )}
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color={COLORS.TEXT_SECONDARY} />
              <Text style={styles.infoText}>{job.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="cash-outline" size={20} color={COLORS.TEXT_SECONDARY} />
              <Text style={styles.infoText}>{job.salary}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="briefcase-outline" size={20} color={COLORS.TEXT_SECONDARY} />
              <Text style={styles.infoText}>{job.type}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color={COLORS.TEXT_SECONDARY} />
              <Text style={styles.infoText}>Posted {job.posted}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            <Text style={styles.sectionContent}>{job.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {job.requirements.map((req, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.PRIMARY} />
                <Text style={styles.listText}>{req}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            {job.benefits.map((benefit, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="star-outline" size={18} color={COLORS.PRIMARY} />
                <Text style={styles.listText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.applyButton, isApplied && styles.appliedButton]}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>
            {isApplied ? 'VIEW APPLICATION' : 'APPLY NOW'}
          </Text>
          <Ionicons
            name={isApplied ? 'document-text' : 'arrow-forward'}
            size={20}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingVertical: isSmallScreen ? 12 : 16,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingTop: isSmallScreen ? 24 : 28,
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: isSmallScreen ? 20 : 24,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: isSmallScreen ? 56 : 64,
    height: isSmallScreen ? 56 : 64,
    borderRadius: 16,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isSmallScreen ? 12 : 16,
  },
  titleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  jobTitle: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  companyName: {
    fontSize: isSmallScreen ? 16 : 18,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isSmallScreen ? 10 : 12,
    marginBottom: isSmallScreen ? 20 : 24,
    alignItems: 'center',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SUCCESS + '30',
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 6 : 8,
    borderRadius: 20,
  },
  matchText: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '700',
    color: '#065f46',
    marginLeft: 6,
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.INFO + '30',
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 6 : 8,
    borderRadius: 20,
  },
  appliedText: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '700',
    color: '#1e40af',
    marginLeft: 6,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isSmallScreen ? 14 : 18,
    marginBottom: isSmallScreen ? 28 : 36,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingHorizontal: isSmallScreen ? 14 : 18,
    paddingVertical: isSmallScreen ? 10 : 12,
    borderRadius: 12,
    flex: 1,
    minWidth: '45%',
  },
  infoText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    marginLeft: isSmallScreen ? 10 : 12,
    flex: 1,
  },
  section: {
    marginBottom: isSmallScreen ? 32 : 40,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 20 : 22,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: isSmallScreen ? 12 : 16,
    letterSpacing: -0.3,
  },
  sectionContent: {
    fontSize: isSmallScreen ? 15 : 16,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: isSmallScreen ? 22 : 24,
    fontWeight: '400',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: isSmallScreen ? 12 : 16,
    paddingRight: isSmallScreen ? 4 : 8,
  },
  listText: {
    fontSize: isSmallScreen ? 15 : 16,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 12,
    flex: 1,
    lineHeight: isSmallScreen ? 22 : 24,
  },
  footer: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingVertical: isSmallScreen ? 16 : 20,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  applyButton: {
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
  appliedButton: {
    backgroundColor: COLORS.INFO,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '800',
    marginRight: 8,
    letterSpacing: 0.5,
  },
});
