
import { Activity, Heart, Footprints, Moon, Download, Trophy, WifiOff, Edit, Dumbbell, Plus, BarChart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isOffline, checkConnection } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import HealthStatCard from "@/components/HealthStatCard";
import ActivityChart from "@/components/ActivityChart";
import { Button } from "@/components/ui/button";
import { useHealthData } from "@/hooks/useHealthData";
import EditHealthDataDialog from "@/components/EditHealthDataDialog";
import WorkoutList from "@/components/WorkoutList";
import MainNavbar from "@/components/MainNavbar";
import { getTimeBasedGreeting } from "@/utils/timeGreeting";

interface User {
  id: string;
  email: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [connectionAvailable, setConnectionAvailable] = useState(!isOffline());
  const { toast } = useToast();
  const { 
    healthData, 
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
  } = useHealthData();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const greeting = getTimeBasedGreeting();

  useEffect(() => {
    const checkNetworkConnection = async () => {
      const isConnected = await checkConnection();
      setConnectionAvailable(isConnected);
      
      if (!isConnected && !isOffline()) {
        toast({
          title: "Connection Issue",
          description: "Could not connect to the network. Using offline mode.",
          variant: "destructive",
        });
      }
    };
    
    checkNetworkConnection();
    
    const handleOnline = () => {
      setConnectionAvailable(true);
      checkNetworkConnection();
    };
    
    const handleOffline = () => {
      setConnectionAvailable(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const createSampleHealthData = async () => {
    try {
      const sampleData = {
        steps: Math.floor(Math.random() * 5000) + 3000,
        heart_rate: Math.floor(Math.random() * 30) + 60,
        active_minutes: Math.floor(Math.random() * 60) + 30,
        sleep_hours: Math.floor(Math.random() * 4) + 5,
      };

      await updateHealthData(sampleData);
      
      toast({
        title: "Health data updated",
        description: "Your health metrics have been updated!",
      });
    } catch (error) {
      toast({
        title: "Error updating health data",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const checkLocalSession = () => {
      try {
        const savedUser = localStorage.getItem('health_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          createSampleHealthData();
        }
      } catch (error) {
        console.error("Error checking local session:", error);
      }
    };
    
    checkLocalSession();
  }, []);

  const handleTestUserLogin = async () => {
    try {
      const testUser = { 
        id: 'test-user-id', 
        email: 'test@example.com' 
      };
      
      localStorage.setItem('health_user', JSON.stringify(testUser));
      
      setUser(testUser);
      
      toast({
        title: "Signed in",
        description: "You've been signed in as a test user",
      });
      
      await createSampleHealthData();
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "Could not sign in. Using offline mode.",
        variant: "destructive",
      });
      
      const offlineUser = { id: 'offline-user', email: 'offline@example.com' };
      setUser(offlineUser);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('health_user');
      
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You've been signed out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
    }
  };

  const handleExport = async () => {
    try {
      await exportHealthData();
      toast({
        title: "Data exported",
        description: "Your health data has been downloaded as a JSON file.",
      });
    } catch (error) {
      toast({
        title: "Error exporting data",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleEditStats = () => {
    setIsEditDialogOpen(true);
  };

  const handleSaveStats = async (data: any) => {
    try {
      await updateHealthData(data);
      toast({
        title: "Health data updated",
        description: "Your health metrics have been updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error updating health data",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAddWorkout = (workoutData: any) => {
    try {
      addWorkout(workoutData);
      toast({
        title: "Workout added",
        description: "Your workout has been added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error adding workout",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleEditWorkout = (id: string, workoutData: any) => {
    try {
      editWorkout(id, workoutData);
      toast({
        title: "Workout updated",
        description: "Your workout has been updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error updating workout",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorkout = (id: string) => {
    try {
      deleteWorkout(id);
      toast({
        title: "Workout deleted",
        description: "Your workout has been deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error deleting workout",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pearl-50 to-gray-50 p-6 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-semibold text-health-navy">Health Dashboard</h1>
          <p className="text-health-gray">Sign in to start tracking your health metrics</p>
          <div className="space-y-4">
            <Button 
              onClick={handleTestUserLogin} 
              className="bg-health-mint hover:bg-health-mint/90 w-full"
              disabled={isOffline() && !connectionAvailable}
            >
              Sign in as Test User
            </Button>
            {(offlineMode || !connectionAvailable) && (
              <div className="flex items-center justify-center gap-2 text-amber-600 mt-2">
                <WifiOff className="w-4 h-4" />
                <span>You're offline. Sign in to use sample data.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl-50 to-gray-50">
      <MainNavbar user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="flex justify-between items-center animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold text-health-navy">Overview Dashboard</h1>
            <p className="text-health-gray">{greeting}, {user.email.split('@')[0]}</p>
            {offlineMode && (
              <div className="flex items-center gap-2 text-amber-600">
                <WifiOff className="w-4 h-4" />
                <span>Offline Mode - Using sample data</span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleEditStats}
            >
              <Edit className="w-4 h-4" />
              Edit Stats
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/fitness" className="block hover:scale-[1.02] transition-transform">
            <HealthStatCard
              title="Daily Steps"
              value={healthData?.steps ?? "0"}
              subtitle="Goal: 10,000"
              icon={<Footprints />}
            />
          </Link>
          <Link to="/health" className="block hover:scale-[1.02] transition-transform">
            <HealthStatCard
              title="Heart Rate"
              value={`${healthData?.heart_rate ?? "0"} bpm`}
              subtitle="Resting"
              icon={<Heart />}
            />
          </Link>
          <Link to="/fitness" className="block hover:scale-[1.02] transition-transform">
            <HealthStatCard
              title="Activity"
              value={`${healthData?.active_minutes ?? "0"} min`}
              subtitle="Active time today"
              icon={<Activity />}
            />
          </Link>
          <Link to="/sleep" className="block hover:scale-[1.02] transition-transform">
            <HealthStatCard
              title="Sleep"
              value={`${healthData?.sleep_hours ?? "0"}h`}
              subtitle="Last night"
              icon={<Moon />}
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Link to="/workouts" className="block hover:scale-[1.01] transition-transform">
            <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-health-navy flex items-center">
                  <Dumbbell className="mr-2 h-5 w-5 text-health-mint" />
                  Recent Workouts
                </h2>
                <Button variant="ghost" size="sm" className="text-health-mint">
                  <BarChart className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {workouts.slice(0, 3).map((workout) => (
                  <div key={workout.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-sm text-gray-500">
                        {workout.duration} min • {workout.caloriesBurned} cal
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
                      {workout.type}
                    </span>
                  </div>
                ))}
                {workouts.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No workouts yet</p>
                )}
              </div>
            </div>
          </Link>
          
          <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    milestone.achieved
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={milestone.achieved ? "text-green-700" : "text-gray-500"}>
                      {milestone.title}
                    </span>
                    {milestone.achieved && (
                      <Trophy className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20">
            <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
            <ActivityChart
              data={healthData?.activity_history ?? []}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/fitness" className="block">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                <Activity className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-blue-800">Fitness Dashboard</h3>
                <p className="text-sm text-blue-600 mt-2">Track your steps and activity</p>
              </div>
            </Link>
            <Link to="/health" className="block">
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200 hover:shadow-md transition-shadow">
                <Heart className="h-10 w-10 text-red-600 mb-4" />
                <h3 className="font-semibold text-red-800">Health Dashboard</h3>
                <p className="text-sm text-red-600 mt-2">Monitor your heart rate and vitals</p>
              </div>
            </Link>
            <Link to="/sleep" className="block">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                <Moon className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-indigo-800">Sleep Dashboard</h3>
                <p className="text-sm text-indigo-600 mt-2">Analyze your sleep patterns</p>
              </div>
            </Link>
            <Link to="/workouts" className="block">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                <Dumbbell className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-purple-800">Workouts Dashboard</h3>
                <p className="text-sm text-purple-600 mt-2">Manage your exercise routine</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <EditHealthDataDialog
        initialData={{
          steps: healthData?.steps || 0,
          heart_rate: healthData?.heart_rate || 0,
          active_minutes: healthData?.active_minutes || 0,
          sleep_hours: healthData?.sleep_hours || 0,
        }}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveStats}
      />
    </div>
  );
};

export default Index;
