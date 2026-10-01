import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEMO_CREDENTIALS = {
  email: 'hr@workvista.ai',
  password: 'WorkVista@2026',
  role: 'HR Manager',
  name: 'Sarah Jenkins',
  title: 'Workforce Intelligence Lead',
  avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80'
};

const STORAGE_KEY = 'workvista_hr_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const sessionData = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (sessionData) {
        return JSON.parse(sessionData);
      }
    } catch (e) {
      console.warn('Could not read stored auth session', e);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    // Simulate brief realistic enterprise authentication handshake (150ms)
    await new Promise((res) => setTimeout(res, 150));

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (
      cleanEmail === DEMO_CREDENTIALS.email.toLowerCase() &&
      cleanPassword === DEMO_CREDENTIALS.password
    ) {
      const authUser = {
        email: DEMO_CREDENTIALS.email,
        name: DEMO_CREDENTIALS.name,
        role: DEMO_CREDENTIALS.role,
        title: DEMO_CREDENTIALS.title,
        avatar: DEMO_CREDENTIALS.avatar,
        loginTime: new Date().toISOString()
      };

      try {
        if (rememberMe) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        } else {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        }
      } catch (e) {
        console.warn('Failed to persist auth session', e);
      }

      setUser(authUser);
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return {
      success: false,
      error: 'Invalid credentials. Use demo HR login: hr@workvista.ai / WorkVista@2026'
    };
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear auth session', e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
