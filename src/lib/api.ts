// api.ts - Frontend API Service
import axios, { AxiosResponse, AxiosError } from 'axios';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'admin' | 'user';
}

export interface Post {
  id: string;
  title_en: string;
  title_np: string;
  content_en: string;
  content_np: string;
  excerpt_en?: string;
  excerpt_np?: string;
  category: 'technology' | 'digitalTransformation' | 'socialJustice' | 'events' | 'innovation' | 'policy' | 'education' | 'startups';
  image: string;
  author: User;
  tags: string[];
  featured: boolean;
  published: boolean;
  views: number;
  likes: number;
  comments: Comment[];
  publishedAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface CreatePostData {
  title_en: string;
  title_np: string;
  content_en: string;
  content_np: string;
  excerpt_en?: string;
  excerpt_np?: string;
  category: string;
  image: string;
  tags: string[];
  featured: boolean;
  published: boolean;
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export interface PostsResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    page: number;
    limit: number;
    pages: number;
  };
  data: Post[];
}

export interface PostResponse {
  success: boolean;
  data: Post;
}

export interface PostsQuery {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: string;
  language?: 'en' | 'np';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface StatsResponse {
  success: boolean;
  data: {
    totalPosts: number;
    totalUsers: number;
    totalViews: number;
    featuredPosts: number;
    publishedPosts: number;
    draftPosts: number;
    monthlyViews: number;
    monthlyPosts: number;
  };
}

// API Configuration
// const API_BASE_URL = 'http://localhost:8000/api';

const API_BASE_URL = 'https://ictforumbackend-4.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        // window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // Login admin
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response: AxiosResponse<{ success: boolean; data: { user: User; token: string } }> = 
        await api.post('/auth/login', { email, password });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get current user info
  getProfile: async (): Promise<User> => {
    try {
      const response: AxiosResponse<{ success: boolean; data: User }> = 
        await api.get('/auth/profile');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      // Still remove token even if logout fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
      }
      throw handleApiError(error);
    }
  }
};

// Posts API
export const postsAPI = {
  // Get all posts with pagination and filters
  getPosts: async (params: PostsQuery = {}): Promise<PostsResponse> => {
    try {
      const response: AxiosResponse<PostsResponse> = await api.get('/posts', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get single post by ID
  getPost: async (id: string, language: 'en' | 'np' = 'en'): Promise<PostResponse> => {
    try {
      const response: AxiosResponse<PostResponse> = await api.get(`/posts/${id}`, {
        params: { language }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new post
  createPost: async (postData: CreatePostData): Promise<PostResponse> => {
    try {
      const response: AxiosResponse<PostResponse> = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update post
  updatePost: async (id: string, postData: UpdatePostData): Promise<PostResponse> => {
    try {
      const response: AxiosResponse<PostResponse> = await api.put(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete post
  deletePost: async (id: string): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Like/Unlike post
  likePost: async (id: string): Promise<{ success: boolean; message: string; likes: number }> => {
    try {
      const response: AxiosResponse<{ success: boolean; message: string; likes: number }> = 
        await api.put(`/posts/${id}/like`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Add comment to post
  addComment: async (id: string, text: string): Promise<{ success: boolean; message: string; data: Comment }> => {
    try {
      const response: AxiosResponse<{ success: boolean; message: string; data: Comment }> = 
        await api.post(`/posts/${id}/comments`, { text });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get featured posts
  getFeaturedPosts: async (language: 'en' | 'np' = 'en'): Promise<PostsResponse> => {
    try {
      const response: AxiosResponse<PostsResponse> = await api.get('/posts', {
        params: { featured: true, language, limit: 6 }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get posts by category
  getPostsByCategory: async (category: string, language: 'en' | 'np' = 'en'): Promise<PostsResponse> => {
    try {
      const response: AxiosResponse<PostsResponse> = await api.get('/posts', {
        params: { category, language }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Search posts
  searchPosts: async (searchTerm: string, language: 'en' | 'np' = 'en'): Promise<PostsResponse> => {
    try {
      const response: AxiosResponse<PostsResponse> = await api.get('/posts', {
        params: { search: searchTerm, language }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Stats API (for admin dashboard)
export const statsAPI = {
  // Get dashboard statistics
  getStats: async (): Promise<StatsResponse> => {
    try {
      // This would be a real endpoint in your backend
      const response: AxiosResponse<StatsResponse> = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      // Fallback with mock data for now
      return {
        success: true,
        data: {
          totalPosts: 156,
          totalUsers: 1247,
          totalViews: 45230,
          featuredPosts: 12,
          publishedPosts: 144,
          draftPosts: 12,
          monthlyViews: 12540,
          monthlyPosts: 24
        }
      };
    }
  },

  // Get analytics data
  getAnalytics: async (period: 'week' | 'month' | 'year' = 'month'): Promise<any> => {
    try {
      const response = await api.get(`/admin/analytics`, { params: { period } });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Media API
export const mediaAPI = {
  // Upload image
  uploadImage: async (file: File): Promise<{ success: boolean; data: { url: string } }> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response: AxiosResponse<{ success: boolean; data: { url: string } }> = 
        await api.post('/media/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get media files
  getMediaFiles: async (): Promise<{ success: boolean; data: any[] }> => {
    try {
      const response = await api.get('/media');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete media file
  deleteMediaFile: async (id: string): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await api.delete(`/media/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Utility function to handle API errors
const handleApiError = (error: any): Error => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'An error occurred';
    const errors = error.response.data?.errors || [];
    
    if (errors.length > 0) {
      return new Error(`${message}: ${errors.map((e: any) => e.msg).join(', ')}`);
    }
    
    return new Error(message);
  } else if (error.request) {
    // Request was made but no response received
    return new Error('Network error - please check your connection');
  } else {
    // Something else happened
    return new Error(error.message || 'An unexpected error occurred');
  }
};

// Utility functions for common operations
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('adminToken');
  },

  // Get stored token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('adminToken');
  },

  // Set token
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', token);
    }
  },

  // Remove token
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
    }
  },

  // Format error message for display
  formatErrorMessage: (error: any): string => {
    if (error.message) return error.message;
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred';
  },

  // Build query string from object
  buildQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString();
  }
};

// Export all APIs as default
const API = {
  auth: authAPI,
  posts: postsAPI,
  stats: statsAPI,
  media: mediaAPI,
  utils: apiUtils,
};

export default API;