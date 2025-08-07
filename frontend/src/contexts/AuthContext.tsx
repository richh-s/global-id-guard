import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, AuthState, LoginCredentials } from '@/types/auth';

// Update SignupCredentials to include confirmPassword
interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for admin and inspector login
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@verifyme.com',
    name: 'Admin User',
    role: 'admin',
    country: 'india',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'inspector@verifyme.com',
    name: 'John Inspector',
    role: 'inspector',
    country: 'australia',
    createdAt: new Date().toISOString(),
  },
];

// Configure Axios interceptor to include token in requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('verifyme_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('verifyme_user');
    const storedToken = localStorage.getItem('verifyme_token');
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('verifyme_user');
        localStorage.removeItem('verifyme_token');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // Check if the login is for admin or inspector
    const mockUser = mockUsers.find(u => u.email === credentials.email);
    if (mockUser && credentials.password === 'password') { // Simple password check for mock users
      localStorage.setItem('verifyme_user', JSON.stringify(mockUser));
      localStorage.setItem('verifyme_token', 'mock-token-' + mockUser.id);
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }

    // API-based login for regular users
    try {
      const response = await axios.post('/api/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      const { user, token } = response.data;

      // Ensure user object includes role
      if (!user.role) {
        throw new Error('User role not provided by server');
      }

      localStorage.setItem('verifyme_user', JSON.stringify(user));
      localStorage.setItem('verifyme_token', token);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const message =
        err.response?.status === 401
          ? 'Invalid email or password'
          : err.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(message);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    // Prevent signup with admin or inspector emails
    if (mockUsers.some(u => u.email === credentials.email)) {
      throw new Error('Cannot register with this email. It is reserved for system accounts.');
    }

    // Original API-based signup for regular users
    try {
      const response = await axios.post('/api/auth/signup', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
        country: credentials.country,
      });

      const user = response.data;

      // Ensure user object includes role (default 'User' from backend)
      if (!user.role) {
        throw new Error('User role not provided by server');
      }

      localStorage.setItem('verifyme_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const message =
        err.response?.status === 409
          ? 'Email already in use'
          : err.response?.status === 400
          ? err.response?.data?.message || 'Invalid signup data'
          : 'Failed to create account. Please try again.';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('verifyme_user');
    localStorage.removeItem('verifyme_token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      localStorage.setItem('verifyme_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      signup,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};