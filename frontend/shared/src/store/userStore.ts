import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '../types/user';
import { setSessionId, removeSessionId } from '../utils/storage';

interface UserStore {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  updateCoins: (delta: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist<UserStore>(
    (set) => ({
      userInfo: null,
      isLoggedIn: false,
      isAdmin: false,

      login: (userInfo: UserInfo) => {
        setSessionId(`session_${userInfo.id}`);
        set({
          userInfo,
          isLoggedIn: true,
          isAdmin: userInfo.role === 'ADMIN',
        });
      },

      logout: () => {
        removeSessionId();
        set({ userInfo: null, isLoggedIn: false, isAdmin: false });
      },

      updateCoins: (delta: number) =>
        set((state) => ({
          userInfo: state.userInfo
            ? { ...state.userInfo, coins: Math.max(0, state.userInfo.coins + delta) }
            : null,
        })),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        userInfo: state.userInfo,
        isLoggedIn: state.isLoggedIn,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
