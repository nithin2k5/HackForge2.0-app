import { API_CONFIG } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    const token = await getAuthToken();
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`[API] ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers,
      timeout: 30000,
    } as any);

    if (!response.ok) {
      let errorData;
      try {
        const text = await response.text();
        errorData = text ? JSON.parse(text) : { message: `HTTP ${response.status}: ${response.statusText}` };
      } catch (e) {
        errorData = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          error: `Server returned status ${response.status}`
        };
      }
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error: any) {
    console.error('API request error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      url: `${API_CONFIG.BASE_URL}${endpoint}`
    });

    if (error.message === 'Network request failed' || error.message?.includes('Network') || error.message?.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check:\\n1. Backend server is running on port 8085\\n2. Your device and computer are on the same network\\n3. Update EXPO_PUBLIC_API_URL in .env with your computer\'s IP address');
    }

    throw error;
  }
};

export const jobsApi = {
  getAll: async (filters?: { search?: string; status?: string; company_id?: number; type?: string; location?: string }) => {
    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.company_id) queryParams.append('company_id', filters.company_id.toString());
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.location) queryParams.append('location', filters.location);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${API_CONFIG.ENDPOINTS.JOBS.LIST}?${queryString}` : API_CONFIG.ENDPOINTS.JOBS.LIST;
    return apiRequest(endpoint);
  },
  getById: async (id: string | number) => {
    return apiRequest(API_CONFIG.ENDPOINTS.JOBS.DETAIL(id));
  },
};

export const companiesApi = {
  getAll: async (filters?: { search?: string; verified?: boolean; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.verified !== undefined) queryParams.append('verified', filters.verified.toString());
    if (filters?.featured !== undefined) queryParams.append('featured', filters.featured.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${API_CONFIG.ENDPOINTS.COMPANIES.LIST}?${queryString}` : API_CONFIG.ENDPOINTS.COMPANIES.LIST;
    return apiRequest(endpoint);
  },
  getById: async (id: string | number) => {
    return apiRequest(API_CONFIG.ENDPOINTS.COMPANIES.DETAIL(id));
  },
};

export const applicationsApi = {
  getAll: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.APPLICATIONS.LIST);
  },
  getById: async (id: string | number) => {
    return apiRequest(API_CONFIG.ENDPOINTS.APPLICATIONS.DETAIL(id));
  },
  create: async (data: any) => {
    return apiRequest(API_CONFIG.ENDPOINTS.APPLICATIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export const savedJobsApi = {
  getAll: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.SAVED_JOBS.LIST);
  },
  save: async (jobId: number) => {
    return apiRequest(API_CONFIG.ENDPOINTS.SAVED_JOBS.SAVE, {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId }),
    });
  },
  check: async (jobId: number) => {
    return apiRequest(API_CONFIG.ENDPOINTS.SAVED_JOBS.CHECK(jobId));
  },
  delete: async (jobId: number) => {
    return apiRequest(API_CONFIG.ENDPOINTS.SAVED_JOBS.DELETE(jobId), {
      method: 'DELETE',
    });
  },
};

export const interviewsApi = {
  getAll: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.INTERVIEWS.LIST);
  },
  getById: async (id: string | number) => {
    return apiRequest(API_CONFIG.ENDPOINTS.INTERVIEWS.DETAIL(id));
  },
};

export const notificationsApi = {
  getAll: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST);
  },
  getUnreadCount: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  },
  markRead: async (id: string | number) => {
    return apiRequest(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ(id), {
      method: 'PUT',
    });
  },
  markAllRead: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {
      method: 'PUT',
    });
  },
  delete: async (id: string | number) => {
    return apiRequest(API_CONFIG.ENDPOINTS.NOTIFICATIONS.DELETE(id), {
      method: 'DELETE',
    });
  },
};

export const authApi = {
  register: async (data: { name: string; email: string; password: string; phone?: string; location?: string; title?: string }) => {
    return apiRequest(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  login: async (email: string, password: string) => {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      await AsyncStorage.setItem('authToken', response.token);
    }
    return response;
  },
  verifyEmail: async (token: string) => {
    return apiRequest(`${API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`, {
      method: 'GET',
    });
  },
  verifyOTP: async (email: string, code: string) => {
    return apiRequest(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP, {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },
  resendVerification: async (email: string) => {
    return apiRequest(API_CONFIG.ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  forgotPassword: async (email: string) => {
    return apiRequest(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  verifyResetOTP: async (email: string, code: string) => {
    return apiRequest(API_CONFIG.ENDPOINTS.AUTH.VERIFY_RESET_OTP, {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },
  resetPassword: async (email: string, code: string, password: string) => {
    return apiRequest(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email, code, password }),
    });
  },
  getProfile: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.AUTH.PROFILE, {
      method: 'GET',
    });
  },
  updateProfile: async (data: any) => {
    return apiRequest(API_CONFIG.ENDPOINTS.AUTH.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest(`${API_CONFIG.BASE_URL}/api/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
  },
};

export const resumesApi = {
  getAll: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.RESUMES.LIST);
  },
  getById: async (id: string | number) => {
    return apiRequest(API_CONFIG.ENDPOINTS.RESUMES.DETAIL(id));
  },
  upload: async (fileUri: string, fileName: string, fileType: string) => {
    const token = await getAuthToken();
    const formData = new FormData();

    const file: any = {
      uri: fileUri,
      name: fileName,
      type: fileType,
    };

    formData.append('resume', file);

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESUMES.UPLOAD}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
  setActive: async (id: string | number) => {
    return apiRequest(API_CONFIG.ENDPOINTS.RESUMES.SET_ACTIVE(id), {
      method: 'PUT',
    });
  },
  delete: async (id: string | number) => {
    return apiRequest(API_CONFIG.ENDPOINTS.RESUMES.DELETE(id), {
      method: 'DELETE',
    });
  },
};
