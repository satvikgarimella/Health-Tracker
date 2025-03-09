
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HealthStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

const HealthStatCard = ({ title, value, subtitle, icon, className }: HealthStatCardProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden backdrop-blur-sm bg-white/80 border border-white/20 shadow-lg p-6 transition-all duration-300 hover:translate-y-[-2px] animate-fade-in",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-health-gray">{title}</p>
          <p className="text-2xl font-semibold text-health-navy">{value}</p>
          {subtitle && (
            <p className="text-sm text-health-gray/80">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-health-mint text-xl">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default HealthStatCard;
