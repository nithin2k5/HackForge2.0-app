import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

const applicationStages = [
  {
    id: 1,
    stage: 'Application Submitted',
    status: 'completed',
    date: '2024-01-15',
    description: 'Your application has been received and is being reviewed.',
  },
  {
    id: 2,
    stage: 'Under Review',
    status: 'completed',
    date: '2024-01-16',
    description: 'HR team is reviewing your application and qualifications.',
  },
  {
    id: 3,
    stage: 'Shortlisted',
    status: 'current',
    date: '2024-01-18',
    description: 'Your application has been shortlisted for further consideration.',
  },
  {
    id: 4,
    stage: 'Interview',
    status: 'pending',
    date: null,
    description: 'Interview will be scheduled if you pass the shortlisting stage.',
  },
  {
    id: 5,
    stage: 'Decision',
    status: 'pending',
    date: null,
    description: 'Final decision will be communicated after the interview process.',
  },
];

export default function ApplicationStatusScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const jobTitle = Array.isArray(params.jobTitle) ? params.jobTitle[0] : (params.jobTitle || 'Job Position');
  const company = Array.isArray(params.company) ? params.company[0] : (params.company || 'Company Name');
  const status = Array.isArray(params.status) ? params.status[0] : (params.status || 'under_review');

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'under_review':
        return {
          label: 'Under Review',
          color: '#3b82f6',
          icon: 'time-outline',
        };
      case 'shortlisted':
        return {
          label: 'Shortlisted',
          color: '#10b981',
          icon: 'checkmark-circle-outline',
        };
      case 'interview':
        return {
          label: 'Interview Scheduled',
          color: '#f59e0b',
          icon: 'calendar-outline',
        };
      case 'rejected':
        return {
          label: 'Not Selected',
          color: '#ef4444',
          icon: 'close-circle-outline',
        };
      case 'accepted':
        return {
          label: 'Accepted',
          color: '#10b981',
          icon: 'checkmark-circle',
        };
      default:
        return {
          label: 'Under Review',
          color: COLORS.TEXT_SECONDARY,
          icon: 'help-circle-outline',
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
        <Text style={styles.headerTitle}>Application Status</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.jobCard}>
          <View style={styles.jobHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="briefcase" size={28} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>{jobTitle}</Text>
              <Text style={styles.companyName}>{company}</Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusInfo.color}15` },
            ]}
          >
            <Ionicons
              name={statusInfo.icon as any}
              size={18}
              color={statusInfo.color}
            />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Application Timeline</Text>

          {applicationStages.map((stage, index) => {
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';
            const isPending = stage.status === 'pending';

            return (
              <View key={stage.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      isCompleted && styles.timelineDotCompleted,
                      isCurrent && styles.timelineDotCurrent,
                      isPending && styles.timelineDotPending,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={16} color={COLORS.TEXT_PRIMARY} />
                    ) : isCurrent ? (
                      <View style={styles.currentDotInner} />
                    ) : null}
                  </View>
                  {index < applicationStages.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        isCompleted && styles.timelineLineCompleted,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text
                      style={[
                        styles.timelineTitle,
                        isPending && styles.timelineTitlePending,
                      ]}
                    >
                      {stage.stage}
                    </Text>
                    <Text style={styles.timelineDate}>
                      {formatDate(stage.date)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.timelineDescription,
                      isPending && styles.timelineDescriptionPending,
                    ]}
                  >
                    {stage.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.PRIMARY} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>What's Next?</Text>
              <Text style={styles.infoText}>
                {status === 'under_review' &&
                  'The hiring team is reviewing your application. You should hear back within 3-5 business days.'}
                {status === 'shortlisted' &&
                  'Congratulations! You\'ve been shortlisted. The next step is an interview, which will be scheduled soon.'}
                {status === 'interview' &&
                  'Your interview has been scheduled. Please check your email for details and prepare accordingly.'}
                {status === 'rejected' &&
                  'Thank you for your interest. While you weren\'t selected for this position, we encourage you to apply for other opportunities.'}
                {status === 'accepted' &&
                  'Congratulations! You\'ve been selected. You will receive further instructions via email.'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/dashboard')}
          >
            <Ionicons name="briefcase-outline" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.actionButtonText}>Browse More Jobs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: COLORS.BACKGROUND,
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
    paddingBottom: 40,
  },
  jobCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 16,
    padding: isSmallScreen ? 20 : 24,
    marginBottom: isSmallScreen ? 20 : 24,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 16 : 20,
  },
  iconContainer: {
    width: isSmallScreen ? 56 : 64,
    height: isSmallScreen ? 56 : 64,
    borderRadius: 16,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isSmallScreen ? 16 : 20,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  companyName: {
    fontSize: isSmallScreen ? 16 : 18,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: isSmallScreen ? 14 : 16,
    paddingVertical: isSmallScreen ? 8 : 10,
    borderRadius: 20,
    gap: 8,
  },
  statusText: {
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '700',
  },
  timelineSection: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 16,
    padding: isSmallScreen ? 20 : 24,
    marginBottom: isSmallScreen ? 20 : 24,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 20 : 22,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: isSmallScreen ? 20 : 24,
    letterSpacing: -0.3,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: isSmallScreen ? 24 : 28,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: isSmallScreen ? 16 : 20,
  },
  timelineDot: {
    width: isSmallScreen ? 32 : 36,
    height: isSmallScreen ? 32 : 36,
    borderRadius: isSmallScreen ? 16 : 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  timelineDotCompleted: {
    backgroundColor: COLORS.SUCCESS,
    borderColor: COLORS.SUCCESS,
  },
  timelineDotCurrent: {
    backgroundColor: COLORS.BACKGROUND,
    borderColor: COLORS.INFO,
    borderWidth: 3,
  },
  timelineDotPending: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderColor: COLORS.BORDER,
  },
  currentDotInner: {
    width: isSmallScreen ? 16 : 18,
    height: isSmallScreen ? 16 : 18,
    borderRadius: isSmallScreen ? 8 : 9,
    backgroundColor: COLORS.INFO,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    borderColor: COLORS.BORDER,
    marginTop: 4,
    minHeight: isSmallScreen ? 40 : 50,
  },
  timelineLineCompleted: {
    backgroundColor: COLORS.SUCCESS,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  timelineTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    flex: 1,
  },
  timelineTitlePending: {
    color: COLORS.TEXT_SECONDARY,
  },
  timelineDate: {
    fontSize: isSmallScreen ? 13 : 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  timelineDescription: {
    fontSize: isSmallScreen ? 14 : 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: isSmallScreen ? 20 : 22,
  },
  timelineDescriptionPending: {
    color: COLORS.TEXT_SECONDARY,
  },
  infoSection: {
    marginBottom: isSmallScreen ? 20 : 24,
  },
  infoCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 16,
    padding: isSmallScreen ? 20 : 24,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: isSmallScreen ? 12 : 16,
  },
  infoTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  infoText: {
    fontSize: isSmallScreen ? 15 : 16,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: isSmallScreen ? 22 : 24,
  },
  actionSection: {
    marginTop: isSmallScreen ? 8 : 12,
  },
  actionButton: {
    backgroundColor: COLORS.BACKGROUND,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallScreen ? 16 : 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    gap: 8,
  },
  actionButtonText: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    letterSpacing: 0.3,
  },
});
