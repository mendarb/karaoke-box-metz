import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export const CalendarHeader = () => {
  return (
    <div className="mb-4 text-center space-y-2">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
        Choisissez votre date
      </h2>
      <p className="text-sm text-gray-600">
        Les dates disponibles sont affichées en noir
      </p>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <Info className="h-4 w-4" />
              <span>-20% les mercredis et jeudis avant 18h</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Profitez d'une réduction de 20% en réservant le mercredi ou jeudi avant 18h</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};