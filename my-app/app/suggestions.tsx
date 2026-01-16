import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

const suggestedJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp',
    location: 'Remote',
    salary: '₹6L - ₹9L',
    match: 98,
    type: 'Full-time',
    posted: '2 days ago',
    icon: 'code',
    reason: 'Strong match with your React and TypeScript skills',
    skills: ['React', 'TypeScript', 'Node.js'],
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'Digital Solutions',
    location: 'Hybrid',
    salary: '₹7L - ₹10L',
    match: 95,
    type: 'Full-time',
    posted: '1 day ago',
    icon: 'layers',
    reason: 'Matches your full-stack experience and MongoDB expertise',
    skills: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: 3,
    title: 'Frontend Developer',
    company: 'Creative Agency',
    location: 'Remote',
    salary: '₹5.5L - ₹8L',
    match: 92,
    type: 'Full-time',
    posted: '3 days ago',
    icon: 'color-palette',
    reason: 'Perfect fit for your UI/UX and React skills',
    skills: ['React', 'CSS', 'UI/UX'],
  },
  {
    id: 4,
    title: 'React Native Developer',
    company: 'MobileFirst',
    location: 'Remote',
    salary: '₹6.5L - ₹9.5L',
    match: 90,
    type: 'Full-time',
    posted: '5 days ago',
    icon: 'phone-portrait',
    reason: 'Your React experience translates well to mobile development',
    skills: ['React Native', 'JavaScript', 'Mobile'],
  },
  {
    id: 5,
    title: 'JavaScript Developer',
    company: 'StartupXYZ',
    location: 'Hybrid',
    salary: '₹5L - ₹7.5L',
    match: 88,
    type: 'Full-time',
    posted: '1 week ago',
    icon: 'logo-javascript',
    reason: 'Strong alignment with your JavaScript and ES6+ skills',
    skills: ['JavaScript', 'ES6+', 'Web Development'],
  },
];

export default function SuggestionsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const saved = await AsyncStorage.getItem('savedJobs');
        if (saved) {
          setSavedJobs(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      }
    };
    loadSavedJobs();
  }, []);

  const handleSaveJob = async (jobId: number) => {
    try {
      const isSaved = savedJobs.includes(jobId);
      let updatedSavedJobs;
      
      if (isSaved) {
        updatedSavedJobs = savedJobs.filter(id => id !== jobId);
      } else {
        updatedSavedJobs = [...savedJobs, jobId];
      }
      
      await AsyncStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      setSavedJobs(updatedSavedJobs);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const filteredJobs = suggestedJobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="sparkles" size={24} color={COLORS.PRIMARY} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>AI Suggestions</Text>
            <Text style={styles.headerSubtitle}>Based on your resume</Text>
          </View>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.TEXT_SECONDARY} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search suggestions..."
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="bulb" size={24} color={COLORS.PRIMARY} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Personalized Job Recommendations</Text>
            <Text style={styles.infoText}>
              These jobs are matched to your resume using AI. The higher the match percentage, the better the fit for your skills and experience.
            </Text>
          </View>
        </View>

        <Text style={styles.resultsText}>{filteredJobs.length} job suggestions</Text>

        {filteredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.emptyTitle}>No Suggestions Found</Text>
            <Text style={styles.emptyText}>Try adjusting your search</Text>
          </View>
        ) : (
          filteredJobs.map((job) => (
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
                    type: job.type,
                    posted: job.posted,
                    icon: job.icon,
                  },
                });
              }}
            >
              <View style={styles.cardTop}>
                <View style={styles.jobHeader}>
                  <View style={styles.jobIconContainer}>
                    <Ionicons name={job.icon as any} size={24} color={COLORS.PRIMARY} />
                  </View>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobCompany}>{job.company} • {job.location}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleSaveJob(job.id);
                    }}
                    style={styles.bookmarkButton}
                  >
                    <Ionicons
                      name={savedJobs.includes(job.id) ? 'bookmark' : 'bookmark-outline'}
                      size={24}
                      color={savedJobs.includes(job.id) ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.matchContainer}>
                  <View style={styles.matchBadge}>
                    <Ionicons name="sparkles" size={16} color={COLORS.PRIMARY} />
                    <Text style={styles.matchText}>{job.match}% Match</Text>
                  </View>
                </View>
              </View>

              <View style={styles.reasonBox}>
                <View style={styles.reasonHeader}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.SUCCESS} />
                  <Text style={styles.reasonText}>{job.reason}</Text>
                </View>
                <View style={styles.skillsContainer}>
                  {job.skills.map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.jobDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="cash-outline" size={14} color={COLORS.TEXT_SECONDARY} />
                  <Text style={styles.detailText}>{job.salary}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={14} color={COLORS.TEXT_SECONDARY} />
                  <Text style={styles.detailText}>{job.type}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={14} color={COLORS.TEXT_SECONDARY} />
                  <Text style={styles.detailText}>{job.posted}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={() => router.push('/chatbot' as any)}
      >
        <Ionicons name="chatbubbles" size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
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
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    gap: 12,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
    fontWeight: '600',
  },
  jobCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  cardTop: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  jobIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  jobInfo: {
    flex: 1,
    minWidth: 0,
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
  bookmarkButton: {
    padding: 4,
    flexShrink: 0,
  },
  matchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY + '30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  matchText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  reasonBox: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  reasonText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 18,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  skillTag: {
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    textAlign: 'center',
  },
  chatbotButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
});
