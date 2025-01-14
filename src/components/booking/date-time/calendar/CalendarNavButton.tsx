import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentProps } from "react";

interface CalendarNavButtonProps {
  direction: "left" | "right";
  onClick?: ComponentProps<"button">["onClick"];
}

export const CalendarNavButton = ({ direction, onClick }: CalendarNavButtonProps) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  
  return (
    <Button 
      variant="outline" 
      size="icon"
      className="h-8 w-8 p-0 border border-gray-200 hover:bg-gray-100 hover:text-gray-900"
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">
        {direction === "left" ? "Mois précédent" : "Mois suivant"}
      </span>
    </Button>
  );
};