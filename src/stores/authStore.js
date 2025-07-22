import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useAuthStore = create()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: false,
        isAuthenticated: false,

        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: !!user,
            },
            false,
            'setUser'
          ),

        setLoading: (loading) =>
          set(
            {
              isLoading: loading,
            },
            false,
            'setLoading'
          ),

        login: (user) =>
          set(
            {
              user,
              isAuthenticated: true,
              isLoading: false,
            },
            false,
            'login'
          ),

        logout: () =>
          set(
            {
              user: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            'logout'
          ),

        updateUser: (userData) => {
          const currentUser = get().user;
          if (currentUser) {
            set(
              {
                user: { ...currentUser, ...userData },
              },
              false,
              'updateUser'
            );
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);
