
import { useState } from "react";
import { Heart, Activity, Edit, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import HealthStatCard from "@/components/HealthStatCard";
import ActivityChart from "@/components/ActivityChart";
import { Button } from "@/components/ui/button";
import { useHealthData } from "@/hooks/useHealthData";
import EditHealthDataDialog from "@/components/EditHealthDataDialog";
import MainNavbar from "@/components/MainNavbar";

const HealthDashboard = () => {
  const { toast } = useToast();
  const { 
    healthData, 
    isLoading, 
    error, 
    updateHealthData, 
    exportHealthData, 
    isOffline: offlineMode,
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
            <h1 className="text-4xl font-semibold text-health-navy">Health Dashboard</h1>
            <p className="text-health-gray">Monitor your vital health metrics</p>
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
            <div className="grid grid-cols-1 gap-6">
              <HealthStatCard
                title="Heart Rate"
                value={`${healthData?.heart_rate ?? "0"} bpm`}
                subtitle="Resting"
                icon={<Heart />}
                className="bg-white/90"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20">
                  <h3 className="text-lg font-medium mb-4">Heart Rate Zones</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Rest (40-60 bpm)</span>
                        <span className="text-sm font-medium">
                          {healthData?.heart_rate >= 40 && healthData?.heart_rate <= 60 ? 'Current' : ''}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-300 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(0, ((healthData?.heart_rate - 40) / 20) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Light (60-100 bpm)</span>
                        <span className="text-sm font-medium">
                          {healthData?.heart_rate > 60 && healthData?.heart_rate <= 100 ? 'Current' : ''}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-300 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(0, ((healthData?.heart_rate - 60) / 40) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Moderate (100-140 bpm)</span>
                        <span className="text-sm font-medium">
                          {healthData?.heart_rate > 100 && healthData?.heart_rate <= 140 ? 'Current' : ''}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-300 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(0, ((healthData?.heart_rate - 100) / 40) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Intense (140-180 bpm)</span>
                        <span className="text-sm font-medium">
                          {healthData?.heart_rate > 140 && healthData?.heart_rate <= 180 ? 'Current' : ''}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-300 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(0, ((healthData?.heart_rate - 140) / 40) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20">
                  <h3 className="text-lg font-medium mb-4">Heart Health</h3>
                  <div className="flex items-center justify-center h-[150px]">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eee"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={healthData?.heart_rate < 60 ? "#3b82f6" : 
                                   healthData?.heart_rate < 100 ? "#10b981" : 
                                   healthData?.heart_rate < 140 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="3"
                          strokeDasharray={`${(healthData?.heart_rate / 200) * 100}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{healthData?.heart_rate}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm mt-4">
                    {healthData?.heart_rate < 60 ? "Below average resting heart rate" : 
                     healthData?.heart_rate < 100 ? "Healthy resting heart rate" : 
                     healthData?.heart_rate < 140 ? "Elevated heart rate" : "High heart rate"}
                  </p>
                </div>
                
                <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20">
                  <h3 className="text-lg font-medium mb-4">Tips for Heart Health</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Regular physical activity improves heart health</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Maintain a balanced diet low in sodium and saturated fats</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Manage stress through meditation or relaxation techniques</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Avoid smoking and limit alcohol consumption</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Get adequate sleep (7-8 hours) each night</span>
                    </li>
                  </ul>
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

export default HealthDashboard;
