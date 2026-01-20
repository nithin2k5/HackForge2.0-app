import { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
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
  BackHandler,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS } from '@/constants/colors';
import * as DocumentPicker from 'expo-document-picker';
import { resumesApi } from '@/services/api';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

export default function ProfileSetupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    experience: '',
    currentPosition: '',
    skills: '',
    education: '',
    languages: '',
    linkedin: '',
    portfolio: '',
    jobType: '',
    salaryExpectation: '',
    availability: '',
    workLocation: '',
    workAuthorization: '',
    resume: null as string | null,
    resumeFile: null as { uri: string; name: string; size: number; mimeType: string } | null,
  });
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const { signIn } = useAuth();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (loading) return true;
      if (currentStep > 1) {
        handleBack();
        return true;
      }
      router.back();
      return true;
    });
    return () => backHandler.remove();
  }, [currentStep, loading]);

  const steps = [
    { number: 1, title: 'Personal', icon: 'person' },
    { number: 2, title: 'Experience', icon: 'briefcase' },
    { number: 3, title: 'Preferences', icon: 'options' },
    { number: 4, title: 'Resume', icon: 'document-attach' },
  ];

  const handleNext = () => {
    if (loading) return;
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (loading) return;
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (formData.resumeFile) {
        await resumesApi.upload(
          formData.resumeFile.uri,
          formData.resumeFile.name,
          formData.resumeFile.mimeType
        );
      }
      signIn();
      setTimeout(() => {
        setLoading(false);
        router.replace('/dashboard');
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Failed to complete setup');
    }
  };

  const handleResumeUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });
      if (result.canceled) return;
      const file = result.assets[0];
      setFormData({
        ...formData,
        resume: file.name,
        resumeFile: {
          uri: file.uri,
          name: file.name,
          size: file.size || 0,
          mimeType: file.mimeType || 'application/pdf',
        },
      });
    } catch (err: any) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.indicatorWrapper}>
      <View style={styles.indicatorContainer}>
        {steps.map((step, index) => (
          <View key={step.number} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              currentStep >= step.number ? styles.stepCircleActive : styles.stepCircleInactive,
              currentStep === step.number && styles.stepCircleCurrent
            ]}>
              <Ionicons
                name={currentStep > step.number ? 'checkmark' : (step.icon as any)}
                size={18}
                color={currentStep >= step.number ? COLORS.WHITE : COLORS.TEXT_SECONDARY}
              />
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepConnector,
                currentStep > step.number ? styles.stepConnectorActive : styles.stepConnectorInactive
              ]} />
            )}
          </View>
        ))}
      </View>
      <View style={styles.stepLabels}>
        {steps.map((step) => (
          <Text key={step.number} style={[
            styles.stepLabelText,
            currentStep === step.number && styles.stepLabelTextActive
          ]}>
            {step.title}
          </Text>
        ))}
      </View>
    </View>
  );

  const FormInput = ({ label, icon, value, onChangeText, placeholder, ...props }: any) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color={COLORS.PRIMARY} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
          {...props}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.backgroundContainer}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Build Your Profile</Text>
          <View style={{ width: 44 }} />
        </View>

        {renderStepIndicator()}

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              key={currentStep}
              entering={FadeInDown.duration(600)}
              style={styles.glassCard}
            >
              {currentStep === 1 && (
                <View>
                  <Text style={styles.cardTitle}>Personal Information</Text>
                  <FormInput
                    label="Full Name" icon="person-outline"
                    value={formData.fullName}
                    onChangeText={(v: any) => setFormData({ ...formData, fullName: v })}
                    placeholder="Enter full name"
                  />
                  <FormInput
                    label="Phone Number" icon="call-outline"
                    value={formData.phone}
                    onChangeText={(v: any) => setFormData({ ...formData, phone: v })}
                    placeholder="+91 00000 00000"
                    keyboardType="phone-pad"
                  />
                  <FormInput
                    label="Location" icon="location-outline"
                    value={formData.location}
                    onChangeText={(v: any) => setFormData({ ...formData, location: v })}
                    placeholder="City, Country"
                  />
                  <FormInput
                    label="Languages" icon="language-outline"
                    value={formData.languages}
                    onChangeText={(v: any) => setFormData({ ...formData, languages: v })}
                    placeholder="English, Hindi, etc."
                  />
                </View>
              )}

              {currentStep === 2 && (
                <View>
                  <Text style={styles.cardTitle}>Professional Details</Text>
                  <FormInput
                    label="Years of Experience" icon="time-outline"
                    value={formData.experience}
                    onChangeText={(v: any) => setFormData({ ...formData, experience: v })}
                    placeholder="e.g. 3"
                    keyboardType="number-pad"
                  />
                  <FormInput
                    label="Current Position" icon="briefcase-outline"
                    value={formData.currentPosition}
                    onChangeText={(v: any) => setFormData({ ...formData, currentPosition: v })}
                    placeholder="e.g. Software Engineer"
                  />
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Skills (comma separated)</Text>
                    <View style={[styles.inputContainer, { height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
                      <Ionicons name="code-slash-outline" size={20} color={COLORS.PRIMARY} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, { height: '100%' }]}
                        value={formData.skills}
                        onChangeText={(v) => setFormData({ ...formData, skills: v })}
                        placeholder="React, Node.js, Python..."
                        placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
                        multiline
                      />
                    </View>
                  </View>
                </View>
              )}

              {currentStep === 3 && (
                <View>
                  <Text style={styles.cardTitle}>Job Preferences</Text>
                  <FormInput
                    label="Expected Job Role" icon="rocket-outline"
                    value={formData.jobType}
                    onChangeText={(v: any) => setFormData({ ...formData, jobType: v })}
                    placeholder="e.g. Fullstack Developer"
                  />
                  <FormInput
                    label="Salary Expectation" icon="cash-outline"
                    value={formData.salaryExpectation}
                    onChangeText={(v: any) => setFormData({ ...formData, salaryExpectation: v })}
                    placeholder="e.g. 15 LPA"
                  />
                  <FormInput
                    label="Availability" icon="calendar-outline"
                    value={formData.availability}
                    onChangeText={(v: any) => setFormData({ ...formData, availability: v })}
                    placeholder="Immediately / 1 Month"
                  />
                  <FormInput
                    label="Work Mode" icon="home-outline"
                    value={formData.workLocation}
                    onChangeText={(v: any) => setFormData({ ...formData, workLocation: v })}
                    placeholder="Remote / Hybrid / Onsite"
                  />
                </View>
              )}

              {currentStep === 4 && (
                <View style={styles.resumeStep}>
                  <Text style={styles.cardTitle}>Upload Resume</Text>
                  <Text style={styles.cardSubtitle}>Our AI will analyze your resume for the best matches</Text>

                  <TouchableOpacity
                    style={[styles.resumeBox, formData.resume && styles.resumeBoxActive]}
                    onPress={handleResumeUpload}
                  >
                    <Ionicons
                      name={formData.resume ? "document-text" : "cloud-upload"}
                      size={54}
                      color={COLORS.PRIMARY}
                    />
                    <Text style={styles.resumeBoxTitle}>
                      {formData.resume ? formData.resume : "Tap to Upload"}
                    </Text>
                    <Text style={styles.resumeBoxText}>PDF, DOCX up to 5MB</Text>
                  </TouchableOpacity>

                  {formData.resume && (
                    <TouchableOpacity style={styles.removeBtn} onPress={() => setFormData({ ...formData, resume: null, resumeFile: null })}>
                      <Text style={styles.removeBtnText}>Remove file</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </Animated.View>

            <View style={styles.footer}>
              {currentStep > 1 && (
                <TouchableOpacity style={styles.backBtnStyle} onPress={handleBack}>
                  <Text style={styles.backBtnText}>PREVIOUS</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.nextBtn, loading && styles.nextBtnDisabled]}
                onPress={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.WHITE} />
                ) : (
                  <>
                    <Text style={styles.nextBtnText}>{currentStep === 4 ? 'FINISH' : 'NEXT'}</Text>
                    <Ionicons name="arrow-forward" size={20} color={COLORS.WHITE} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    width: screenWidth * 1.5,
    height: screenWidth * 1.5,
    borderRadius: screenWidth * 0.75,
    backgroundColor: COLORS.PRIMARY + '06',
    top: -screenWidth * 0.4,
    right: -screenWidth * 0.4,
  },
  bgCircle2: {
    position: 'absolute',
    width: screenWidth,
    height: screenWidth,
    borderRadius: screenWidth * 0.5,
    backgroundColor: COLORS.SECONDARY + '10',
    bottom: -screenWidth * 0.2,
    left: -screenWidth * 0.3,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
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
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  indicatorWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 2,
  },
  stepCircleActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  stepCircleInactive: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.CARD_BORDER,
  },
  stepCircleCurrent: {
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    marginHorizontal: 0,
    zIndex: 1,
  },
  stepConnectorActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  stepConnectorInactive: {
    backgroundColor: COLORS.CARD_BORDER,
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 0,
  },
  stepLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
    width: 50,
    textAlign: 'center',
  },
  stepLabelTextActive: {
    color: COLORS.PRIMARY,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 10,
    minHeight: 400,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 30,
    lineHeight: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  resumeStep: {
    alignItems: 'center',
    flex: 1,
  },
  resumeBox: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderStyle: 'dashed',
    backgroundColor: COLORS.PRIMARY + '05',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resumeBoxActive: {
    borderStyle: 'solid',
    backgroundColor: COLORS.PRIMARY + '10',
  },
  resumeBoxTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 16,
    textAlign: 'center',
  },
  resumeBoxText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 6,
  },
  removeBtn: {
    marginTop: 20,
    padding: 10,
  },
  removeBtnText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 15,
  },
  backBtnStyle: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.CARD_BORDER,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    letterSpacing: 1,
  },
  nextBtn: {
    flex: 2,
    height: 60,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  nextBtnDisabled: {
    opacity: 0.7,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.WHITE,
    marginRight: 10,
    letterSpacing: 1,
  },
});
