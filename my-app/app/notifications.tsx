import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import Animated, { FadeInDown, FadeInUp, Layout, FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

const notifications = [
  {
    id: 1,
    type: 'application',
    title: 'Application Update',
    message: 'Your application for Senior React Developer at Tech Corp has been reviewed',
    time: '2 hours ago',
    read: false,
    icon: 'briefcase',
    color: '#3B82F6',
  },
  {
    id: 2,
    type: 'match',
    title: 'New Job Match',
    message: 'We found 3 new jobs that match your profile',
    time: '5 hours ago',
    read: false,
    icon: 'star',
    color: '#F59E0B',
  },
  {
    id: 3,
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from a recruiter at Google',
    time: '1 day ago',
    read: true,
    icon: 'mail',
    color: '#10B981',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notificationsList, setNotificationsList] = useState(notifications);

  const markAsRead = (id: number) => {
    setNotificationsList(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const unreadCount = notificationsList.filter(n => !n.read).length;

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

      {/* Dynamic Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
          <View style={{ width: 44 }} />
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notificationsList.length === 0 ? (
            <Animated.View entering={FadeIn.delay(300)} style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="notifications-outline" size={64} color={COLORS.PRIMARY} />
              </View>
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptyText}>You'll see updates about your applications and matches here.</Text>
            </Animated.View>
          ) : (
            <View>
              <Text style={styles.sectionTitle}>Recent Updates</Text>
              {notificationsList.map((notification, index) => (
                <Animated.View
                  key={notification.id}
                  entering={FadeInDown.delay(index * 100).duration(600)}
                  layout={Layout.springify()}
                >
                  <TouchableOpacity
                    style={[
                      styles.notificationCard,
                      !notification.read && styles.notificationCardUnread
                    ]}
                    onPress={() => {
                      markAsRead(notification.id);
                      if (notification.type === 'application') {
                        router.push('/applications');
                      }
                    }}
                  >
                    <View style={[styles.iconBox, { backgroundColor: notification.color + '15' }]}>
                      <Ionicons name={notification.icon as any} size={24} color={notification.color} />
                    </View>

                    <View style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.notifTitle}>{notification.title}</Text>
                        {!notification.read && <View style={styles.unreadDot} />}
                      </View>
                      <Text style={styles.notifMessage} numberOfLines={2}>{notification.message}</Text>
                      <View style={styles.cardFooter}>
                        <Ionicons name="time-outline" size={12} color={COLORS.TEXT_SECONDARY} />
                        <Text style={styles.notifTime}>{notification.time}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
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
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: COLORS.PRIMARY,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    position: 'absolute',
    top: 10,
    right: 60,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
    letterSpacing: 1,
    marginLeft: 4,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  notificationCardUnread: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.PRIMARY + '30',
    shadowOpacity: 0.1,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  notifMessage: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: 8,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notifTime: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.PRIMARY + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
    fontWeight: '500',
  },
});
