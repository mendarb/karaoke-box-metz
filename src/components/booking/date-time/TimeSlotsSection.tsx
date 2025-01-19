import { UseFormReturn } from "react-hook-form";
import { isToday, format, parse } from "date-fns";

interface TimeSlotsProps {
  form: UseFormReturn<any>;
  availableSlots: {
    slots: string[];
    blockedSlots: Set<string>;
  };
  isLoading: boolean;
}

export const TimeSlotsSection = ({
  form,
  availableSlots,
  isLoading,
}: TimeSlotsProps) => {
  const selectedDate = form.watch("date");
  const selectedTimeSlot = form.watch("timeSlot");

  // Filtrer les créneaux passés pour aujourd'hui
  const filterPassedTimeSlots = (slots: string[]) => {
    if (!selectedDate || !isToday(new Date(selectedDate))) {
      return slots;
    }

    const now = new Date();
    const currentHour = now.getHours();
    
    return slots.filter(slot => {
      const slotHour = parseInt(slot);
      return slotHour > currentHour;
    });
  };

  const filteredSlots = filterPassedTimeSlots(availableSlots.slots);

  if (!selectedDate) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-2">
          Sélectionnez vos créneaux (jusqu'à 4h consécutives)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Les créneaux affichés sont disponibles à la réservation
        </p>
      </div>

      {filteredSlots.length === 0 ? (
        <p className="text-sm text-gray-500">
          Aucun créneau disponible pour cette date. Veuillez sélectionner une autre date.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filteredSlots.map((slot) => (
            <TimeSlot
              key={slot}
              slot={slot}
              isSelected={selectedTimeSlot === slot}
              isDisabled={availableSlots.blockedSlots.has(slot)}
              onSelect={(slot) => form.setValue("timeSlot", slot)}
              date={new Date(selectedDate)}
            />
          ))}
        </div>
      )}
    </div>
  );
};