import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import type { User, AuthState, LoginCredentials } from '@/types/auth'

interface SignupCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
  country: string
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Base URL + auth header
axios.defaults.baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('verifyme_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // On mount, if a token exists, verify it with /api/auth/me
  useEffect(() => {
    const boot = async () => {
      const token = localStorage.getItem('verifyme_token')
      if (!token) {
        setAuthState((s) => ({ ...s, isLoading: false }))
        return
      }
      try {
        const { data: me } = await axios.get<User>('/api/auth/me')
        localStorage.setItem('verifyme_user', JSON.stringify(me))
        setAuthState({ user: me, isAuthenticated: true, isLoading: false })
      } catch {
        localStorage.removeItem('verifyme_user')
        localStorage.removeItem('verifyme_token')
        setAuthState({ user: null, isAuthenticated: false, isLoading: false })
      }
    }
    boot()
  }, [])

  const login = async ({ email, password }: LoginCredentials) => {
    const { data } = await axios.post<{ token: string; user: User }>('/api/auth/login', {
      email,
      password,
    })
    localStorage.setItem('verifyme_token', data.token)
    localStorage.setItem('verifyme_user', JSON.stringify(data.user))
    setAuthState({ user: data.user, isAuthenticated: true, isLoading: false })
  }

  const signup = async (credentials: SignupCredentials) => {
    const { data: user } = await axios.post<User>('/api/auth/signup', {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
      country: credentials.country,
    })
    // Most apps also return a token on signup. If yours does, store it here.
    localStorage.setItem('verifyme_user', JSON.stringify(user))
    setAuthState({ user, isAuthenticated: true, isLoading: false })
  }

  const logout = () => {
    localStorage.removeItem('verifyme_user')
    localStorage.removeItem('verifyme_token')
    setAuthState({ user: null, isAuthenticated: false, isLoading: false })
  }

  const updateUser = (updates: Partial<User>) => {
    if (!authState.user) return
    const updated = { ...authState.user, ...updates }
    localStorage.setItem('verifyme_user', JSON.stringify(updated))
    setAuthState((s) => ({ ...s, user: updated }))
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
