import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDisabledDates } from "./date-time/hooks/useDisabledDates";
import { useDateTimeSelection } from "./date-time/hooks/useDateTimeSelection";
import { CalendarSection } from "./date-time/calendar/CalendarSection";
import { TimeSlotsSection } from "./date-time/TimeSlotsSection";
import { useBookingSettings } from "./date-time/hooks/useBookingSettings";
import { addDays, startOfDay } from "date-fns";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void;
}

export const DateTimeFields = ({ form, onAvailabilityChange }: DateTimeFieldsProps) => {
  const {
    selectedDate,
    availableSlots,
    handleDateSelect,
    handleTimeSlotChange
  } = useDateTimeSelection(form, onAvailabilityChange);

  const { minDate, maxDate, settings } = useBookingSettings();
  const { disabledDates } = useDisabledDates({ minDate, maxDate });

  // Trouver la première date disponible
  const getFirstAvailableDate = () => {
    let currentDate = startOfDay(minDate);
    const endDate = maxDate;
    
    while (currentDate <= endDate) {
      if (!disabledDates.some(disabledDate => 
        disabledDate.toDateString() === currentDate.toDateString()
      )) {
        return currentDate;
      }
      currentDate = addDays(currentDate, 1);
    }
    return minDate;
  };

  useEffect(() => {
    if (!selectedDate) {
      const firstAvailableDate = getFirstAvailableDate();
      handleDateSelect(firstAvailableDate);
    }
  }, []);

  useEffect(() => {
    const timeSlot = form.watch("timeSlot");
    if (timeSlot && selectedDate) {
      handleTimeSlotChange(timeSlot);
    }
  }, [form.watch("timeSlot")]);

  console.log('DateTimeFields render:', {
    selectedDate,
    minDate,
    maxDate,
    disabledDates: disabledDates.length,
    availableSlots,
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CalendarSection
          form={form}
          selectedDate={selectedDate}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          onDateSelect={handleDateSelect}
          defaultMonth={getFirstAvailableDate()}
        />
        
        <div className="hidden md:block space-y-4 bg-white/50 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Choisissez votre date
          </h3>
          <div className="space-y-4 text-gray-600">
            <p>
              Pour commencer votre réservation, sélectionnez la date qui vous convient le mieux dans le calendrier.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-violet-500 mr-2">•</span>
                Les dates disponibles sont affichées en noir
              </li>
              <li className="flex items-start">
                <span className="text-violet-500 mr-2">•</span>
                Les dates grisées ne sont pas disponibles à la réservation
              </li>
              <li className="flex items-start">
                <span className="text-violet-500 mr-2">•</span>
                Vous pouvez réserver jusqu'à {maxDate ? '2 mois' : '30 jours'} à l'avance
              </li>
            </ul>
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-2">
                Étape suivante
              </h4>
              <p className="text-sm">
                Une fois la date sélectionnée, vous pourrez choisir votre créneau horaire parmi les disponibilités affichées ci-dessous.
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedDate && (
        <TimeSlotsSection
          form={form}
          availableSlots={availableSlots}
          isLoading={false}
        />
      )}
    </div>
  );
};