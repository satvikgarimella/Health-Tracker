
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditHealthDataDialogProps {
  initialData: {
    steps: number;
    heart_rate: number;
    active_minutes: number;
    sleep_hours: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    steps: number;
    heart_rate: number;
    active_minutes: number;
    sleep_hours: number;
  }) => void;
}

const EditHealthDataDialog = ({
  initialData,
  open,
  onOpenChange,
  onSave,
}: EditHealthDataDialogProps) => {
  const [formData, setFormData] = useState({
    steps: initialData.steps,
    heart_rate: initialData.heart_rate,
    active_minutes: initialData.active_minutes,
    sleep_hours: initialData.sleep_hours,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Health Data</DialogTitle>
          <DialogDescription>
            Update your health metrics for today. These changes will be reflected on your dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="steps" className="text-right">
                Steps
              </Label>
              <Input
                id="steps"
                name="steps"
                type="number"
                value={formData.steps}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="heart_rate" className="text-right">
                Heart Rate
              </Label>
              <Input
                id="heart_rate"
                name="heart_rate"
                type="number"
                value={formData.heart_rate}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active_minutes" className="text-right">
                Active Minutes
              </Label>
              <Input
                id="active_minutes"
                name="active_minutes"
                type="number"
                value={formData.active_minutes}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sleep_hours" className="text-right">
                Sleep Hours
              </Label>
              <Input
                id="sleep_hours"
                name="sleep_hours"
                type="number"
                step="0.1"
                value={formData.sleep_hours}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHealthDataDialog;
