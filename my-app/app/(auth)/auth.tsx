import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { authApi } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const inputLayouts = useRef<{ [key: string]: number }>({});

  const tabOffset = useSharedValue(0);

  useEffect(() => {
    tabOffset.value = withSpring(isLogin ? 0 : 1, { damping: 20 });
  }, [isLogin]);

  const animatedTabStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(tabOffset.value, [0, 1], [0, (screenWidth - (24 * 2) - (20 * 2) - 8) / 2]) }],
  }));

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (loading) return;

    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const response = await authApi.login(email, password);

        if (response.token) {
          await AsyncStorage.setItem('authToken', response.token);
          signIn();
          router.replace('/dashboard');
        }
      } else {
        const response = await authApi.register({
          name,
          email,
          password,
        });

        const alertMessage = response.warning
          ? `${response.message}\n\n${response.warning}`
          : response.message || 'Please check your email for the 6-digit verification code.';

        Alert.alert(
          'Verification Required',
          alertMessage,
          [
            {
              text: 'OK',
              onPress: () => {
                router.push({
                  pathname: '/(auth)/otp-verification',
                  params: { email },
                });
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Dynamic Background Elements */}
      <View style={styles.backgroundContainer}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
        <View style={styles.bgCircle3} />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.formWrapper}>
            <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.header}>
              <View style={styles.logoWrapper}>
                <View style={styles.logoContainer}>
                  <Ionicons name="briefcase" size={28} color={COLORS.WHITE} />
                </View>
                <View style={styles.logoGlow} />
              </View>
              <Text style={styles.logoText}>GROEI</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(400).duration(800)}
              layout={Layout.springify()}
              style={styles.authCard}
            >
              <View style={styles.toggleWrapper}>
                <Animated.View style={[styles.activeTabIndicator, animatedTabStyle]} />
                <Pressable
                  style={styles.toggleBtn}
                  onPress={() => setIsLogin(true)}
                >
                  <Text style={[styles.toggleBtnText, isLogin && styles.toggleBtnTextActive]}>LOGIN</Text>
                </Pressable>
                <Pressable
                  style={styles.toggleBtn}
                  onPress={() => setIsLogin(false)}
                >
                  <Text style={[styles.toggleBtnText, !isLogin && styles.toggleBtnTextActive]}>SIGN UP</Text>
                </Pressable>
              </View>

              <View style={styles.formContent}>
                <Text style={styles.formTitle}>
                  {isLogin ? 'Welcome Back' : 'Get Started'}
                </Text>

                <View style={styles.inputsWrapper}>
                  {!isLogin && (
                    <Animated.View entering={FadeIn.duration(400)} style={styles.inputBox}>
                      <Ionicons name="person-outline" size={18} color={COLORS.PRIMARY} style={styles.inputIcon} />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Full Name"
                        placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        editable={!loading}
                      />
                    </Animated.View>
                  )}

                  <View style={styles.inputBox}>
                    <Ionicons name="mail-outline" size={18} color={COLORS.PRIMARY} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Email Address"
                      placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                    />
                  </View>

                  <View style={styles.inputBox}>
                    <Ionicons name="lock-closed-outline" size={18} color={COLORS.PRIMARY} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Password"
                      placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      editable={!loading}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                      <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={COLORS.TEXT_SECONDARY} />
                    </TouchableOpacity>
                  </View>
                </View>

                {isLogin && (
                  <TouchableOpacity
                    style={styles.forgotPass}
                    onPress={() => router.push('/(auth)/forgot-password')}
                  >
                    <Text style={styles.forgotPassText}>Forgot Password?</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.mainBtn, loading && styles.mainBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.WHITE} />
                  ) : (
                    <>
                      <Text style={styles.mainBtnText}>{isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}</Text>
                      <Ionicons name="arrow-forward" size={18} color={COLORS.WHITE} />
                    </>
                  )}
                </TouchableOpacity>

                <View style={styles.orDivider}>
                  <View style={styles.divLine} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.divLine} />
                </View>

                <TouchableOpacity style={styles.googleBtn}>
                  <Ionicons name="logo-google" size={18} color={COLORS.PRIMARY} />
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <View style={styles.authFooter}>
              <Text style={styles.footerInfo}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.footerAction}>
                  {isLogin ? 'Sign Up' : 'Log In'}
                </Text>
              </TouchableOpacity>
            </View>
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
  bgCircle3: {
    position: 'absolute',
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: screenWidth * 0.4,
    backgroundColor: COLORS.PRIMARY + '05',
    top: screenHeight * 0.3,
    left: screenWidth * 0.1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  formWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: screenHeight * 0.04,
    marginBottom: 20,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  logoGlow: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY,
    opacity: 0.4,
    transform: [{ scale: 1.15 }],
    zIndex: 1,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    letterSpacing: 3,
    includeFontPadding: false,
  },
  authCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    position: 'relative',
    height: 48,
  },
  activeTabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    width: '49%', // Slightly less than half to account for padding
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8', // A neutral grey
    letterSpacing: 0.5,
  },
  toggleBtnTextActive: {
    color: COLORS.PRIMARY,
  },
  formContent: {
    width: '100%',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputsWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 6,
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPassText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  mainBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 16,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  mainBtnDisabled: {
    opacity: 0.7,
  },
  mainBtnText: {
    color: COLORS.WHITE,
    fontSize: 15,
    fontWeight: '800',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.CARD_BORDER,
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 0.5,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    gap: 10,
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  authFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerInfo: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  footerAction: {
    fontSize: 13,
    color: COLORS.PRIMARY,
    fontWeight: '800',
  },
});
