import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { authApi } from '@/services/api';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.forgotPassword(email);
      setEmailSent(true);
      Alert.alert(
        'Check Your Email',
        response.message || 'If an account with that email exists, a password reset code has been sent.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.push({
                pathname: '/(auth)/reset-password',
                params: { email },
              });
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.backgroundContainer}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.formContainer}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY} />
            </TouchableOpacity>

            <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.header}>
              <View style={styles.logoWrapper}>
                <View style={styles.logoContainer}>
                  <Ionicons name="lock-closed" size={32} color={COLORS.WHITE} />
                </View>
                <View style={styles.logoGlow} />
              </View>
              <Text style={styles.title}>Forgot Password?</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(400).duration(800)} style={styles.authCard}>
              <Text style={styles.subtitle}>
                {emailSent
                  ? 'Check your email for the password reset code'
                  : 'Enter your email address and we\'ll send you a verification code to reset your password'}
              </Text>

              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={20} color={COLORS.PRIMARY} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email Address"
                  placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.mainBtn, loading && styles.mainBtnDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.WHITE} />
                ) : (
                  <>
                    <Text style={styles.mainBtnText}>SEND RESET CODE</Text>
                    <Ionicons name="send" size={18} color={COLORS.WHITE} />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.footerLink}
                onPress={() => router.push('/(auth)/auth')}
              >
                <Text style={styles.footerLinkText}>Back to Login</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
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
    width: screenWidth * 1.2,
    height: screenWidth * 1.2,
    borderRadius: screenWidth * 0.6,
    backgroundColor: COLORS.PRIMARY + '10',
    top: -screenWidth * 0.4,
    right: -screenWidth * 0.3,
  },
  bgCircle2: {
    position: 'absolute',
    width: screenWidth,
    height: screenWidth,
    borderRadius: screenWidth * 0.5,
    backgroundColor: COLORS.SECONDARY + '20',
    bottom: -screenWidth * 0.2,
    left: -screenWidth * 0.4,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  logoGlow: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY,
    opacity: 0.5,
    transform: [{ scale: 1.2 }],
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    textAlign: 'center',
  },
  authCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 15,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  mainBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 18,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  mainBtnDisabled: {
    opacity: 0.7,
  },
  mainBtnText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
    letterSpacing: 1,
  },
  footerLink: {
    alignItems: 'center',
  },
  footerLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
});
