import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

const jobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'Tech Corp Inc.',
    location: 'Remote',
    salary: '₹6L - ₹9L',
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
    salary: '₹5L - ₹7L',
    match: 92,
    type: 'Full-time',
    posted: '5 days ago',
    icon: 'server',
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Creative Agency',
    location: 'On-site',
    salary: '₹4.5L - ₹7L',
    match: 88,
    type: 'Full-time',
    posted: '1 week ago',
    icon: 'brush',
  },
];

export default function JobsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'remote') return matchesSearch && job.location.toLowerCase().includes('remote');
    if (filter === 'hybrid') return matchesSearch && job.location.toLowerCase().includes('hybrid');
    if (filter === 'onsite') return matchesSearch && !job.location.toLowerCase().includes('remote') && !job.location.toLowerCase().includes('hybrid');
    
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jobs</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.TEXT_SECONDARY} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.filterContainer}>
          {['all', 'remote', 'hybrid', 'onsite'].map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[styles.filterChip, filter === filterOption && styles.filterChipActive]}
              onPress={() => setFilter(filterOption)}
            >
              <Text style={[styles.filterChipText, filter === filterOption && styles.filterChipTextActive]}>
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsText}>{filteredJobs.length} jobs found</Text>
        {filteredJobs.map((job) => (
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
            <View style={styles.matchBadgeContainer}>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{job.match}% Match</Text>
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
        ))}
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
  searchContainer: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
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
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.SECONDARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  filterChipActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  filterChipTextActive: {
    color: COLORS.TEXT_PRIMARY,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingBottom: 24,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
    marginTop: 8,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  bookmarkButton: {
    padding: 4,
    marginLeft: 8,
  },
  matchBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
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
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
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
