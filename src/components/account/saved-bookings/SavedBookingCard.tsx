import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SavedBooking } from "./types";

interface SavedBookingCardProps {
  booking: SavedBooking;
  onDelete: (id: string) => void;
  onContinue: (booking: SavedBooking) => void;
}

export const SavedBookingCard = ({ booking, onDelete, onContinue }: SavedBookingCardProps) => {
  return (
    <Card key={booking.id} className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="font-medium">
            {format(new Date(booking.date), 'EEEE d MMMM yyyy', { locale: fr })}
          </div>
          <div className="text-gray-600">
            {booking.time_slot}h - {parseInt(booking.time_slot) + parseInt(booking.duration)}h
          </div>
          <div className="text-sm text-gray-500">
            {booking.group_size} personnes • {booking.duration}h
          </div>
          {!booking.isAvailable && (
            <div className="flex items-center text-amber-600 text-sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Ce créneau n'est plus disponible
            </div>
          )}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex-1 md:flex-none"
            onClick={() => onDelete(booking.id)}
          >
            Supprimer
          </Button>
          <Button
            variant={booking.isAvailable ? "default" : "secondary"}
            className="flex-1 md:flex-none"
            onClick={() => onContinue(booking)}
            disabled={!booking.isAvailable}
          >
            {booking.isAvailable ? "Continuer la réservation" : "Créneau indisponible"}
          </Button>
        </div>
      </div>
    </Card>
  );
};