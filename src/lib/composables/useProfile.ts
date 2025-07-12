import { createSignal, createEffect, onCleanup } from "solid-js";

interface ProfileData {
  displayName?: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UseProfileOptions {
  autoFetch?: boolean;
  refetchInterval?: number;
}

function useProfile(options: UseProfileOptions = {}) {
  const { autoFetch = true, refetchInterval } = options;
  
  const [profile, setProfile] = createSignal<ProfileData | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [isRefetching, setIsRefetching] = createSignal(false);

  let intervalId: ReturnType<typeof setInterval> | undefined;

  const fetchProfile = async (isRefetch = false) => {
    try {
      if (isRefetch) {
        setIsRefetching(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      const response = await fetch(`/api/user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      
      const data = await response.json();
      setProfile(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
      setIsRefetching(false);
    }
  };

  const refetch = () => fetchProfile(true);

  const updateProfile = async (updates: Partial<ProfileData>) => {
    try {
      setIsRefetching(true);
      setError(null);
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }
      
      const updatedData = await response.json();
      setProfile(updatedData);
      
      return updatedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setIsRefetching(false);
    }
  };

  const clearProfile = () => {
    setProfile(null);
    setError(null);
    setLoading(false);
  };

  // Auto-fetch on mount
  createEffect(() => {
    if (autoFetch) {
      console.log("🔍 Fetching user profile on mount...");
      fetchProfile();
    }
  });

  // Setup auto-refetch interval
  createEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      intervalId = setInterval(() => {
        refetch();
      }, refetchInterval);
      
      onCleanup(() => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      });
    }
  });

  // Cleanup on unmount
  onCleanup(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  return { 
    profile, 
    loading, 
    error,
    isRefetching,
    fetchProfile,
    refetch,
    updateProfile,
    clearProfile,
    // Computed values
    get isAuthenticated() {
      return profile() !== null;
    },
    get hasError() {
      return error() !== null;
    }
  };
}

export default useProfile;