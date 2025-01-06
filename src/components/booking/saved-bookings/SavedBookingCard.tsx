import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, CalendarDays, Trash2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCalculatePrice } from "@/components/price-calculator/useCalculatePrice";
import { usePriceSettings } from "@/components/price-calculator/usePriceSettings";
import { supabase } from "@/lib/supabase";

interface SavedBookingProps {
  booking: {
    id: string;
    date: string;
    time_slot: string;
    duration: string;
    group_size: string;
    message?: string;
    is_available?: boolean;
  };
  onDelete: (id: string) => void;
  onContinue: (booking: any) => void;
}

export const SavedBookingCard = ({ booking, onDelete, onContinue }: SavedBookingProps) => {
  const { toast } = useToast();
  const { data: settings } = usePriceSettings();
  const { calculatePrice } = useCalculatePrice({ settings });

  const price = calculatePrice(booking.group_size, booking.duration);

  const checkAvailability = async () => {
    try {
      // Vérifier si le créneau n'a pas été réservé entre temps
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', booking.date)
        .eq('time_slot', booking.time_slot)
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (existingBookings && existingBookings.length > 0) {
        toast({
          title: "Créneau indisponible",
          description: "Ce créneau a déjà été réservé. Veuillez en choisir un autre.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      return false;
    }
  };

  const handleContinue = async () => {
    const isAvailable = await checkAvailability();
    if (!isAvailable) return;

    onContinue({
      ...booking,
      currentStep: 3,
      is_available: true
    });
  };

  return (
    <Card className="p-4 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-violet-500" />
            <span className="font-medium">
              {format(new Date(booking.date), "EEEE d MMMM yyyy", { locale: fr })}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-violet-500" />
            <span>{booking.time_slot}h ({booking.duration}h)</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-500" />
            <span>{booking.group_size} personnes</span>
          </div>

          {price > 0 && (
            <Badge variant="secondary" className="mt-2">
              {price}€
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(booking.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button 
        onClick={handleContinue}
        className="w-full gap-2"
      >
        Continuer la réservation
        <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  );
};