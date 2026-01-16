import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

const categories = [
  { id: 'all', label: 'All', icon: 'grid-outline' },
  { id: 'jobs', label: 'Jobs', icon: 'briefcase-outline' },
  { id: 'projects', label: 'Projects', icon: 'folder-outline' },
  { id: 'companies', label: 'Companies', icon: 'business-outline' },
];

const featuredItems = [
  {
    id: 1,
    type: 'job',
    title: 'Senior React Developer',
    company: 'Tech Corp Inc.',
    location: 'Remote',
    match: 95,
    icon: 'code',
  },
  {
    id: 2,
    type: 'project',
    title: 'E-commerce Platform Development',
    client: 'Retail Corp',
    budget: '₹1.2L - ₹2L',
    match: 92,
    icon: 'cart',
  },
  {
    id: 3,
    type: 'company',
    name: 'TechCorp',
    location: 'San Francisco, CA',
    openPositions: 12,
    rating: 4.8,
    icon: 'business',
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const handleGetStarted = () => {
    router.push('/auth');
  };

  const filteredItems = featuredItems.filter(item => {
    if (activeCategory !== 'all' && item.type !== activeCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (item.type === 'job') {
        return (item.title || '').toLowerCase().includes(query) || (item.company || '').toLowerCase().includes(query);
      } else if (item.type === 'project') {
        return (item.title || '').toLowerCase().includes(query) || (item.client || '').toLowerCase().includes(query);
      } else if (item.type === 'company') {
        return (item.name || '').toLowerCase().includes(query) || (item.location || '').toLowerCase().includes(query);
      }
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="briefcase" size={22} color={COLORS.PRIMARY} />
          </View>
          <Text style={styles.logoText}>GROEI</Text>
        </View>
        {!isSignedIn && (
          <TouchableOpacity style={styles.signInButton} onPress={handleGetStarted}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.TEXT_SECONDARY} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, projects, companies..."
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryChip, activeCategory === category.id && styles.categoryChipActive]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={18}
                color={activeCategory === category.id ? COLORS.TEXT_PRIMARY : COLORS.TEXT_SECONDARY}
              />
              <Text style={[styles.categoryText, activeCategory === category.id && styles.categoryTextActive]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Discover Opportunities</Text>
        <Text style={styles.sectionSubtitle}>Find your next job, project, or company</Text>

        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {filteredItems.map((item) => {
              if (item.type === 'job') {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemCard}
                    onPress={() => {
                      if (isSignedIn && item.type === 'job') {
                        router.push({
                          pathname: '/(jobs)/job-detail' as any,
                          params: {
                            id: item.id.toString(),
                            title: item.title || '',
                            company: item.company || '',
                            location: item.location || '',
                            match: (item.match || 0).toString(),
                          },
                        });
                      } else {
                        handleGetStarted();
                      }
                    }}
                  >
                    <View style={styles.itemHeader}>
                      <View style={styles.itemIconContainer}>
                        <Ionicons name={item.icon as any} size={24} color={COLORS.PRIMARY} />
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle}>{item.title || 'Job Title'}</Text>
                        <Text style={styles.itemSubtitle}>{item.company || 'Company'} • {item.location || 'Location'}</Text>
                      </View>
                      <View style={styles.matchBadge}>
                        <Text style={styles.matchText}>{item.match}%</Text>
                      </View>
                    </View>
                    <View style={styles.itemTypeBadge}>
                      <Text style={styles.itemTypeText}>Job</Text>
                    </View>
                  </TouchableOpacity>
                );
              } else if (item.type === 'project') {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemCard}
                    onPress={() => {
                      if (isSignedIn) {
                        router.push({
                          pathname: '/(projects)/project-detail' as any,
                          params: {
                            id: item.id.toString(),
                            title: item.title,
                            client: item.client,
                            budget: item.budget,
                            duration: '3-6 months',
                            skills: 'React,Node.js',
                            match: (item.match || 0).toString(),
                            status: 'active',
                          },
                        });
                      } else {
                        handleGetStarted();
                      }
                    }}
                  >
                    <View style={styles.itemHeader}>
                      <View style={styles.itemIconContainer}>
                        <Ionicons name={item.icon as any} size={24} color={COLORS.PRIMARY} />
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle}>{item.title || 'Project Title'}</Text>
                        <Text style={styles.itemSubtitle}>{item.client || 'Client'} • {item.budget || 'Budget'}</Text>
                      </View>
                      <View style={styles.matchBadge}>
                        <Text style={styles.matchText}>{item.match}%</Text>
                      </View>
                    </View>
                    <View style={styles.itemTypeBadge}>
                      <Text style={styles.itemTypeText}>Project</Text>
                    </View>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemCard}
                    onPress={() => {
                      if (isSignedIn && item.type === 'company') {
                        router.push({
                          pathname: '/(companies)/company-detail' as any,
                          params: {
                            id: item.id.toString(),
                            name: item.name || '',
                            location: item.location || '',
                            employees: '500-1000',
                            website: 'techcorp.com',
                            description: 'Leading technology company.',
                            founded: '2015',
                            openPositions: (item.openPositions || 0).toString(),
                            rating: (item.rating || 0).toString(),
                          },
                        });
                      } else {
                        handleGetStarted();
                      }
                    }}
                  >
                    <View style={styles.itemHeader}>
                      <View style={styles.itemIconContainer}>
                        <Ionicons name={item.icon as any} size={24} color={COLORS.PRIMARY} />
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle}>{item.name || 'Company Name'}</Text>
                        <Text style={styles.itemSubtitle}>{item.location || 'Location'} • {item.openPositions || 0} open positions</Text>
                      </View>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={14} color={COLORS.PRIMARY} />
                        <Text style={styles.ratingText}>{item.rating || 0}</Text>
                      </View>
                    </View>
                    <View style={styles.itemTypeBadge}>
                      <Text style={styles.itemTypeText}>Company</Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        )}

        {!isSignedIn && (
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
            <Text style={styles.ctaDescription}>
              Sign up to access all features and get personalized recommendations
            </Text>
            <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
              <Text style={styles.ctaButtonText}>Create Account</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: isSmallScreen ? 24 : 26,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    letterSpacing: 2,
  },
  signInButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  signInText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.PRIMARY,
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
  categoriesContainer: {
    paddingBottom: 12,
  },
  categoriesScroll: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.SECONDARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    gap: 6,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  categoryTextActive: {
    color: COLORS.TEXT_PRIMARY,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 22 : 26,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 20,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 20,
  },
  itemsList: {
    gap: 16,
  },
  itemCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
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
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  itemTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  itemTypeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
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
  ctaCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: 24,
    marginTop: 32,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: isSmallScreen ? 22 : 26,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
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
