import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, Layout, FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { jobsApi, savedJobsApi } from '@/services/api';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

interface SuggestedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  salary?: string;
  match?: number;
  type?: string;
  posted?: string;
  icon?: string;
  reason?: string;
  skills?: string[];
}

export default function SuggestionsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedJobs, setSuggestedJobs] = useState<SuggestedJob[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSuggestions();
    loadSavedJobs();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadSuggestions();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: any = { suggested: true };
      if (searchQuery) filters.search = searchQuery;

      const response = await jobsApi.getAll(filters);
      const jobs = Array.isArray(response) ? response : (response.data || response.suggestions || []);
      setSuggestedJobs(jobs);
    } catch (err: any) {
      setError(err.message || 'Failed to load suggestions');
      setSuggestedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const response = await savedJobsApi.getAll();
      const savedJobIds = Array.isArray(response)
        ? response.map((item: any) => item.job_id || item.id)
        : (response.data || []).map((item: any) => item.job_id || item.id);
      setSavedJobs(savedJobIds);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const handleSaveJob = async (jobId: number) => {
    try {
      const isSaved = savedJobs.includes(jobId);
      if (isSaved) {
        await savedJobsApi.delete(jobId);
        setSavedJobs(savedJobs.filter(id => id !== jobId));
      } else {
        await savedJobsApi.save(jobId);
        setSavedJobs([...savedJobs, jobId]);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const getJobIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('react') || lowerTitle.includes('frontend')) return 'code';
    if (lowerTitle.includes('backend') || lowerTitle.includes('server')) return 'server';
    if (lowerTitle.includes('design') || lowerTitle.includes('ui/ux')) return 'color-palette';
    if (lowerTitle.includes('full stack')) return 'layers';
    if (lowerTitle.includes('mobile')) return 'phone-portrait';
    return 'briefcase';
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.backgroundContainer}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrapper}>
            <Text style={styles.headerTitle}>AI Recommendations</Text>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={10} color={COLORS.WHITE} />
              <Text style={styles.aiBadgeText}>SMART</Text>
            </View>
          </View>
          <View style={{ width: 44 }} />
        </Animated.View>

        <View style={styles.searchSection}>
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={20} color={COLORS.PRIMARY} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Filter by skill or company..."
              placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            </View>
          ) : suggestedJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="sparkles-outline" size={60} color={COLORS.PRIMARY + '30'} />
              </View>
              <Text style={styles.emptyTitle}>No personalized jobs yet</Text>
              <Text style={styles.emptyText}>Upload your resume and complete your profile to get AI-powered recommendations.</Text>
            </Animated.View>
          ) : (
            <View>
              <Text style={styles.resultsLabel}>{suggestedJobs.length} matches found for you</Text>
              {suggestedJobs.map((job, index) => (
                <Animated.View
                  key={job.id}
                  entering={FadeInDown.delay(index * 100).duration(600)}
                  layout={Layout.springify()}
                >
                  <TouchableOpacity
                    style={styles.jobCard}
                    onPress={() => {
                      router.push({
                        pathname: '/(jobs)/job-detail' as any,
                        params: {
                          id: job.id.toString(),
                          match: job.match?.toString() || '0',
                        },
                      });
                    }}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.iconBox}>
                        <Ionicons name={getJobIcon(job.title) as any} size={24} color={COLORS.PRIMARY} />
                      </View>
                      <View style={styles.titleInfo}>
                        <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                        <Text style={styles.companyName}>{job.company} • {job.location}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleSaveJob(job.id);
                        }}
                      >
                        <Ionicons
                          name={savedJobs.includes(job.id) ? "bookmark" : "bookmark-outline"}
                          size={22}
                          color={COLORS.PRIMARY}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.matchBarContainer}>
                      <View style={styles.matchBarHeader}>
                        <Text style={styles.matchPercent}>{job.match}% Match Score</Text>
                        <Text style={styles.matchSource}>AI Analysis</Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${job.match}%` }]} />
                      </View>
                    </View>

                    <View style={styles.tagWrapper}>
                      {job.skills?.slice(0, 3).map((skill, i) => (
                        <View key={i} style={styles.skillTag}>
                          <Text style={styles.skillTagText}>{skill}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.cardFooter}>
                      <View style={styles.footerItem}>
                        <Ionicons name="cash-outline" size={14} color={COLORS.TEXT_SECONDARY} />
                        <Text style={styles.footerText}>{job.salary || 'Competitive'}</Text>
                      </View>
                      <View style={styles.footerItem}>
                        <Ionicons name="time-outline" size={14} color={COLORS.TEXT_SECONDARY} />
                        <Text style={styles.footerText}>{job.type || 'Full-time'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <TouchableOpacity
        style={styles.chatbotBtn}
        onPress={() => router.push('/chatbot')}
      >
        <Ionicons name="chatbubbles" size={26} color={COLORS.WHITE} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: -1,
  },
  bgCircle1: {
    position: 'absolute',
    width: screenWidth * 1.5,
    height: screenWidth * 1.5,
    borderRadius: screenWidth * 0.75,
    backgroundColor: COLORS.PRIMARY + '05',
    top: -screenWidth * 0.4,
    right: -screenWidth * 0.2,
  },
  bgCircle2: {
    position: 'absolute',
    width: screenWidth,
    height: screenWidth,
    borderRadius: screenWidth * 0.5,
    backgroundColor: COLORS.SECONDARY + '10',
    bottom: -screenWidth * 0.2,
    left: -screenWidth * 0.4,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerTitleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
  },
  aiBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  aiBadgeText: {
    color: COLORS.WHITE,
    fontSize: 9,
    fontWeight: '900',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    height: 56,
    paddingHorizontal: 16,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  resultsLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
    letterSpacing: 1,
    marginLeft: 4,
  },
  jobCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  companyName: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  saveBtn: {
    padding: 8,
  },
  matchBarContainer: {
    marginBottom: 16,
  },
  matchBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  matchPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.PRIMARY,
  },
  matchSource: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 3,
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skillTag: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
  skillTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.CARD_BORDER,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '700',
  },
  loadingContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  chatbotBtn: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
});
