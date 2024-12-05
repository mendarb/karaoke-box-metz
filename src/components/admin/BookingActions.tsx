import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface BookingActionsProps {
  bookingId: string;
  onStatusChange: (bookingId: string, newStatus: string) => Promise<void>;
}

export const BookingActions = ({ bookingId, onStatusChange }: BookingActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem 
          onClick={() => onStatusChange(bookingId, 'confirmed')}
          className="cursor-pointer"
        >
          Confirmer
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onStatusChange(bookingId, 'cancelled')}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          Annuler
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};