import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoaderProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export default function Loader({ message, size = 'large', color = '#041F2B' }: LoaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={size} color={color} />
        {message && (
          <Text style={styles.message}>{message}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#041F2B',
    textAlign: 'center',
  },
});
