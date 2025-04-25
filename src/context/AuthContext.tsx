import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { AuthState, AuthContextType } from '../types/auth';

// Données mockées pour l'authentification
const MOCK_USER: User = {
  id: '1',
  email: 'user@example.com',
  firstName: 'Jean',
  lastName: 'Dupont',
  role: 'user',
    password: 'password',
  createdAt: new Date().toISOString()
};

// Créer le contexte avec une valeur par défaut undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simuler une vérification d'authentification
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setAuthState({
            user: JSON.parse(storedUser),
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      } catch {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to authenticate'
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState({ ...authState, isLoading: true, error: null });
    
    try {
      // Simuler une API d'authentification
      if (email === 'user@example.com' && password === 'password') {
        setAuthState({
          user: MOCK_USER,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        localStorage.setItem('user', JSON.stringify(MOCK_USER));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setAuthState({ ...authState, isLoading: true, error: null });
    
    try {
      // Simuler un enregistrement
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};