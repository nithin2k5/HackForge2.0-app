import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

const companies = [
  {
    id: 1,
    name: 'TechCorp',
    initials: 'TC',
    location: 'San Francisco, CA',
    employees: '500-1000',
    website: 'techcorp.com',
    description: 'Leading technology company specializing in AI and cloud solutions.',
    founded: '2015',
    openPositions: 12,
    rating: 4.8,
    featured: true,
  },
  {
    id: 2,
    name: 'Design Studio',
    initials: 'DS',
    location: 'New York, NY',
    employees: '50-200',
    website: 'designstudio.com',
    description: 'Creative agency focused on digital design and branding.',
    founded: '2012',
    openPositions: 8,
    rating: 4.6,
    featured: true,
  },
  {
    id: 3,
    name: 'CloudTech',
    initials: 'CT',
    location: 'Seattle, WA',
    employees: '200-500',
    website: 'cloudtech.io',
    description: 'Cloud infrastructure and DevOps solutions provider.',
    founded: '2018',
    openPositions: 15,
    rating: 4.7,
    featured: false,
  },
  {
    id: 4,
    name: 'DataLabs',
    initials: 'DL',
    location: 'Austin, TX',
    employees: '100-200',
    website: 'datalabs.ai',
    description: 'Data science and machine learning consulting firm.',
    founded: '2016',
    openPositions: 6,
    rating: 4.9,
    featured: true,
  },
  {
    id: 5,
    name: 'BuildCo',
    initials: 'BC',
    location: 'Chicago, IL',
    employees: '500-1000',
    website: 'buildco.com',
    description: 'Software development and engineering services.',
    founded: '2010',
    openPositions: 20,
    rating: 4.5,
    featured: false,
  },
  {
    id: 6,
    name: 'InnovateHub',
    initials: 'IH',
    location: 'Boston, MA',
    employees: '50-200',
    website: 'innovatehub.com',
    description: 'Innovation lab working on cutting-edge technologies.',
    founded: '2019',
    openPositions: 10,
    rating: 4.8,
    featured: true,
  },
];

export default function CompaniesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('highest-rated');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortBy === 'highest-rated') return b.rating - a.rating;
    if (sortBy === 'most-positions') return b.openPositions - a.openPositions;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return b.rating - a.rating;
  });

  const sortOptions = [
    { id: 'highest-rated', label: 'Highest Rated' },
    { id: 'most-positions', label: 'Most Positions' },
    { id: 'name', label: 'Name (A-Z)' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Companies</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.TEXT_SECONDARY} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search companies..."
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSortMenu(!showSortMenu)}
        >
          <Text style={styles.sortButtonText}>
            Sort by: {sortOptions.find(opt => opt.id === sortBy)?.label || 'Highest Rated'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        {showSortMenu && (
          <View style={styles.sortMenu}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.sortMenuItem, sortBy === option.id && styles.sortMenuItemActive]}
                onPress={() => {
                  setSortBy(option.id);
                  setShowSortMenu(false);
                }}
              >
                <Text style={[styles.sortMenuItemText, sortBy === option.id && styles.sortMenuItemTextActive]}>
                  {option.label}
                </Text>
                {sortBy === option.id && (
                  <Ionicons name="checkmark" size={18} color={COLORS.PRIMARY} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{sortedCompanies.length} Top Companies</Text>
        <Text style={styles.sectionSubtitle}>Leading companies actively hiring on GROEI</Text>

        <View style={styles.companiesGrid}>
          {sortedCompanies.map((company) => (
            <TouchableOpacity
              key={company.id}
              style={styles.companyCard}
              onPress={() => {
                router.push({
                  pathname: '/(companies)/company-detail' as any,
                  params: {
                    id: company.id.toString(),
                    name: company.name,
                    location: company.location,
                    employees: company.employees,
                    website: company.website,
                    description: company.description,
                    founded: company.founded,
                    openPositions: company.openPositions.toString(),
                    rating: company.rating.toString(),
                  },
                });
              }}
            >
              {company.featured && (
                <View style={styles.featuredBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.TEXT_PRIMARY} />
                  <Text style={styles.featuredText}>Featured</Text>
                </View>
              )}
              <View style={styles.companyHeader}>
                <View style={styles.companyInitials}>
                  <Text style={styles.initialsText}>{company.initials}</Text>
                </View>
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>{company.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color={COLORS.PRIMARY} />
                    <Text style={styles.ratingText}>{company.rating}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.companyDescription} numberOfLines={2}>{company.description}</Text>
              <View style={styles.companyDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={14} color={COLORS.TEXT_SECONDARY} />
                  <Text style={styles.detailText}>{company.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={14} color={COLORS.TEXT_SECONDARY} />
                  <Text style={styles.detailText}>{company.employees} employees</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={14} color={COLORS.TEXT_SECONDARY} />
                  <Text style={styles.detailText}>Founded {company.founded}</Text>
                </View>
              </View>
              <View style={styles.openPositions}>
                <Text style={styles.openPositionsText}>{company.openPositions} open positions</Text>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.viewJobsButton}
                  onPress={() => {
                    router.push({
                      pathname: '/(jobs)/jobs' as any,
                      params: { company: company.name },
                    });
                  }}
                >
                  <Text style={styles.viewJobsText}>View Jobs</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewCompanyButton}
                  onPress={() => {
                    router.push({
                      pathname: '/(companies)/company-detail' as any,
                      params: {
                        id: company.id.toString(),
                        name: company.name,
                        location: company.location,
                        employees: company.employees,
                        website: company.website,
                        description: company.description,
                        founded: company.founded,
                        openPositions: company.openPositions.toString(),
                        rating: company.rating.toString(),
                      },
                    });
                  }}
                >
                  <Text style={styles.viewCompanyText}>View Company</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    letterSpacing: -0.3,
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
  companiesGrid: {
    gap: 16,
  },
  companyCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyInitials: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialsText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  companyDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: 12,
  },
  companyDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  openPositions: {
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  openPositionsText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  viewJobsButton: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewJobsText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  viewCompanyButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewCompanyText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  sortMenu: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginTop: 4,
    overflow: 'hidden',
  },
  sortMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  sortMenuItemActive: {
    backgroundColor: COLORS.SECONDARY,
  },
  sortMenuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  sortMenuItemTextActive: {
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
});
