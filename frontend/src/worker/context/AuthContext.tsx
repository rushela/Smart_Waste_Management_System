import React, { useEffect, useState, createContext, useContext } from 'react';

// Backend API URL - update this to match your backend
const API_URL = 'http://localhost:5000/api';

// Mock worker data for fallback
const MOCK_WORKERS = [{
  id: 'W001',
  name: 'John Smith',
  email: 'john@ecowaste.com',
  password: 'password123'
}, {
  id: 'W002',
  name: 'Sarah Johnson',
  email: 'sarah@ecowaste.com',
  password: 'password123'
}];

type Worker = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  worker: Worker | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedWorker = localStorage.getItem('ecoWorker');
    if (storedWorker) {
      setWorker(JSON.parse(storedWorker));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Try to connect to backend API first
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Check if user has worker role
        if (data.user && (data.user.role === 'worker' || data.user.role === 'staff')) {
          const workerData = {
            id: data.user.id,
            name: `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || data.user.email,
            email: data.user.email,
          };
          
          // Store the JWT token for API requests
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          
          setWorker(workerData);
          setIsAuthenticated(true);
          localStorage.setItem('ecoWorker', JSON.stringify(workerData));
          return true;
        } else {
          console.warn('User does not have worker role');
          return false;
        }
      } else {
        console.warn('Backend login failed, trying mock data');
      }
    } catch (error) {
      console.warn('Backend unavailable, using mock authentication:', error);
    }

    // Fallback to mock data if backend is unavailable
    return new Promise(resolve => {
      setTimeout(() => {
        const foundWorker = MOCK_WORKERS.find(w => w.email === email && w.password === password);
        if (foundWorker) {
          // Omit password before storing
          const {
            password,
            ...workerData
          } = foundWorker;
          setWorker(workerData);
          setIsAuthenticated(true);
          localStorage.setItem('ecoWorker', JSON.stringify(workerData));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setWorker(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ecoWorker');
    localStorage.removeItem('token');
  };

  return <AuthContext.Provider value={{
    worker,
    login,
    logout,
    isAuthenticated
  }}>
      {children}
    </AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};