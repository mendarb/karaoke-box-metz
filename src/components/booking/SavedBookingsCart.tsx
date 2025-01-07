import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SavedBooking {
  id: string;
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  message?: string;
  is_available?: boolean;
}

export const SavedBookingsCart = () => {
  const [savedBookings, setSavedBookings] = useState<SavedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadSavedBookings = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from("saved_bookings")
        .select("*")
        .is("deleted_at", null);

      if (error) throw error;

      const bookingsWithAvailability = await Promise.all(
        bookings.map(async (booking) => {
          const { data: existingBookings } = await supabase
            .from("bookings")
            .select("*")
            .eq("date", booking.date)
            .eq("time_slot", booking.time_slot)
            .eq("status", "confirmed")
            .is("deleted_at", null);

          return {
            ...booking,
            is_available: !existingBookings?.length,
          };
        })
      );

      setSavedBookings(bookingsWithAvailability);
      
      // Afficher un toast pour guider l'utilisateur s'il y a des réservations sauvegardées
      if (bookingsWithAvailability.length > 0) {
        toast({
          title: "💡 Réservations sauvegardées",
          description: "Cliquez sur 'Continuer la réservation' pour finaliser votre réservation",
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos réservations sauvegardées",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavedBookings();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("saved_bookings")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setSavedBookings((prev) => prev.filter((booking) => booking.id !== id));
      toast({
        title: "Succès",
        description: "Réservation supprimée",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
        variant: "destructive",
      });
    }
  };

  const handleContinueBooking = (booking: SavedBooking) => {
    if (!booking.is_available) {
      toast({
        title: "Créneau indisponible",
        description: "Ce créneau n'est plus disponible",
        variant: "destructive",
      });
      return;
    }

    // Stocker les détails de la réservation dans sessionStorage
    sessionStorage.setItem("savedBooking", JSON.stringify({
      ...booking,
      currentStep: 3 // Force l'étape de paiement
    }));
    navigate("/");
  };

  return (
    <Sheet>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative"
                aria-label="Panier des réservations"
              >
                <ShoppingCart className="h-5 w-5" />
                {savedBookings.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {savedBookings.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vos réservations sauvegardées</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Réservations sauvegardées</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Chargement...</p>
          ) : savedBookings.length === 0 ? (
            <p className="text-center text-gray-500">
              Aucune réservation sauvegardée
            </p>
          ) : (
            savedBookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 space-y-2 relative bg-white shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="font-medium">
                      {format(new Date(booking.date), "EEEE d MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>🕒 {booking.time_slot}h - {parseInt(booking.time_slot) + parseInt(booking.duration)}h ({booking.duration}h)</p>
                      <p>👥 {booking.group_size} personnes</p>
                      {booking.message && (
                        <p className="italic">💬 {booking.message}</p>
                      )}
                    </div>
                    {!booking.is_available && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-4 w-4" />
                        Créneau plus disponible
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => handleContinueBooking(booking)}
                    disabled={!booking.is_available}
                    className="flex-1"
                  >
                    {booking.is_available
                      ? "Continuer la réservation"
                      : "Créneau indisponible"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(booking.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};