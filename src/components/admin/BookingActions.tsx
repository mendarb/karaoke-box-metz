import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface BookingActionsProps {
  bookingId: string;
  onStatusChange: (bookingId: string, newStatus: string) => Promise<void>;
}

export const BookingActions = ({ bookingId, onStatusChange }: BookingActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (status: string) => {
    try {
      setIsLoading(true);
      await onStatusChange(bookingId, status);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0"
          disabled={isLoading}
        >
          <span className="sr-only">Menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem 
          onClick={() => handleStatusChange('confirmed')}
          className="cursor-pointer"
          disabled={isLoading}
        >
          Confirmer
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusChange('cancelled')}
          className="cursor-pointer text-red-600 focus:text-red-600"
          disabled={isLoading}
        >
          Annuler
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};