import { Platform } from 'react-native';

const isDevelopment = process.env.NODE_ENV !== 'production';

const getBaseURL = () => {
  if (!isDevelopment) {
    return 'https://api.hackforge.com';
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:8085`;
  }

  if (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_API_URL) {
    return `http://${process.env.EXPO_PUBLIC_API_URL}:8085`;
  }

  if (Platform.OS === 'ios' && __DEV__) {
    return 'http://localhost:8085';
  }

  if (Platform.OS === 'android' && __DEV__) {
    return 'http://10.0.2.2:8085';
  }

  return 'http://192.168.1.100:8085';
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      VERIFY_EMAIL: '/api/auth/verify-email',
      VERIFY_OTP: '/api/auth/verify-otp',
      RESEND_VERIFICATION: '/api/auth/resend-verification',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      VERIFY_RESET_OTP: '/api/auth/verify-reset-otp',
      RESET_PASSWORD: '/api/auth/reset-password',
      PROFILE: '/api/auth/profile',
    },
    COMPANIES: {
      LIST: '/api/companies',
      DETAIL: (id: string | number) => `/api/companies/${id}`,
    },
    JOBS: {
      LIST: '/api/jobs',
      DETAIL: (id: string | number) => `/api/jobs/${id}`,
    },
    APPLICATIONS: {
      LIST: '/api/applications',
      CREATE: '/api/applications',
      DETAIL: (id: string | number) => `/api/applications/${id}`,
    },
    RESUMES: {
      LIST: '/api/resumes',
      UPLOAD: '/api/resumes',
      DETAIL: (id: string | number) => `/api/resumes/${id}`,
      SET_ACTIVE: (id: string | number) => `/api/resumes/${id}/active`,
      DELETE: (id: string | number) => `/api/resumes/${id}`,
    },
    SAVED_JOBS: {
      LIST: '/api/saved-jobs',
      SAVE: '/api/saved-jobs',
      CHECK: (jobId: string | number) => `/api/saved-jobs/check/${jobId}`,
      DELETE: (jobId: string | number) => `/api/saved-jobs/${jobId}`,
    },
    INTERVIEWS: {
      LIST: '/api/interviews',
      DETAIL: (id: string | number) => `/api/interviews/${id}`,
    },
    NOTIFICATIONS: {
      LIST: '/api/notifications',
      UNREAD_COUNT: '/api/notifications/unread-count',
      MARK_READ: (id: string | number) => `/api/notifications/${id}/read`,
      MARK_ALL_READ: '/api/notifications/read-all',
      DELETE: (id: string | number) => `/api/notifications/${id}`,
    },
  },
} as const;
