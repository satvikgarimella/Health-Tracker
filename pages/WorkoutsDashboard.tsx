
import { useState } from "react";
import { Dumbbell, Clock, Download, Edit, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useHealthData } from "@/hooks/useHealthData";
import MainNavbar from "@/components/MainNavbar";
import WorkoutList from "@/components/WorkoutList";

const WorkoutsDashboard = () => {
  const { toast } = useToast();
  const { 
    workouts,
    addWorkout,
    editWorkout,
    deleteWorkout,
    exportHealthData,
  } = useHealthData();

  const user = JSON.parse(localStorage.getItem('health_user') || 'null');

  const handleLogout = () => {
    try {
      localStorage.removeItem('health_user');
      window.location.href = '/';
      toast({
        title: "Signed out",
        description: "You've been signed out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleExport = async () => {
    try {
      await exportHealthData();
      toast({
        title: "Data exported",
        description: "Your health data has been downloaded as a CSV file.",
      });
    } catch (error) {
      toast({
        title: "Error exporting data",
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
    window.location.href = '/';
    return null;
  }

  // Calculate stats
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce((total, workout) => total + workout.duration, 0);
  const totalCalories = workouts.reduce((total, workout) => total + workout.caloriesBurned, 0);
  
  // Get workout types breakdown
  const workoutTypes = workouts.reduce((acc: Record<string, number>, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl-50 to-gray-50">
      <MainNavbar user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="flex justify-between items-center animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold text-health-navy">Workouts Dashboard</h1>
            <p className="text-health-gray">Manage and track your workouts</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Dumbbell className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Workouts</p>
              <p className="text-2xl font-bold text-health-navy">{totalWorkouts}</p>
            </div>
          </div>
          
          <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Time</p>
              <p className="text-2xl font-bold text-health-navy">{totalDuration} minutes</p>
            </div>
          </div>
          
          <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20 flex items-center">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Calories Burned</p>
              <p className="text-2xl font-bold text-health-navy">{totalCalories}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <WorkoutList
              workouts={workouts}
              onAddWorkout={handleAddWorkout}
              onEditWorkout={handleEditWorkout}
              onDeleteWorkout={handleDeleteWorkout}
            />
          </div>
          
          <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-medium mb-4">Workout Types</h3>
            <div className="space-y-4">
              {Object.entries(workoutTypes).map(([type, count]) => (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm capitalize">{type}</span>
                    <span className="text-sm font-medium">{count} workouts</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${type === 'cardio' ? 'bg-red-400' : 
                                  type === 'strength' ? 'bg-blue-400' : 
                                  type === 'yoga' ? 'bg-green-400' : 
                                  'bg-purple-400'} h-2 rounded-full`}
                      style={{ width: `${(count / totalWorkouts) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              
              {Object.keys(workoutTypes).length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  No workout data available yet.
                </p>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Workout Suggestions</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>High-intensity interval training (HIIT) - Burns calories efficiently</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Strength training - Builds muscle and increases metabolism</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Yoga - Improves flexibility and reduces stress</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Swimming - Low-impact full-body workout</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutsDashboard;
