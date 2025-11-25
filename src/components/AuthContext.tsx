"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loginUserAction, signupUserAction, logoutUserAction, getCurrentUserAction, loginUserWithPhoneAction } from '@/actions/authActions';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone: string, countryCode: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await getCurrentUserAction();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to check session:', error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginUserAction({}, { email, password });
      
      if (result.error) {
        throw new Error(result.error.message?.[0] || 'Login failed');
      }
      
      if (result.data?.user) {
        setUser(result.data.user);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithPhone = async (phone: string, password: string) => {
    try {
      const result = await loginUserWithPhoneAction({}, { phone, password });
      
      if (result.error) {
        throw new Error(result.error.message?.[0] || 'Login failed');
      }
      
      if (result.data?.user) {
        setUser(result.data.user);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, phone: string, countryCode: string) => {
    try {
      const result = await signupUserAction({}, { name, email, password, phone, countryCode });
      
      if (result.error) {
        throw new Error(result.error.message?.[0] || 'Signup failed');
      }
      
      if (result.data?.user) {
        setUser(result.data.user);
        toast({
          title: "Success",
          description: "Account created successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Signup failed",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUserAction();
      setUser(null);
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Still clear user state even if logout fails
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithPhone,
        signup,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
