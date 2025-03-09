
import { useState, useEffect } from 'react';
import { isOffline } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface User {
  id: string;
  email: string;
}

interface HealthData {
  id: string;
  user_id: string;
  steps: number;
  heart_rate: number;
  active_minutes: number;
  sleep_hours: number;
  created_at: string;
  activity_history?: { name: string; value: number }[];
}

export interface Workout {
  id: string;
  name: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  date: string;
}

export interface Milestone {
  title: string;
  achieved: boolean;
}

// Sample data for offline mode or when API fails
const FALLBACK_DATA: HealthData = {
  id: 'local-fallback',
  user_id: 'local-user',
  steps: 8543,
  heart_rate: 72,
  active_minutes: 45,
  sleep_hours: 7.5,
  created_at: new Date().toISOString(),
  activity_history: [
    { name: '2023-01-01', value: 35 },
    { name: '2023-01-02', value: 42 },
    { name: '2023-01-03', value: 28 },
    { name: '2023-01-04', value: 55 },
    { name: '2023-01-05', value: 65 },
    { name: '2023-01-06', value: 38 },
    { name: '2023-01-07', value: 45 },
  ]
};

// Sample workouts data
const SAMPLE_WORKOUTS: Workout[] = [
  {
    id: 'workout-1',
    name: 'Morning Run',
    type: 'cardio',
    duration: 30,
    caloriesBurned: 320,
    date: '2023-01-05'
  },
  {
    id: 'workout-2',
    name: 'Weight Training',
    type: 'strength',
    duration: 45,
    caloriesBurned: 280,
    date: '2023-01-06'
  }
];

// Default milestones
const DEFAULT_MILESTONES: Milestone[] = [
  { title: "First Steps", achieved: false },
  { title: "Active Achiever", achieved: false },
  { title: "Sleep Master", achieved: false },
  { title: "Heart Health Hero", achieved: false },
];

