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
import { useToast } from "@/components/ui/use-toast";

interface BookingActionsProps {
  bookingId: string;
}

export const BookingActions = ({ bookingId }: BookingActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { updateStatus, isLoading } = useBookingMutations();
  const { toast } = useToast();

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus(bookingId, status);
      setIsOpen(false);
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la réservation a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Erreur action:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
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