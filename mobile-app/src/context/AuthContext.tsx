import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase.service';

interface AuthContextType {
  isRegistered: boolean;
  isLoading: boolean;
  handleLogout: () => Promise<void>;
  handleRegistrationComplete: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    checkRegistration();
  }, [forceUpdate]);

  const checkRegistration = async () => {
    try {
      const customerId = await AsyncStorage.getItem('customerId');
      setIsRegistered(!!customerId);
    } catch (error) {
      console.error('Error checking registration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationComplete = async () => {
    try {
      console.log('✅ Registration complete - updating app state');
      setIsRegistered(true);
      setForceUpdate(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error completing registration:', error);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('🔓 Logout initiated at', new Date().toISOString());
      
      // Sign out from Supabase Auth
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('⚠️  Supabase sign out error:', error.message);
      } else {
        console.log('✅ Signed out from Supabase');
      }
      
      // Clear AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      console.log('📦 Clearing keys:', keys);
      await AsyncStorage.clear();
      console.log('✅ AsyncStorage cleared');
      
      // Verify it's cleared
      const remaining = await AsyncStorage.getAllKeys();
      console.log('📦 Remaining keys after clear:', remaining);
      
      // Update state
      setIsRegistered(false);
      setForceUpdate(prev => {
        const newValue = prev + 1;
        console.log('🔄 Force update:', prev, '→', newValue);
        return newValue;
      });
      
      console.log('✅ State reset to logged out');
      
      // Force a small delay to ensure state updates
      setTimeout(() => {
        console.log('✅ Logout complete');
      }, 100);
    } catch (error) {
      console.error('❌ Error during logout:', error);
      console.error('Stack:', error);
    }
  };

  const value: AuthContextType = {
    isRegistered,
    isLoading,
    handleLogout,
    handleRegistrationComplete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