export const useHealthData = () => {
  const queryClient = useQueryClient();
  const [offlineMode, setOfflineMode] = useState(isOffline());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => setOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load workouts from localStorage
  useEffect(() => {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      try {
        setWorkouts(JSON.parse(storedWorkouts));
      } catch (error) {
        console.error('Error parsing workouts data:', error);
        setWorkouts(SAMPLE_WORKOUTS);
      }
    } else {
      setWorkouts(SAMPLE_WORKOUTS);
      localStorage.setItem('workouts', JSON.stringify(SAMPLE_WORKOUTS));
    }
    
    // Load milestones
    const storedMilestones = localStorage.getItem('milestones');
    if (storedMilestones) {
      try {
        setMilestones(JSON.parse(storedMilestones));
      } catch (error) {
        console.error('Error parsing milestones data:', error);
        setMilestones(DEFAULT_MILESTONES);
      }
    } else {
      setMilestones(DEFAULT_MILESTONES);
      localStorage.setItem('milestones', JSON.stringify(DEFAULT_MILESTONES));
    }
  }, []);

  const fetchTodayData = async (): Promise<HealthData> => {
    // Always return local data since we're not using Supabase anymore
    console.log('Using local data in offline mode');
    
    // Try to get cached data first
    const cachedData = localStorage.getItem('health_data');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        return {
          ...parsed,
          activity_history: FALLBACK_DATA.activity_history
        };
      } catch (error) {
        console.error('Error parsing cached health data:', error);
      }
    }
    
    return FALLBACK_DATA;
  };

  const exportHealthData = async () => {
    try {
      // Get the data from localStorage or use fallback
      const cachedData = localStorage.getItem('health_data');
      const dataToExport = cachedData ? JSON.parse(cachedData) : FALLBACK_DATA;
      
      // Also export workouts
      const workoutsData = localStorage.getItem('workouts');
      const workoutsToExport = workoutsData ? JSON.parse(workoutsData) : [];
      
      // Create combined export data
      const exportData = {
        healthData: dataToExport,
        workouts: workoutsToExport
      };
      
      // Convert to JSON
      const jsonData = JSON.stringify(exportData, null, 2);
      
      // Create a Blob and download
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'health-data-export.json');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Exception in exportHealthData:', error);
      throw error;
    }
  };

  // Use React Query with fallback for errors
  const { data: healthData, isLoading, error } = useQuery({
    queryKey: ['healthData'],
    queryFn: fetchTodayData,
    retry: 2,
    retryDelay: 1000,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
  });

  const updateHealthData = async (updates: Partial<HealthData>) => {
    try {
      // Get current data
      const currentData = await fetchTodayData();
      
      // Create updated data
      const updatedData = { 
        ...currentData, 
        ...updates,
        created_at: new Date().toISOString()
      };
      
      // Store in localStorage
      localStorage.setItem('health_data', JSON.stringify(updatedData));
      
      // Update React Query cache
      await queryClient.setQueryData(['healthData'], updatedData);
      
      // Check for milestones
      checkMilestones(updatedData);
      
      return updatedData;
    } catch (error) {
      console.error('Exception in updateHealthData:', error);
      
      // Use local fallback on error
      const updatedData = { ...FALLBACK_DATA, ...updates };
      await queryClient.setQueryData(['healthData'], updatedData);
      
      return updatedData;
    }
  };

  // Check for milestones
  const checkMilestones = (data: any) => {
    const newMilestones = [...milestones];
    let changed = false;
    
    if (data?.steps > 0 && !newMilestones[0].achieved) {
      newMilestones[0].achieved = true;
      changed = true;
    }
    
    if (data?.active_minutes >= 30 && !newMilestones[1].achieved) {
      newMilestones[1].achieved = true;
      changed = true;
    }
    
    if (data?.sleep_hours >= 7 && !newMilestones[2].achieved) {
      newMilestones[2].achieved = true;
      changed = true;
    }
    
    if (data?.heart_rate >= 60 && data?.heart_rate <= 100 && !newMilestones[3].achieved) {
      newMilestones[3].achieved = true;
      changed = true;
    }
    
    if (changed) {
      setMilestones(newMilestones);
      localStorage.setItem('milestones', JSON.stringify(newMilestones));
    }
  };

  // Workout functions
  const addWorkout = (workout: Omit<Workout, "id">) => {
    const newWorkout: Workout = {
      ...workout,
      id: `workout-${Date.now()}`
    };
    
    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    
    // Also update active minutes based on workout
    updateHealthData({ 
      active_minutes: (healthData?.active_minutes || 0) + workout.duration 
    });
    
    return newWorkout;
  };

  const editWorkout = (id: string, updatedWorkout: Omit<Workout, "id">) => {
    const oldWorkout = workouts.find(w => w.id === id);
    const newWorkouts = workouts.map(workout => 
      workout.id === id ? { ...updatedWorkout, id } : workout
    );
    
    setWorkouts(newWorkouts);
    localStorage.setItem('workouts', JSON.stringify(newWorkouts));
    
    // Adjust active minutes if duration changed
    if (oldWorkout && oldWorkout.duration !== updatedWorkout.duration) {
      const minutesDiff = updatedWorkout.duration - oldWorkout.duration;
      updateHealthData({ 
        active_minutes: Math.max(0, (healthData?.active_minutes || 0) + minutesDiff)
      });
    }
    
    return newWorkouts;
  };

  const deleteWorkout = (id: string) => {
    const workoutToDelete = workouts.find(w => w.id === id);
    const newWorkouts = workouts.filter(workout => workout.id !== id);
    
    setWorkouts(newWorkouts);
    localStorage.setItem('workouts', JSON.stringify(newWorkouts));
    
    // Adjust active minutes if workout is deleted
    if (workoutToDelete) {
      updateHealthData({ 
        active_minutes: Math.max(0, (healthData?.active_minutes || 0) - workoutToDelete.duration)
      });
    }
    
    return newWorkouts;
  };

  return {
    healthData: healthData || FALLBACK_DATA,
    isLoading,
    error,
    updateHealthData,
    exportHealthData,
    isOffline: offlineMode,
    workouts,
    addWorkout,
    editWorkout,
    deleteWorkout,
    milestones
  };
};
