import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { SavedBooking } from "./types";

interface SavedBookingsListProps {
  bookings: SavedBooking[];
  onDelete: (id: string) => void;
  onContinue: (booking: SavedBooking) => void;
}

export const SavedBookingsList = ({ 
  bookings, 
  onDelete, 
  onContinue 
}: SavedBookingsListProps) => {
  if (!bookings.length) {
    return (
      <div className="text-center p-6 text-gray-500">
        Aucune réservation sauvegardée
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
      {bookings.map((booking) => (
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
              {!booking.is_available && (
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
                variant={booking.is_available ? "default" : "secondary"}
                className="flex-1 md:flex-none"
                onClick={() => onContinue(booking)}
                disabled={!booking.is_available}
              >
                {booking.is_available ? "Continuer la réservation" : "Créneau indisponible"}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};