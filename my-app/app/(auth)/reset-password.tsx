import { useState, useRef, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { authApi } from '@/services/api';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'otp' | 'password'>('otp');
  const [email, setEmail] = useState<string>('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const emailParam = Array.isArray(params.email) ? params.email[0] : params.email;
    if (!emailParam) {
      Alert.alert('Error', 'Email is required');
      router.replace('/(auth)/forgot-password');
      return;
    }
    setEmail(emailParam);
  }, [params.email]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      const lastChar = value[value.length - 1];
      const newOtp = [...otp];
      newOtp[index] = lastChar;
      setOtp(newOtp);
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 50);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    const key = e.nativeEvent.key;
    if (key === 'Backspace') {
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyResetOTP(email, otpCode);
      setStep('password');
    } catch (err: any) {
      Alert.alert('Verification Failed', err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const otpCode = otp.join('');
      await authApi.resetPassword(email, otpCode, password);
      Alert.alert('Success', 'Password reset successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(auth)/auth'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password. Please try again.');
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
              onPress={() => {
                if (step === 'password') setStep('otp');
                else router.back();
              }}
              disabled={loading}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY} />
            </TouchableOpacity>

            <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.header}>
              <View style={styles.logoWrapper}>
                <View style={styles.logoContainer}>
                  <Ionicons name="key" size={32} color={COLORS.WHITE} />
                </View>
                <View style={styles.logoGlow} />
              </View>
              <Text style={styles.title}>{step === 'otp' ? 'Validate Code' : 'New Password'}</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(400).duration(800)}
              layout={Layout.springify()}
              style={styles.authCard}
            >
              {step === 'otp' ? (
                <>
                  <Text style={styles.subtitle}>
                    Enter the code sent to{'\n'}
                    <Text style={styles.emailText}>{email}</Text>
                  </Text>

                  <View style={styles.otpWrapper}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          inputRefs.current[index] = ref;
                        }}
                        style={[styles.otpInput, digit && styles.otpInputFilled]}
                        value={digit}
                        onChangeText={(v) => handleOtpChange(v, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        editable={!loading}
                        selectTextOnFocus
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.mainBtn, (loading || otp.join('').length < 6) && styles.mainBtnDisabled]}
                    onPress={handleVerifyOTP}
                    disabled={loading || otp.join('').length < 6}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.WHITE} />
                    ) : (
                      <>
                        <Text style={styles.mainBtnText}>VERIFY CODE</Text>
                        <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.WHITE} />
                      </>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.subtitle}>Set a strong password for your{'\n'}secure account</Text>

                  <View style={styles.inputBox}>
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.PRIMARY} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="New Password"
                      placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      editable={!loading}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                      <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={COLORS.TEXT_SECONDARY} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputBox}>
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.PRIMARY} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Confirm New Password"
                      placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      editable={!loading}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeBtn}>
                      <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={COLORS.TEXT_SECONDARY} />
                    </TouchableOpacity>
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
                        <Text style={styles.mainBtnText}>RESET PASSWORD</Text>
                        <Ionicons name="refresh-outline" size={20} color={COLORS.WHITE} />
                      </>
                    )}
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={styles.footerLink}
                onPress={() => router.push('/(auth)/auth')}
                disabled={loading}
              >
                <Text style={styles.footerLinkText}>Cancel & Login</Text>
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
  emailText: {
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  otpWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 8,
  },
  otpInput: {
    width: (screenWidth - 48 - 48 - (5 * 8)) / 6,
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.CARD_BORDER,
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  otpInputFilled: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.WHITE,
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
    marginBottom: 16,
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
  eyeBtn: {
    padding: 8,
  },
  mainBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 18,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
