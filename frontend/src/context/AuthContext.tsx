import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'resident' | 'staff' | 'worker' | 'admin';
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: User['role'];
  address?: string;
  wasteBinId?: string;
  wasteTypePreference?: string;
  paymentInfo?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const parsed: Partial<User> & { role?: User['role'] } = JSON.parse(storedUser);
        if (parsed && parsed.id && parsed.name && parsed.role) {
          setUser({
            id: parsed.id,
            name: parsed.name,
            email: parsed.email || '',
            role: parsed.role
          });
        }
      } catch (error) {
        console.error('Failed to restore user session', error);
      }
    }
    setIsLoading(false);
  }, []);

  const persistAuth = (tokenValue: string, userValue: User) => {
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('user', JSON.stringify(userValue));
    setToken(tokenValue);
    setUser(userValue);
  };

  const login = async (email: string, password: string) => {
    try {
      // Call backend login API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      persistAuth(data.token, data.user);
      return data.user as User;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      console.log('Calling register API with:', { ...payload, password: '***' });
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Register API response status:', response.status);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Registration failed' }));
        console.error('Register API error:', error);
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Register API success:', { user: data.user, hasToken: !!data.token });
      
      persistAuth(data.token, data.user);
      return data.user as User;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Failed to connect to server. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isLoading,
      }}
    >
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
