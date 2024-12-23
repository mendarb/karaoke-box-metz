import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDisabledDates } from "./date-time/hooks/useDisabledDates";
import { useDateTimeSelection } from "./date-time/hooks/useDateTimeSelection";
import { CalendarSection } from "./date-time/calendar/CalendarSection";
import { TimeSlotsSection } from "./date-time/TimeSlotsSection";
import { useBookingSettings } from "./date-time/hooks/useBookingSettings";

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
  const { disabledDates } = useDisabledDates({
    minDate,
    maxDate,
    isDayExcluded: (date) => {
      if (!settings?.openingHours) {
        console.log('❌ Pas de paramètres d\'horaires disponibles');
        return true;
      }
      
      const dayOfWeek = date.getDay().toString();
      const daySettings = settings.openingHours[dayOfWeek];
      
      if (!daySettings?.isOpen) {
        console.log(`❌ Jour ${dayOfWeek} fermé selon les paramètres`);
        return true;
      }

      if (settings.excludedDays?.includes(date.getTime())) {
        console.log('❌ Date spécifiquement exclue');
        return true;
      }

      console.log(`✅ Jour ${dayOfWeek} ouvert selon les paramètres`);
      return false;
    }
  });

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
    settings: settings?.openingHours
  });

  return (
    <div className="space-y-8">
      <CalendarSection
        form={form}
        selectedDate={selectedDate}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        onDateSelect={handleDateSelect}
      />

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