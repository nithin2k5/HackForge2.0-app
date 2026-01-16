import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

const allJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'Tech Corp Inc.',
    location: 'Remote',
    salary: '$80k - $120k',
    match: 95,
    type: 'Full-time',
    posted: '2 days ago',
    icon: 'code',
  },
  {
    id: 2,
    title: 'Backend Engineer',
    company: 'StartupXYZ',
    location: 'Hybrid',
    salary: '$70k - $100k',
    match: 92,
    type: 'Full-time',
    posted: '5 days ago',
    icon: 'server',
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'Digital Solutions',
    location: 'On-site',
    salary: '$85k - $130k',
    match: 88,
    type: 'Full-time',
    posted: '1 week ago',
    icon: 'layers',
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    company: 'Creative Agency',
    location: 'Remote',
    salary: '$60k - $90k',
    match: 85,
    type: 'Contract',
    posted: '3 days ago',
    icon: 'color-palette',
  },
];

export default function SavedJobsScreen() {
  const router = useRouter();
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadSavedJobs = async () => {
        try {
          const saved = await AsyncStorage.getItem('savedJobs');
          if (saved) {
            setSavedJobIds(JSON.parse(saved));
          }
        } catch (error) {
          console.error('Error loading saved jobs:', error);
        }
      };
      loadSavedJobs();
    }, [])
  );

  const handleUnsave = async (jobId: number) => {
    try {
      const updated = savedJobIds.filter(id => id !== jobId);
      await AsyncStorage.setItem('savedJobs', JSON.stringify(updated));
      setSavedJobIds(updated);
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  };

  const savedJobs = allJobs.filter(job => savedJobIds.includes(job.id));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Jobs</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {savedJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={64} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.emptyTitle}>No Saved Jobs</Text>
            <Text style={styles.emptyText}>Jobs you save will appear here</Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/jobs')}
            >
              <Text style={styles.exploreButtonText}>Explore Jobs</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.resultsText}>{savedJobs.length} saved jobs</Text>
            {savedJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                style={styles.jobCard}
                onPress={() => {
                  router.push({
                    pathname: '/(jobs)/job-detail' as any,
                    params: {
                      id: job.id.toString(),
                      title: job.title,
                      company: job.company,
                      location: job.location,
                      salary: job.salary,
                      match: job.match.toString(),
                    },
                  });
                }}
              >
                <View style={styles.jobHeader}>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobCompany}>{job.company} • {job.location}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.unsaveButton}
                    onPress={() => handleUnsave(job.id)}
                  >
                    <Ionicons name="bookmark" size={24} color={COLORS.PRIMARY} />
                  </TouchableOpacity>
                </View>
                <View style={styles.jobDetails}>
                  <Text style={styles.jobSalary}>{job.salary}</Text>
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{job.match}% Match</Text>
                  </View>
                </View>
                <Text style={styles.savedDate}>Saved {job.posted}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
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
  },
  headerTitle: {
    flex: 1,
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 24,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
    marginTop: 16,
  },
  jobCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  unsaveButton: {
    padding: 4,
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobSalary: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  matchBadge: {
    backgroundColor: COLORS.PRIMARY + '30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  savedDate: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
});
