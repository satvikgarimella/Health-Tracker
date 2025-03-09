
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash, Dumbbell } from "lucide-react";
import WorkoutDialog, { Workout } from "./WorkoutDialog";
import { cn } from "@/lib/utils";

interface WorkoutListProps {
  workouts: Workout[];
  onAddWorkout: (workout: Omit<Workout, "id">) => void;
  onEditWorkout: (id: string, workout: Omit<Workout, "id">) => void;
  onDeleteWorkout: (id: string) => void;
  className?: string;
}

const WorkoutList = ({ workouts, onAddWorkout, onEditWorkout, onDeleteWorkout, className }: WorkoutListProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editWorkout, setEditWorkout] = useState<Workout | null>(null);

  const handleEdit = (workout: Workout) => {
    setEditWorkout(workout);
  };

  const handleEditSave = (data: Omit<Workout, "id">) => {
    if (editWorkout) {
      onEditWorkout(editWorkout.id, data);
      setEditWorkout(null);
    }
  };

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case "cardio":
        return "bg-red-100 text-red-800";
      case "strength":
        return "bg-blue-100 text-blue-800";
      case "flexibility":
        return "bg-purple-100 text-purple-800";
      case "sport":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className={cn("p-6 backdrop-blur-sm bg-white/80 border border-white/20 shadow-lg animate-fade-in", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-health-navy flex items-center gap-2">
          <Dumbbell className="w-5 h-5" />
          Workouts
        </h3>
        <Button
          size="sm"
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Workout
        </Button>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No workouts yet. Add your first workout!
        </div>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="p-3 rounded-md border border-gray-100 bg-white flex justify-between items-start"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{workout.name}</h4>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", getWorkoutTypeColor(workout.type))}>
                    {workout.type}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(workout.date).toLocaleDateString()} • {workout.duration} min • {workout.caloriesBurned} cal
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(workout)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteWorkout(workout.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <WorkoutDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={onAddWorkout}
      />

      {editWorkout && (
        <WorkoutDialog
          initialData={editWorkout}
          open={Boolean(editWorkout)}
          onOpenChange={(open) => !open && setEditWorkout(null)}
          onSave={handleEditSave}
        />
      )}
    </Card>
  );
};

export default WorkoutList;
