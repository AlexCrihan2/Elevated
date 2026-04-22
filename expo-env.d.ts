/// <reference types="expo/types" />

declare module '@/template' {
  export const AuthProvider: React.ComponentType<{ children: React.ReactNode }>;
  export const AlertProvider: React.ComponentType<{ children: React.ReactNode }>;
  export const AuthRouter: React.ComponentType<{
    children: React.ReactNode;
    loginRoute?: string;
    loadingComponent?: React.ComponentType;
    excludeRoutes?: string[];
  }>;
  
  export function useAuth(): {
    sendOTP: (email: string) => Promise<{error: string|null}>;
    verifyOTPAndLogin: (email: string, otp: string, options?: {password?: string}) => Promise<{error: string|null, user: any|null}>;
    signUpWithPassword: (email: string, password: string, metadata?: object) => Promise<{error: string|null, user: any|null, needsEmailConfirmation?: boolean}>;
    signInWithPassword: (email: string, password: string) => Promise<{error: string|null, user: any|null}>;
    logout: () => Promise<{error: string|null}>;
    user: any | null;
    loading: boolean;
    operationLoading: boolean;
  };
  
  export function useAlert(): {
    showAlert: (title: string, message?: string, buttons?: Array<{
      text: string;
      style?: 'default' | 'cancel' | 'destructive';
      onPress?: () => void;
    }>) => void;
  };
  
  export function getSupabaseClient(): any;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';