import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { BookingStatus } from "@/integrations/supabase/types/booking";

interface BookingActionsMenuProps {
  isOpen: boolean;
  isLoading: boolean;
  currentStatus: BookingStatus;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: BookingStatus) => void;
  onDelete: () => void;
}

export const BookingActionsMenu = ({
  isOpen,
  isLoading,
  currentStatus,
  onOpenChange,
  onStatusChange,
  onDelete,
}: BookingActionsMenuProps) => {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={() => onStatusChange('confirmed')}
            className="cursor-pointer"
            disabled={isLoading}
          >
            Confirmer
          </DropdownMenuItem>
        )}
        {currentStatus !== 'cancelled' && (
          <DropdownMenuItem 
            onClick={() => onStatusChange('cancelled')}
            className="cursor-pointer text-red-600 focus:text-red-600"
            disabled={isLoading}
          >
            Annuler
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={onDelete}
          className="cursor-pointer text-red-600 focus:text-red-600"
          disabled={isLoading}
        >
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};