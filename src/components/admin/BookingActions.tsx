import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";
import { Booking } from "@/hooks/useBookings";
import { useToast } from "@/components/ui/use-toast";

interface BookingActionsProps {
  bookingId: string;
  onStatusChange: (bookingId: string, newStatus: string) => Promise<Booking>;
}

export const BookingActions = ({ bookingId, onStatusChange }: BookingActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (status: string) => {
    console.log('Tentative de changement de statut pour la réservation:', bookingId, 'vers:', status);
    setIsLoading(true);
    try {
      const updatedBooking = await onStatusChange(bookingId, status);
      if (!updatedBooking) {
        throw new Error("La réservation n'a pas pu être mise à jour");
      }
      console.log('Réservation mise à jour avec succès:', updatedBooking);
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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