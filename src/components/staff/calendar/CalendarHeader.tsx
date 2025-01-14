import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, LogOut } from "lucide-react";

interface CalendarHeaderProps {
  onLogout: () => void;
}

export const CalendarHeader = ({ onLogout }: CalendarHeaderProps) => {
  return (
    <div className="p-4 space-y-3 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-violet-500/10 p-2 rounded-full">
            <CalendarIcon className="h-5 w-5 text-violet-500" />
          </div>
          <CardTitle className="text-lg">Planning des réservations</CardTitle>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onLogout}
          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};