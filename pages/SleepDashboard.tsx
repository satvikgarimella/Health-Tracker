
import { useState } from "react";
import { Moon, Clock, Edit, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import HealthStatCard from "@/components/HealthStatCard";
import ActivityChart from "@/components/ActivityChart";
import { Button } from "@/components/ui/button";
import { useHealthData } from "@/hooks/useHealthData";
import EditHealthDataDialog from "@/components/EditHealthDataDialog";
import MainNavbar from "@/components/MainNavbar";

const SleepDashboard = () => {
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

  // Calculate sleep quality score (0-100)
  const getSleepQualityScore = () => {
    const hours = healthData?.sleep_hours || 0;
    // Ideal sleep is 7-9 hours
    if (hours >= 7 && hours <= 9) {
      return 90 + ((hours - 7) * 10); // 90-100 for optimal sleep
    } else if (hours >= 6 && hours < 7) {
      return 75 + ((hours - 6) * 15); // 75-90 for slightly less than optimal
    } else if (hours > 9 && hours <= 10) {
      return 75 + ((10 - hours) * 15); // 75-90 for slightly more than optimal
    } else if (hours >= 5 && hours < 6) {
      return 50 + ((hours - 5) * 25); // 50-75 for less than recommended
    } else if (hours > 10 && hours <= 12) {
      return 50 + ((12 - hours) * 12.5); // 50-75 for more than recommended
    } else {
      return Math.max(0, Math.min(50, hours * 10)); // 0-50 for poor sleep
    }
  };

  const sleepQuality = getSleepQualityScore();
  const sleepQualityText = sleepQuality >= 90 ? 'Excellent' 
                        : sleepQuality >= 75 ? 'Good'
                        : sleepQuality >= 50 ? 'Fair'
                        : 'Poor';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl-50 to-gray-50">
      <MainNavbar user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="flex justify-between items-center animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold text-health-navy">Sleep Dashboard</h1>
            <p className="text-health-gray">Monitor your sleep patterns and quality</p>
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
                title="Sleep Duration"
                value={`${healthData?.sleep_hours ?? "0"}h`}
                subtitle="Last night"
                icon={<Moon />}
                className="h-full"
              />
              
              <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                  Sleep Quality
                </h3>
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40">
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
                        stroke={sleepQuality >= 90 ? "#10b981" : 
                                 sleepQuality >= 75 ? "#3b82f6" : 
                                 sleepQuality >= 50 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="3"
                        strokeDasharray={`${sleepQuality}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{Math.round(sleepQuality)}</span>
                      <span className="text-sm">out of 100</span>
                    </div>
                  </div>
                  <p className="text-xl font-semibold mt-4">{sleepQualityText}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-medium mb-4">Sleep Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Deep Sleep</span>
                      <span className="text-sm font-medium">
                        {(healthData?.sleep_hours * 0.2).toFixed(1)}h
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: '20%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Light Sleep</span>
                      <span className="text-sm font-medium">
                        {(healthData?.sleep_hours * 0.5).toFixed(1)}h
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-400 h-2 rounded-full" 
                        style={{ width: '50%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">REM Sleep</span>
                      <span className="text-sm font-medium">
                        {(healthData?.sleep_hours * 0.25).toFixed(1)}h
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-300 h-2 rounded-full" 
                        style={{ width: '25%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Awake</span>
                      <span className="text-sm font-medium">
                        {(healthData?.sleep_hours * 0.05).toFixed(1)}h
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-400 h-2 rounded-full" 
                        style={{ width: '5%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-medium mb-4">Sleep Schedule</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Bedtime</span>
                    <span className="text-sm">10:30 PM</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Wake up</span>
                    <span className="text-sm">6:30 AM</span>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Sleep Consistency</h4>
                    <div className="grid grid-cols-7 gap-1">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div key={i} className="text-center">
                          <div className="text-xs mb-1">{day}</div>
                          <div 
                            className="w-full h-8 rounded-sm" 
                            style={{
                              backgroundColor: i < 5 ? 'rgb(79, 70, 229, 0.7)' : 'rgb(99, 102, 241, 0.4)'
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 rounded-lg p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-medium mb-4">Sleep Tips</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Maintain a consistent sleep schedule</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Aim for 7-9 hours of sleep each night</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Create a restful environment (dark, quiet, cool)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Limit screen time before bed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Avoid caffeine and large meals before bedtime</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Regular physical activity improves sleep quality</span>
                  </li>
                </ul>
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

export default SleepDashboard;
