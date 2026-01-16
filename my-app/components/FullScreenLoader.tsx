import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FullScreenLoaderProps {
  message?: string;
}

export default function FullScreenLoader({ message = 'Loading...' }: FullScreenLoaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="briefcase" size={48} color="#041F2B" />
        </View>
        <ActivityIndicator size="large" color="#041F2B" style={styles.spinner} />
        <Text style={styles.message}>{message.toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4a5568',
    letterSpacing: 1,
  },
});
