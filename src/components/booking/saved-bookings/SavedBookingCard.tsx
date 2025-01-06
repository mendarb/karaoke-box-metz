import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SavedBookingCardProps {
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

export const SavedBookingCard = ({ booking, onDelete, onContinue }: SavedBookingCardProps) => {
  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">
              {format(new Date(booking.date), "EEEE d MMMM yyyy", { locale: fr })}
            </h3>
            <div className="space-y-1 mt-2">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-4 h-4 inline-flex items-center justify-center rounded-full bg-violet-100 text-violet-600">🕒</span>
                {booking.time_slot}h - {parseInt(booking.time_slot) + parseInt(booking.duration)}h ({booking.duration}h)
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-4 h-4 inline-flex items-center justify-center rounded-full bg-violet-100 text-violet-600">👥</span>
                {booking.group_size} personnes
              </p>
              {booking.message && (
                <p className="text-sm text-gray-500 italic flex items-center gap-2">
                  <span className="w-4 h-4 inline-flex items-center justify-center rounded-full bg-violet-100 text-violet-600">💬</span>
                  {booking.message}
                </p>
              )}
            </div>
          </div>
          {!booking.is_available && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              <AlertCircle className="w-3 h-3 mr-1" />
              Indisponible
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          onClick={() => onContinue(booking)}
          disabled={!booking.is_available}
          className="flex-1 bg-violet-600 hover:bg-violet-700"
        >
          {booking.is_available ? "Continuer la réservation" : "Créneau indisponible"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(booking.id)}
          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};