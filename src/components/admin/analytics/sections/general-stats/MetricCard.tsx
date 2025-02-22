import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  change?: string;
  trend?: "up" | "down";
  isPercentage?: boolean;
}

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  change, 
  trend,
  isPercentage 
}: MetricCardProps) => {
  const formattedValue = isPercentage 
    ? `${typeof value === 'number' ? value.toFixed(1) : value}%`
    : value;

  return (
    <Card className="relative overflow-hidden">
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold mt-2">
              {formattedValue}
            </p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        {change && (
          <div className="flex items-center text-sm">
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={trend === "up" ? "text-green-500" : "text-red-500"}>
              {change}
            </span>
            <span className="text-muted-foreground ml-1">vs période précédente</span>
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 bg-black/75 text-white p-6 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-center">
        <p className="text-sm">{description}</p>
      </div>
    </Card>
  );
};