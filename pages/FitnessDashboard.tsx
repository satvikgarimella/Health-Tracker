
import { useState } from "react";
import { Activity, Footprints, Edit, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import HealthStatCard from "@/components/HealthStatCard";
import ActivityChart from "@/components/ActivityChart";
import { Button } from "@/components/ui/button";
import { useHealthData } from "@/hooks/useHealthData";
import EditHealthDataDialog from "@/components/EditHealthDataDialog";
import MainNavbar from "@/components/MainNavbar";

const FitnessDashboard = () => {
  const { toast } = useToast();
  const { 
    healthData, 
    isLoading, 
    error, 
    updateHealthData, 
    exportHealthData, 
    isOffline: offlineMode,
    milestones,
  } = useHealthData();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  if (!user) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl-50 to-gray-50">
      <MainNavbar user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="flex justify-between items-center animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold text-health-navy">Fitness Dashboard</h1>
            <p className="text-health-gray">Track your activity and steps</p>
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

        {isLoading ? (
          <div className="text-center py-12">Loading your health data...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            Error loading health data. Using sample data instead.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HealthStatCard
                title="Daily Steps"
                value={healthData?.steps ?? "0"}
                subtitle="Goal: 10,000"
                icon={<Footprints />}
                className="h-full"
              />
              <HealthStatCard
                title="Activity"
                value={`${healthData?.active_minutes ?? "0"} min`}
                subtitle="Active time today"
                icon={<Activity />}
                className="h-full"
              />
            </div>

            <ActivityChart
              data={healthData?.activity_history ?? []}
              className="mt-6"
            />

            <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20 mt-6">
              <h2 className="text-xl font-semibold mb-4">Daily Activity Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-medium text-gray-800">Walking</h3>
                  <p className="text-2xl font-bold text-health-navy mt-2">
                    {Math.round(healthData?.steps * 0.6)} steps
                  </p>
                  <p className="text-gray-500 text-sm">60% of daily activity</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-medium text-gray-800">Running</h3>
                  <p className="text-2xl font-bold text-health-navy mt-2">
                    {Math.round(healthData?.steps * 0.3)} steps
                  </p>
                  <p className="text-gray-500 text-sm">30% of daily activity</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-medium text-gray-800">Other</h3>
                  <p className="text-2xl font-bold text-health-navy mt-2">
                    {Math.round(healthData?.steps * 0.1)} steps
                  </p>
                  <p className="text-gray-500 text-sm">10% of daily activity</p>
                </div>
              </div>
            </div>
          </>
        )}
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

export default FitnessDashboard;
