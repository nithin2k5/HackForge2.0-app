import { ScrollView, View, Text, TouchableOpacity, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import Animated, { FadeInDown, FadeInUp, FadeInRight, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import Loader from '@/components/common/Loader';
import { COLORS } from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

export default function HomeScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);
  const cardWidth = Dimensions.get('window').width - 80;
  const cardGap = 16;

  const handleGetStarted = () => {
    router.push('/auth');
  };

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      signIn();
      setLoading(false);
    }, 1000);
  };

  const benefitCards = [
    {
      icon: 'person',
      title: 'Job Seekers',
      description: 'Skip tedious applications. Get matched with opportunities that fit your skills.',
    },
    {
      icon: 'code-working',
      title: 'Freelancers',
      description: 'Discover projects that match your expertise. No more endless searching.',
    },
    {
      icon: 'business',
      title: 'Companies',
      description: 'Find perfect candidates faster with AI-powered screening and matching.',
    },
  ];

  useEffect(() => {
    const totalWidth = (cardWidth + cardGap) * benefitCards.length;

    const scroll = () => {
      if (scrollViewRef.current) {
        scrollPosition.current += cardWidth + cardGap;

        if (scrollPosition.current >= totalWidth * 2) {
          scrollPosition.current = totalWidth;
        }

        scrollViewRef.current.scrollTo({
          x: scrollPosition.current,
          animated: true,
        });
      }
    };

    const interval = setInterval(scroll, 3000);

    return () => clearInterval(interval);
  }, [cardWidth, cardGap]);

  return (
    <>
      {loading && <Loader message="Signing you in..." />}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Ionicons name="briefcase" size={22} color={COLORS.PRIMARY} />
            </View>
            <Text style={styles.logoText}>GROEI</Text>
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Find Your Perfect Match
          </Text>
          <Text style={styles.heroSubtitle}>
            AI-powered job matching for professionals and companies
          </Text>
          <Text style={styles.heroDescription}>
            Upload your resume once. Let our intelligent system match you with the perfect opportunities.
          </Text>
          <View style={styles.heroButtons}>
            <Pressable style={styles.primaryButton} onPress={handleGetStarted}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" style={styles.buttonIcon} />
            </Pressable>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleGetStarted}>
              <Ionicons name="cloud-upload-outline" size={20} color={COLORS.PRIMARY} style={styles.buttonIcon} />
              <Text style={styles.secondaryButtonText}>Upload Resume</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(800)} style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, isSmallScreen && styles.statNumberSmall]}>50K+</Text>
            <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>Professionals</Text>
          </View>
          <View style={[styles.statDivider, isSmallScreen && styles.statDividerSmall]} />
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push('/companies' as any)}
          >
            <Text style={[styles.statNumber, isSmallScreen && styles.statNumberSmall]}>5K+</Text>
            <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>Companies</Text>
          </TouchableOpacity>
          <View style={[styles.statDivider, isSmallScreen && styles.statDividerSmall]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, isSmallScreen && styles.statNumberSmall]}>95%</Text>
            <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>Match Rate</Text>
          </View>
        </Animated.View>

        <View style={styles.contentSection}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <Text style={styles.sectionSubtitle}>Three simple steps to your next opportunity</Text>

            <View style={styles.stepsContainer}>
              <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepIconContainer}>
                  <Ionicons name="document-text" size={32} color={COLORS.PRIMARY} />
                </View>
                <Text style={styles.stepTitle}>Upload Resume</Text>
                <Text style={styles.stepDescription}>
                  Simply upload your resume in any format
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepIconContainer}>
                  <Ionicons name="sparkles" size={32} color={COLORS.PRIMARY} />
                </View>
                <Text style={styles.stepTitle}>AI Analysis</Text>
                <Text style={styles.stepDescription}>
                  Our AI extracts your skills and experience
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepIconContainer}>
                  <Ionicons name="checkmark-circle" size={32} color={COLORS.PRIMARY} />
                </View>
                <Text style={styles.stepTitle}>Get Matched</Text>
                <Text style={styles.stepDescription}>
                  Receive personalized job recommendations
                </Text>
              </Animated.View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who We Serve</Text>
            <Text style={styles.sectionSubtitle}>Built for everyone in the job market</Text>

            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
              style={styles.horizontalScroll}
              pagingEnabled={false}
              decelerationRate="fast"
              snapToInterval={cardWidth + cardGap}
              snapToAlignment="start"
              onScroll={(event) => {
                scrollPosition.current = event.nativeEvent.contentOffset.x;
              }}
              scrollEventThrottle={16}
            >
              {[...benefitCards, ...benefitCards, ...benefitCards].map((card, index) => (
                <View key={index} style={[styles.benefitCard, { width: cardWidth }]}>
                  <View style={styles.benefitIconContainer}>
                    <Ionicons name={card.icon as any} size={28} color={COLORS.PRIMARY} />
                  </View>
                  <Text style={styles.benefitTitle}>{card.title}</Text>
                  <Text style={styles.benefitDescription}>
                    {card.description}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Choose groei</Text>
            <Text style={styles.sectionSubtitle}>Features that make the difference</Text>

            <View style={styles.featuresList}>
              <View style={styles.featureRow}>
                <View style={styles.featureIconBox}>
                  <Ionicons name="flash" size={24} color={COLORS.PRIMARY} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Instant Matching</Text>
                  <Text style={styles.featureDescription}>
                    Get matched in seconds with advanced AI algorithms
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={styles.featureIconBox}>
                  <Ionicons name="shield-checkmark" size={24} color={COLORS.PRIMARY} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Secure & Private</Text>
                  <Text style={styles.featureDescription}>
                    Your data is encrypted and protected with enterprise-grade security
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={styles.featureIconBox}>
                  <Ionicons name="stats-chart" size={24} color={COLORS.PRIMARY} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Smart Analytics</Text>
                  <Text style={styles.featureDescription}>
                    Track applications and get insights on your profile performance
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={styles.featureIconBox}>
                  <Ionicons name="notifications" size={24} color={COLORS.PRIMARY} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Real-time Updates</Text>
                  <Text style={styles.featureDescription}>
                    Receive instant notifications for new matching opportunities
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.ctaSection}>
            <View style={styles.ctaCard}>
              <View style={styles.ctaIconContainer}>
                <Ionicons name="rocket" size={40} color={COLORS.PRIMARY} />
              </View>
              <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
              <Text style={styles.ctaDescription}>
                Join thousands of professionals and companies already using groei
              </Text>
              <Pressable style={styles.ctaButton} onPress={handleGetStarted}>
                <Text style={styles.ctaButtonText}>Create Your Account</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" style={styles.ctaButtonIcon} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={() => router.push('/chatbot' as any)}
      >
        <Ionicons name="chatbubbles" size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
    </>
  );
}

