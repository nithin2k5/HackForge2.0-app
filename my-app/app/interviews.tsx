import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Modal,
  TextInput,
  Pressable,
  Alert,
  Clipboard,
  Linking,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, Layout, FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { interviewsApi } from '@/services/api';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

interface Interview {
  id: number;
  job_title?: string;
  jobTitle?: string;
  company?: string;
  date?: string;
  time?: string;
  type?: string;
  interviewer?: string;
  location?: string;
  status?: string;
  match?: number;
  meeting_link?: string;
  meetingLink?: string;
  meeting_id?: string;
  meetingId?: string;
  password?: string;
}

export default function InterviewsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await interviewsApi.getAll();
      const interviewsList = Array.isArray(response) ? response : (response.data || []);
      setInterviews(interviewsList);
    } catch (err: any) {
      setError(err.message || 'Failed to load interviews');
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const filteredInterviews = interviews.filter(interview => {
    if (activeFilter === 'all') return true;
    return interview.status === activeFilter;
  });

  const upcomingCount = interviews.filter(i => i.status === 'scheduled').length;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { label: 'Scheduled', color: COLORS.INFO, icon: 'time-outline' };
      case 'completed':
        return { label: 'Completed', color: COLORS.SUCCESS, icon: 'checkmark-circle' };
      case 'cancelled':
        return { label: 'Cancelled', color: COLORS.ERROR, icon: 'close-circle' };
      default:
        return { label: status, color: COLORS.TEXT_SECONDARY, icon: 'help-circle' };
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'Video Call' ? 'videocam-outline' : 'location-outline';
  };

  const handleJoinInterview = (interview: any) => {
    setSelectedInterview(interview);
    setShowJoinModal(true);
  };

  const handleCopy = (text: string) => {
    if (Clipboard && Clipboard.setString) {
      Clipboard.setString(text);
      Alert.alert('Copied', 'Copied to clipboard');
    }
  };

  const handleOpenMeeting = async () => {
    const meetingLink = selectedInterview?.meeting_link || selectedInterview?.meetingLink;
    if (meetingLink) {
      try {
        await Linking.openURL(meetingLink);
      } catch (error) {
        Alert.alert('Error', 'Could not open meeting link');
      }
    }
    setShowJoinModal(false);
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
          <Text style={styles.headerTitle}>Interviews</Text>
          <View style={{ width: 44 }} />
        </Animated.View>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200)} style={styles.statsCard}>
            <View style={styles.statsInfo}>
              <Text style={styles.statsLabel}>UPCOMING</Text>
              <Text style={styles.statsValue}>{upcomingCount}</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsInfo}>
              <Text style={styles.statsLabel}>TOTAL</Text>
              <Text style={styles.statsValue}>{interviews.length}</Text>
            </View>
          </Animated.View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterTab, activeFilter === filter.id && styles.filterTabActive]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Text style={[styles.filterText, activeFilter === filter.id && styles.filterTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
              </View>
            ) : filteredInterviews.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={64} color={COLORS.PRIMARY + '30'} />
                <Text style={styles.emptyTitle}>No Interviews</Text>
                <Text style={styles.emptyText}>You don't have any interviews scheduled for this category.</Text>
              </View>
            ) : (
              filteredInterviews.map((interview, index) => {
                const statusInfo = getStatusInfo(interview.status || '');
                const jobTitle = interview.job_title || interview.jobTitle || 'Job Title';
                const company = interview.company || 'Company';
                return (
                  <Animated.View
                    key={interview.id}
                    entering={FadeInDown.delay(index * 100).duration(600)}
                    layout={Layout.springify()}
                  >
                    <TouchableOpacity style={styles.interviewCard} activeOpacity={0.9}>
                      <View style={styles.cardHeader}>
                        <View style={styles.iconBox}>
                          <Ionicons name="business" size={24} color={COLORS.PRIMARY} />
                        </View>
                        <View style={styles.titleContent}>
                          <Text style={styles.jobTitleText} numberOfLines={1}>{jobTitle}</Text>
                          <Text style={styles.companyText}>{company}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '15' }]}>
                          <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                        </View>
                      </View>

                      <View style={styles.cardDetails}>
                        <View style={styles.detailRow}>
                          <Ionicons name="calendar-outline" size={16} color={COLORS.TEXT_SECONDARY} />
                          <Text style={styles.detailText}>{interview.date || 'TBD'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Ionicons name="time-outline" size={16} color={COLORS.TEXT_SECONDARY} />
                          <Text style={styles.detailText}>{interview.time || 'TBD'}</Text>
                        </View>
                      </View>

                      {interview.status === 'scheduled' && (
                        <TouchableOpacity
                          style={styles.joinBtn}
                          onPress={() => handleJoinInterview(interview)}
                        >
                          <Ionicons name="videocam" size={18} color={COLORS.WHITE} />
                          <Text style={styles.joinBtnText}>Join Interview</Text>
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })
            )}
          </ScrollView>
        </View>
      </SafeAreaView>

      <Modal
        visible={showJoinModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowJoinModal(false)}>
          <Animated.View entering={FadeInUp} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join Interview</Text>
            {selectedInterview && (
              <View style={styles.modalInner}>
                <Text style={styles.modalJob}>{selectedInterview.job_title || selectedInterview.jobTitle}</Text>
                <Text style={styles.modalComp}>{selectedInterview.company}</Text>

                <TouchableOpacity style={styles.modalPrimaryBtn} onPress={handleOpenMeeting}>
                  <Ionicons name="open-outline" size={20} color={COLORS.WHITE} />
                  <Text style={styles.modalPrimaryBtnText}>Open Meeting Link</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalSecondaryBtn} onPress={() => handleCopy(selectedInterview.meeting_link || selectedInterview.meetingLink || '')}>
                  <Ionicons name="copy-outline" size={20} color={COLORS.PRIMARY} />
                  <Text style={styles.modalSecondaryBtnText}>Copy Link</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </Pressable>
      </Modal>
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
    right: -screenWidth * 0.3,
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  statsInfo: {
    flex: 1,
    alignItems: 'center',
  },
  statsDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  statsLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statsValue: {
    color: COLORS.WHITE,
    fontSize: 24,
    fontWeight: '900',
  },
  filterScroll: {
    marginBottom: 20,
    paddingBottom: 4,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: COLORS.WHITE,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  filterTabActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
  },
  filterTextActive: {
    color: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  interviewCard: {
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
  titleContent: {
    flex: 1,
  },
  jobTitleText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  companyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
    paddingLeft: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  joinBtn: {
    backgroundColor: COLORS.PRIMARY,
    height: 52,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  joinBtnText: {
    color: COLORS.WHITE,
    fontSize: 15,
    fontWeight: '800',
  },
  centerContainer: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 15,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 32,
    padding: 24,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInner: {
    alignItems: 'center',
  },
  modalJob: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    textAlign: 'center',
  },
  modalComp: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    marginBottom: 30,
  },
  modalPrimaryBtn: {
    width: '100%',
    height: 60,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  modalPrimaryBtnText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '800',
  },
  modalSecondaryBtn: {
    width: '100%',
    height: 60,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: COLORS.CARD_BORDER,
  },
  modalSecondaryBtnText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '800',
  },
});
