import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { COLORS } from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

export default function JobApplicationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState({
    coverLetter: '',
    availability: '',
    expectedSalary: '',
    noticePeriod: '',
    portfolio: '',
    linkedin: '',
    additionalInfo: '',
  });

  const steps = [
    {
      number: 1,
      title: 'Cover Letter',
      icon: 'document-text',
      description: 'Write a compelling cover letter',
    },
    {
      number: 2,
      title: 'Availability',
      icon: 'calendar',
      description: 'Tell us about your availability',
    },
    {
      number: 3,
      title: 'Additional Details',
      icon: 'information-circle',
      description: 'Share any additional information',
    },
  ];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (loading) {
        return true;
      }
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        return true;
      }
      return false;
    });

    return () => {
      backHandler.remove();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentStep, loading]);

  const handleNext = () => {
    if (loading) return;

    if (currentStep === 1 && !formData.coverLetter.trim()) {
      return;
    }
    if (currentStep === 2 && (!formData.availability.trim() || !formData.expectedSalary.trim())) {
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (loading) return;
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    if (loading) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(true);
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      router.replace({
        pathname: '/application-success',
        params: {
          jobId: params.jobId || '',
          jobTitle: params.jobTitle || 'Job Position',
          company: params.company || 'Company Name',
        },
      });
      timeoutRef.current = null;
    }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.inputLabel}>Cover Letter *</Text>
            <TextInput
              style={[styles.textArea, isSmallScreen && styles.textAreaSmall]}
              placeholder="Write a compelling cover letter explaining why you're the best fit for this position..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={8}
              value={formData.coverLetter}
              onChangeText={(text) => setFormData({ ...formData, coverLetter: text })}
              textAlignVertical="top"
            />
            <Text style={styles.hintText}>
              Minimum 100 characters recommended
            </Text>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.inputLabel}>Availability *</Text>
            <TextInput
              style={[styles.input, isSmallScreen && styles.inputSmall]}
              placeholder="e.g., Immediately available, 2 weeks notice, etc."
              placeholderTextColor="#9ca3af"
              value={formData.availability}
              onChangeText={(text) => setFormData({ ...formData, availability: text })}
            />

            <Text style={styles.inputLabel}>Expected Salary *</Text>
            <TextInput
              style={[styles.input, isSmallScreen && styles.inputSmall]}
              placeholder="e.g., $80,000 - $100,000"
              placeholderTextColor="#9ca3af"
              value={formData.expectedSalary}
              onChangeText={(text) => setFormData({ ...formData, expectedSalary: text })}
              keyboardType="default"
            />

            <Text style={styles.inputLabel}>Notice Period</Text>
            <TextInput
              style={[styles.input, isSmallScreen && styles.inputSmall]}
              placeholder="e.g., 2 weeks, 1 month"
              placeholderTextColor="#9ca3af"
              value={formData.noticePeriod}
              onChangeText={(text) => setFormData({ ...formData, noticePeriod: text })}
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.inputLabel}>Portfolio URL</Text>
            <TextInput
              style={[styles.input, isSmallScreen && styles.inputSmall]}
              placeholder="https://yourportfolio.com"
              placeholderTextColor="#9ca3af"
              value={formData.portfolio}
              onChangeText={(text) => setFormData({ ...formData, portfolio: text })}
              keyboardType="url"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>LinkedIn Profile</Text>
            <TextInput
              style={[styles.input, isSmallScreen && styles.inputSmall]}
              placeholder="https://linkedin.com/in/yourprofile"
              placeholderTextColor="#9ca3af"
              value={formData.linkedin}
              onChangeText={(text) => setFormData({ ...formData, linkedin: text })}
              keyboardType="url"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Additional Information</Text>
            <TextInput
              style={[styles.textArea, isSmallScreen && styles.textAreaSmall]}
              placeholder="Any additional information you'd like to share..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={6}
              value={formData.additionalInfo}
              onChangeText={(text) => setFormData({ ...formData, additionalInfo: text })}
              textAlignVertical="top"
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              disabled={loading}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={loading ? '#cbd5e0' : COLORS.PRIMARY}
              />
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Step {currentStep} of {steps.length}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(currentStep / steps.length) * 100}%` },
                  ]}
                />
              </View>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.stepsIndicator}>
            {steps.map((step, index) => (
              <View key={step.number} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    currentStep >= step.number && styles.stepCircleActive,
                    currentStep === step.number && styles.stepCircleCurrent,
                  ]}
                >
                  {currentStep > step.number ? (
                    <Ionicons name="checkmark" size={18} color="#ffffff" />
                  ) : (
                    <Ionicons
                      name={step.icon as any}
                      size={currentStep === step.number ? 18 : 16}
                      color={currentStep >= step.number ? '#ffffff' : COLORS.TEXT_SECONDARY}
                    />
                  )}
                </View>
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.stepConnector,
                      currentStep > step.number && styles.stepConnectorActive,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleSection}>
            <View style={styles.titleIconContainer}>
              <Ionicons
                name={steps[currentStep - 1].icon as any}
                size={isSmallScreen ? 32 : 40}
                color={COLORS.PRIMARY}
              />
            </View>
            <Text style={styles.title}>{steps[currentStep - 1].title}</Text>
            <Text style={styles.subtitle}>{steps[currentStep - 1].description}</Text>
          </View>

          {renderStepContent()}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={[styles.button, styles.backButtonFooter]}
                onPress={handleBack}
                disabled={loading}
              >
                <Ionicons
                  name="arrow-back"
                  size={18}
                  color={loading ? '#cbd5e0' : COLORS.PRIMARY}
                />
                <Text
                  style={[
                    styles.buttonText,
                    styles.backButtonText,
                    loading && styles.buttonTextDisabled,
                  ]}
                >
                  BACK
                </Text>
              </TouchableOpacity>
            )}

            {currentStep < steps.length ? (
              <TouchableOpacity
                style={[styles.button, styles.nextButton]}
                onPress={handleNext}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.buttonText,
                    styles.nextButtonText,
                    loading && styles.buttonTextDisabled,
                  ]}
                >
                  NEXT
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={loading ? '#cbd5e0' : '#ffffff'}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Text style={[styles.buttonText, styles.submitButtonText]}>
                      SUBMIT
                    </Text>
                    <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingTop: isSmallScreen ? 16 : 20,
    paddingBottom: isSmallScreen ? 20 : 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 16 : 24,
    marginBottom: isSmallScreen ? 16 : 20,
  },
  backButton: {
    padding: 8,
    marginRight: isSmallScreen ? 12 : 16,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressText: {
    fontSize: isSmallScreen ? 12 : 13,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    marginBottom: 6,
  },
  progressBar: {
    width: '100%',
    height: isSmallScreen ? 4 : 5,
    backgroundColor: COLORS.BORDER,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
  },
  headerSpacer: {
    width: 40,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 16 : 24,
    gap: isSmallScreen ? 8 : 12,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: isSmallScreen ? 36 : 40,
    height: isSmallScreen ? 36 : 40,
    borderRadius: isSmallScreen ? 18 : 20,
    backgroundColor: COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  stepCircleCurrent: {
    backgroundColor: COLORS.PRIMARY,
    transform: [{ scale: 1.1 }],
  },
  stepConnector: {
    width: isSmallScreen ? 32 : 40,
    height: 2,
    backgroundColor: COLORS.BORDER,
    marginHorizontal: isSmallScreen ? 6 : 8,
  },
  stepConnectorActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingTop: isSmallScreen ? 28 : 36,
    paddingBottom: isSmallScreen ? 32 : 40,
  },
  titleIconContainer: {
    width: isSmallScreen ? 72 : 80,
    height: isSmallScreen ? 72 : 80,
    borderRadius: 20,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 20 : 24,
  },
  title: {
    fontSize: isSmallScreen ? 26 : 30,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isSmallScreen ? 15 : 16,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
    textAlign: 'center',
  },
  stepContent: {
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingBottom: isSmallScreen ? 8 : 12,
  },
  inputLabel: {
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    marginBottom: isSmallScreen ? 10 : 12,
    marginTop: isSmallScreen ? 20 : 24,
  },
  input: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 12,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingVertical: isSmallScreen ? 16 : 18,
    fontSize: isSmallScreen ? 15 : 16,
    color: COLORS.PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    width: '100%',
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginBottom: isSmallScreen ? 4 : 6,
  },
  inputSmall: {
    paddingVertical: 12,
    fontSize: 14,
  },
  textArea: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 12,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingVertical: isSmallScreen ? 16 : 18,
    fontSize: isSmallScreen ? 15 : 16,
    color: COLORS.PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    width: '100%',
    minHeight: isSmallScreen ? 150 : 170,
    includeFontPadding: false,
    textAlignVertical: 'top',
    marginBottom: isSmallScreen ? 4 : 6,
  },
  textAreaSmall: {
    minHeight: 120,
    fontSize: 14,
  },
  hintText: {
    fontSize: isSmallScreen ? 12 : 13,
    color: '#718096',
    marginTop: isSmallScreen ? 10 : 12,
    marginBottom: isSmallScreen ? 4 : 6,
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingTop: isSmallScreen ? 20 : 24,
    paddingBottom: isSmallScreen ? 20 : 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: isSmallScreen ? 12 : 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallScreen ? 16 : 18,
    borderRadius: 12,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonFooter: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  nextButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  buttonText: {
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginHorizontal: 8,
  },
  backButtonText: {
    color: COLORS.PRIMARY,
  },
  nextButtonText: {
    color: '#ffffff',
  },
  submitButtonText: {
    color: '#ffffff',
  },
  buttonTextDisabled: {
    color: '#cbd5e0',
  },
});
