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
    <Card className="p-4 relative group hover:shadow-lg transition-shadow">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            {title}
          </h3>
          <Icon className="h-4 w-4 text-muted-foreground opacity-50" />
        </div>
        <p className="text-2xl font-bold">
          {formattedValue}
        </p>
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
      <div className="absolute inset-0 bg-black/75 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-center">
        <p className="text-sm">{description}</p>
      </div>
    </Card>
  );
};