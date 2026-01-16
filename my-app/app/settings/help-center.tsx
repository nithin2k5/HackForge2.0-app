import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

const faqCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'rocket-outline',
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Click on "Get Started" or "Sign Up" on the home page. Enter your email, create a password, verify your email with OTP, and complete your profile setup.',
      },
      {
        question: 'How do I upload my resume?',
        answer: 'After signing up, you can upload your resume during profile setup or later in the Settings > Manage Resume section.',
      },
      {
        question: 'How does the AI matching work?',
        answer: 'Our AI analyzes your resume, extracts your skills and experience, and matches you with relevant jobs and projects based on your profile.',
      },
    ],
  },
  {
    id: 'jobs',
    title: 'Jobs & Applications',
    icon: 'briefcase-outline',
    faqs: [
      {
        question: 'How do I apply for a job?',
        answer: 'Browse jobs, click on a job you\'re interested in, review the details, and click "Apply Now" to start the application process.',
      },
      {
        question: 'Can I save jobs for later?',
        answer: 'Yes! Click the bookmark icon on any job card to save it. You can view all saved jobs in the "Saved Jobs" section.',
      },
      {
        question: 'How do I track my applications?',
        answer: 'Go to the Applications section in your dashboard to see all your submitted applications and their current status.',
      },
    ],
  },
  {
    id: 'profile',
    title: 'Profile & Settings',
    icon: 'person-outline',
    faqs: [
      {
        question: 'How do I update my profile?',
        answer: 'Go to Settings > Edit Profile to update your personal information, skills, experience, and other details.',
      },
      {
        question: 'Can I change my password?',
        answer: 'Yes, go to Settings > Change Password to update your password. You\'ll need to enter your current password first.',
      },
      {
        question: 'How do I manage my resume?',
        answer: 'Navigate to Settings > Manage Resume to upload, update, or replace your resume file.',
      },
    ],
  },
];

const supportOptions = [
  {
    id: 'email',
    title: 'Email Support',
    description: 'Get help via email',
    icon: 'mail-outline',
    action: 'mailto:support@groei.com',
  },
  {
    id: 'chat',
    title: 'Live Chat',
    description: 'Chat with our support team',
    icon: 'chatbubbles-outline',
    action: null,
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Browse frequently asked questions',
    icon: 'help-circle-outline',
    action: null,
  },
];

export default function HelpCenterScreen() {
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const allFaqs = faqCategories.flatMap(category =>
    category.faqs.map((faq, index) => ({ ...faq, categoryId: category.id, faqIndex: index }))
  );

  const filteredFaqs = searchQuery
    ? allFaqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFaqs;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.TEXT_SECONDARY} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {searchQuery ? (
          <View style={styles.searchResults}>
            <Text style={styles.resultsTitle}>Search Results</Text>
            {filteredFaqs.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={COLORS.TEXT_SECONDARY} />
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            ) : (
              filteredFaqs.map((faq, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.faqItem}
                  onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Ionicons
                      name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={COLORS.TEXT_SECONDARY}
                    />
                  </View>
                  {expandedFaq === index && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          <>
            <View style={styles.supportSection}>
              <Text style={styles.sectionTitle}>Get Support</Text>
              <View style={styles.supportOptions}>
                <TouchableOpacity
                  style={styles.supportCard}
                  onPress={() => router.push('/chatbot' as any)}
                >
                  <View style={styles.supportIcon}>
                    <Ionicons name="chatbubbles" size={28} color={COLORS.PRIMARY} />
                  </View>
                  <Text style={styles.supportTitle}>Chat Assistant</Text>
                  <Text style={styles.supportDescription}>Get instant help</Text>
                </TouchableOpacity>
                {supportOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.supportCard}
                    onPress={() => {
                      if (option.id === 'email') {
                        router.push('/settings/contact-us' as any);
                      }
                    }}
                  >
                    <View style={styles.supportIcon}>
                      <Ionicons name={option.icon as any} size={28} color={COLORS.PRIMARY} />
                    </View>
                    <Text style={styles.supportTitle}>{option.title}</Text>
                    <Text style={styles.supportDescription}>{option.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.faqSection}>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              {faqCategories.map((category) => (
                <View key={category.id} style={styles.categoryCard}>
                  <TouchableOpacity
                    style={styles.categoryHeader}
                    onPress={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  >
                    <View style={styles.categoryHeaderLeft}>
                      <Ionicons name={category.icon as any} size={24} color={COLORS.PRIMARY} />
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                    </View>
                    <Ionicons
                      name={expandedCategory === category.id ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={COLORS.TEXT_SECONDARY}
                    />
                  </TouchableOpacity>
                  {expandedCategory === category.id && (
                    <View style={styles.faqsList}>
                      {category.faqs.map((faq, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.faqItem}
                          onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        >
                          <View style={styles.faqHeader}>
                            <Text style={styles.faqQuestion}>{faq.question}</Text>
                            <Ionicons
                              name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                              size={18}
                              color={COLORS.TEXT_SECONDARY}
                            />
                          </View>
                          {expandedFaq === index && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
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
  supportSection: {
    marginTop: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  supportOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  supportCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: 'center',
  },
  supportIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
    textAlign: 'center',
  },
  supportDescription: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  faqSection: {
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isSmallScreen ? 16 : 20,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  faqsList: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingBottom: 16,
    gap: 12,
  },
  faqItem: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 22,
  },
  faqAnswer: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  searchResults: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 12,
  },
});
