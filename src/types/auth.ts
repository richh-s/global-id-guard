export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'inspector' | 'admin';
  country: 'india' | 'australia' | 'uk';
  createdAt: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  country: 'india' | 'australia' | 'uk';
}