import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDisabledDates } from "./date-time/hooks/useDisabledDates";
import { useDateTimeSelection } from "./date-time/hooks/useDateTimeSelection";
import { CalendarSection } from "./date-time/calendar/CalendarSection";
import { TimeSlotsSection } from "./date-time/TimeSlotsSection";
import { useBookingSettings } from "./date-time/hooks/useBookingSettings";
import { addDays, startOfDay, startOfToday, isBefore, isToday, format } from "date-fns";

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
    let currentDate = startOfToday();
    const endDate = maxDate;
    
    while (currentDate <= endDate) {
      if (!disabledDates.some(disabledDate => 
        disabledDate.toDateString() === currentDate.toDateString()
      ) && !isBefore(currentDate, startOfToday())) {
        return currentDate;
      }
      currentDate = addDays(currentDate, 1);
    }
    return startOfToday();
  };

  const firstAvailableDate = getFirstAvailableDate();

  // Filtrer les créneaux horaires passés pour aujourd'hui
  const filterPassedTimeSlots = (slots: { slots: string[], blockedSlots: Set<string> }) => {
    if (!selectedDate || !isToday(selectedDate)) {
      return slots;
    }

    const now = new Date();
    const currentHour = now.getHours();
    
    const filteredSlots = slots.slots.filter(slot => {
      const slotHour = parseInt(slot.split(':')[0]);
      return slotHour > currentHour;
    });

    return {
      slots: filteredSlots,
      blockedSlots: slots.blockedSlots
    };
  };

  const filteredAvailableSlots = filterPassedTimeSlots(availableSlots);

  useEffect(() => {
    if (!selectedDate || isBefore(selectedDate, startOfToday())) {
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
    availableSlots: filteredAvailableSlots,
  });

  return (
    <div className="space-y-8 w-full">
      <CalendarSection
        form={form}
        selectedDate={selectedDate}
        minDate={startOfToday()}
        maxDate={maxDate}
        disabledDates={disabledDates}
        onDateSelect={handleDateSelect}
        defaultMonth={firstAvailableDate}
      />

      {selectedDate && (
        <TimeSlotsSection
          form={form}
          availableSlots={filteredAvailableSlots}
          isLoading={false}
        />
      )}
    </div>
  );
};