const { width: screenWidthForStyles } = Dimensions.get('window');
const isSmallScreenForStyles = screenWidthForStyles < 375;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: COLORS.BACKGROUND,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    padding: 0,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    letterSpacing: 2,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 16,
    letterSpacing: -1.5,
    lineHeight: 52,
  },
  heroSubtitle: {
    fontSize: 20,
    color: COLORS.PRIMARY,
    marginBottom: 16,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.2,
    opacity: 0.9,
  },
  heroDescription: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 32,
    lineHeight: 26,
    fontWeight: '500',
    opacity: 0.8,
  },
  heroButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  secondaryButton: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.CARD_BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  secondaryButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: isSmallScreenForStyles ? 16 : 24,
    paddingVertical: isSmallScreenForStyles ? 24 : 32,
    backgroundColor: COLORS.WHITE,
    marginHorizontal: isSmallScreenForStyles ? 16 : 24,
    borderRadius: COLORS.CARD_RADIUS,
    marginBottom: isSmallScreenForStyles ? 32 : 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: screenWidthForStyles - (isSmallScreenForStyles ? 32 : 48),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    paddingHorizontal: isSmallScreenForStyles ? 4 : 8,
  },
  statNumber: {
    fontSize: isSmallScreenForStyles ? 28 : 34,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: isSmallScreenForStyles ? 3 : 4,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  statNumberSmall: {
    fontSize: 26,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: isSmallScreenForStyles ? 12 : 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: isSmallScreenForStyles ? 16 : 18,
  },
  statLabelSmall: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    height: isSmallScreenForStyles ? 36 : 40,
    backgroundColor: COLORS.CARD_BORDER,
    marginHorizontal: isSmallScreenForStyles ? 4 : 8,
    flexShrink: 0,
  },
  statDividerSmall: {
    height: 32,
    marginHorizontal: 2,
  },
  contentSection: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 56,
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 32,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  stepsContainer: {
    gap: 16,
  },
  stepCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: COLORS.CARD_RADIUS,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    marginBottom: 16,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  stepNumber: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.GLASS_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.PRIMARY,
  },
  stepIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.GLASS_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  stepDescription: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 24,
    fontWeight: '500',
    opacity: 0.8,
  },
  horizontalScroll: {
    marginHorizontal: 0,
  },
  horizontalScrollContent: {
    paddingHorizontal: 24,
    paddingRight: 24,
  },
  benefitCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: COLORS.CARD_RADIUS,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    marginRight: 16,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  benefitIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS.GLASS_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  benefitTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  benefitDescription: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 24,
    fontWeight: '500',
    opacity: 0.8,
  },
  featuresList: {
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: COLORS.CARD_RADIUS,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    marginBottom: 12,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    alignItems: 'center',
  },
  featureIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.GLASS_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    fontWeight: '500',
    opacity: 0.8,
  },
  ctaSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  ctaCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: COLORS.GLASS_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -1,
  },
  ctaDescription: {
    fontSize: 17,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
    fontWeight: '500',
    opacity: 0.8,
  },
  ctaButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  ctaButtonIcon: {
    marginLeft: 4,
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
