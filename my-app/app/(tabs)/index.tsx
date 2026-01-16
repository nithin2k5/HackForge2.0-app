import { ScrollView, View, Text, TouchableOpacity, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRef, useEffect, useState } from 'react';
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

      <View style={styles.heroSection}>
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
      </View>

      <View style={styles.statsSection}>
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
      </View>

      <View style={styles.contentSection}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionSubtitle}>Three simple steps to your next opportunity</Text>

          <View style={styles.stepsContainer}>
            <View style={styles.stepCard}>
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
            </View>

            <View style={styles.stepCard}>
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
            </View>

            <View style={styles.stepCard}>
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
            </View>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: COLORS.BACKGROUND,
  },
  headerContent: {
    flexDirection: 'row',
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
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 46,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#2d3748',
    marginBottom: 16,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroDescription: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 32,
    lineHeight: 24,
    fontWeight: '500',
  },
  heroButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: COLORS.SECONDARY,
    marginHorizontal: isSmallScreenForStyles ? 16 : 24,
    borderRadius: 16,
    marginBottom: isSmallScreenForStyles ? 32 : 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: screenWidthForStyles - (isSmallScreenForStyles ? 32 : 48),
    alignSelf: 'center',
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
    backgroundColor: COLORS.SECONDARY,
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
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stepNumber: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  stepIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  stepDescription: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
    fontWeight: '500',
  },
  horizontalScroll: {
    marginHorizontal: 0,
  },
  horizontalScrollContent: {
    paddingHorizontal: 24,
    paddingRight: 24,
  },
  benefitCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  benefitDescription: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
    fontWeight: '500',
  },
  featuresList: {
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  featureDescription: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
    fontWeight: '500',
  },
  ctaSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  ctaCard: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  ctaDescription: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
});
