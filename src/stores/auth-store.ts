import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, phone: string, address: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, role: UserRole = 'customer') => {
        // Simulate network delay for a more realistic prototype feel
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        // Mock user data
        const mockUser: User = {
          id: crypto.randomUUID(),
          name: email.split('@')[0] || 'User', // Derive name from email for simplicity
          email,
          phone: '+966500000000',
          role: role, // Allows testing admin capabilities
          address: '123 Main St, Riyadh',
          createdAt: new Date().toISOString(),
        };

        set({ user: mockUser, isAuthenticated: true });
      },

      register: async (name: string, email: string, phone: string, address: string) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const newUser: User = {
          id: crypto.randomUUID(),
          name,
          email,
          phone,
          role: 'customer',
          address,
          createdAt: new Date().toISOString(),
        };

        set({ user: newUser, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'food-app-auth-storage', // Key used in localStorage
    }
  )
);
