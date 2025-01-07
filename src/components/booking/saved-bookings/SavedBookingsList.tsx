import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SavedBooking } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500 space-y-4">
        <Calendar className="w-12 h-12 text-violet-200" />
        <p>Aucune réservation sauvegardée</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[70vh] pr-4">
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-4 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-violet-600">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">
                    {format(new Date(booking.date), 'EEEE d MMMM yyyy', { locale: fr })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    {booking.time_slot}h - {parseInt(booking.time_slot) + parseInt(booking.duration)}h
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{booking.group_size} personnes • {booking.duration}h</span>
                </div>

                {!booking.isAvailable && (
                  <div className="flex items-center text-amber-600 text-sm bg-amber-50 p-2 rounded-md">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Ce créneau n'est plus disponible
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(booking.id)}
                >
                  Supprimer
                </Button>
                <Button
                  variant={booking.isAvailable ? "default" : "secondary"}
                  size="sm"
                  className="ml-auto gap-2"
                  onClick={() => onContinue(booking)}
                  disabled={!booking.isAvailable}
                >
                  {booking.isAvailable ? (
                    <>
                      Continuer
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    "Créneau indisponible"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};