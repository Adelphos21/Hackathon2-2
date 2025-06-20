import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState } from '../types';

interface AuthContextType {
  state: AuthState;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN'; payload: { token: string; email: string } }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        isAuthenticated: true,
        token: action.payload.token,
        email: action.payload.email
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        token: null,
        email: null
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  email: null
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Verificar si hay token en localStorage al cargar la app
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    
    if (token && email) {
      dispatch({ type: 'LOGIN', payload: { token, email } });
    }
  }, []);

  const login = (token: string, email: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    dispatch({ type: 'LOGIN', payload: { token, email } });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
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