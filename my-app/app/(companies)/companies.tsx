import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { companiesApi } from '@/services/api';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

interface Company {
  id: number;
  name: string;
  location?: string;
  employees?: string;
  website?: string;
  description?: string;
  founded?: string;
  openPositions?: number;
  rating?: number;
  featured?: boolean;
  verified?: boolean;
}

export default function CompaniesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('highest-rated');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadCompanies();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: any = {};
      if (searchQuery) filters.search = searchQuery;

      const response = await companiesApi.getAll(filters);
      setCompanies(Array.isArray(response) ? response : (response.data || response.companies || []));
    } catch (err: any) {
      console.error('Error loading companies:', err);
      setError(err.message || 'Failed to load companies');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sortedCompanies = [...companies].sort((a, b) => {
    if (sortBy === 'highest-rated') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'most-positions') return (b.openPositions || 0) - (a.openPositions || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return (b.rating || 0) - (a.rating || 0);
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            <Text style={styles.loadingText}>Loading companies...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={COLORS.ERROR} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadCompanies}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>{sortedCompanies.length} Top Companies</Text>
            <Text style={styles.sectionSubtitle}>Leading companies actively hiring on GROEI</Text>

            {sortedCompanies.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="business-outline" size={64} color={COLORS.TEXT_SECONDARY} />
                <Text style={styles.emptyText}>No companies found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search</Text>
              </View>
            ) : (
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
                          openPositions: ((company.openPositions || 0)).toString(),
                          rating: ((company.rating || 0)).toString(),
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
                        <Text style={styles.initialsText}>{getInitials(company.name)}</Text>
                      </View>
                      <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>{company.name}</Text>
                        {company.rating && (
                          <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color={COLORS.PRIMARY} />
                            <Text style={styles.ratingText}>{company.rating}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    {company.description && (
                      <Text style={styles.companyDescription} numberOfLines={2}>{company.description}</Text>
                    )}
                    <View style={styles.companyDetails}>
                      {company.location && (
                        <View style={styles.detailRow}>
                          <Ionicons name="location-outline" size={14} color={COLORS.TEXT_SECONDARY} />
                          <Text style={styles.detailText}>{company.location}</Text>
                        </View>
                      )}
                      {company.employees && (
                        <View style={styles.detailRow}>
                          <Ionicons name="people-outline" size={14} color={COLORS.TEXT_SECONDARY} />
                          <Text style={styles.detailText}>{company.employees} employees</Text>
                        </View>
                      )}
                      {company.founded && (
                        <View style={styles.detailRow}>
                          <Ionicons name="calendar-outline" size={14} color={COLORS.TEXT_SECONDARY} />
                          <Text style={styles.detailText}>Founded {company.founded}</Text>
                        </View>
                      )}
                    </View>
                    {company.openPositions !== undefined && (
                      <View style={styles.openPositions}>
                        <Text style={styles.openPositionsText}>{company.openPositions} open positions</Text>
                      </View>
                    )}
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
                              openPositions: (company.openPositions || 0).toString(),
                              rating: (company.rating || 0).toString(),
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
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.ERROR,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});
