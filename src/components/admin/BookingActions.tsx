import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";
import { useBookingMutations } from "@/hooks/useBookingMutations";

interface BookingActionsProps {
  bookingId: string;
  currentStatus: string;
}

export const BookingActions = ({ bookingId, currentStatus }: BookingActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { updateStatus, isLoading } = useBookingMutations();

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus(bookingId, newStatus);
      setIsOpen(false);
    } catch (error) {
      console.error('Action error:', error);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0"
          disabled={isLoading}
        >
          <span className="sr-only">Menu</span>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {currentStatus !== 'confirmed' && (
          <DropdownMenuItem 
            onClick={() => handleStatusChange('confirmed')}
            className="cursor-pointer"
            disabled={isLoading}
          >
            Confirmer
          </DropdownMenuItem>
        )}
        {currentStatus !== 'cancelled' && (
          <DropdownMenuItem 
            onClick={() => handleStatusChange('cancelled')}
            className="cursor-pointer text-red-600 focus:text-red-600"
            disabled={isLoading}
          >
            Annuler
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};