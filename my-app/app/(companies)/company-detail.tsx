import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

const companyJobs = [
  { id: 1, title: 'Senior React Developer', location: 'Remote', salary: '$80k - $120k', match: 95 },
  { id: 2, title: 'Backend Engineer', location: 'Hybrid', salary: '$70k - $100k', match: 92 },
  { id: 3, title: 'DevOps Specialist', location: 'Remote', salary: '$90k - $130k', match: 88 },
];

export default function CompanyDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const companyName = Array.isArray(params.name) ? params.name[0] : (params.name || 'Company Name');
  const location = Array.isArray(params.location) ? params.location[0] : (params.location || 'Location');
  const employees = Array.isArray(params.employees) ? params.employees[0] : (params.employees || 'Employees');
  const website = Array.isArray(params.website) ? params.website[0] : (params.website || 'website.com');
  const description = Array.isArray(params.description) ? params.description[0] : (params.description || 'Description');
  const founded = Array.isArray(params.founded) ? params.founded[0] : (params.founded || '2020');
  const openPositions = Array.isArray(params.openPositions) ? params.openPositions[0] : (params.openPositions || '0');
  const rating = Array.isArray(params.rating) ? params.rating[0] : (params.rating || '4.5');

  const initials = companyName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Company</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.companyHeader}>
          <View style={styles.companyInitials}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{companyName}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={18} color={COLORS.PRIMARY} />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={20} color={COLORS.PRIMARY} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{location}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={20} color={COLORS.PRIMARY} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Employees</Text>
                <Text style={styles.detailValue}>{employees}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.PRIMARY} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Founded</Text>
                <Text style={styles.detailValue}>{founded}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="globe-outline" size={20} color={COLORS.PRIMARY} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Website</Text>
                <Text style={styles.detailValue}>{website}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.jobsHeader}>
            <Text style={styles.sectionTitle}>Open Positions ({openPositions})</Text>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/(jobs)/jobs' as any,
                  params: { company: companyName },
                });
              }}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {companyJobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              onPress={() => {
                router.push({
                  pathname: '/(jobs)/job-detail' as any,
                  params: {
                    id: job.id.toString(),
                    title: job.title,
                    company: companyName,
                    location: job.location,
                    salary: job.salary,
                    match: job.match.toString(),
                  },
                });
              }}
            >
              <View style={styles.jobHeader}>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobLocation}>{job.location}</Text>
                </View>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>{job.match}% Match</Text>
                </View>
              </View>
              <Text style={styles.jobSalary}>{job.salary}</Text>
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
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingBottom: 24,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  companyInitials: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  initialsText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  infoCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
  },
  detailsList: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  jobCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  jobLocation: {
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
  jobSalary: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
});
