import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDisabledDates } from "./hooks/useDisabledDates";
import { useDateTimeSelection } from "./hooks/useDateTimeSelection";
import { CalendarSection } from "./calendar/CalendarSection";
import { TimeSlotsSection } from "./TimeSlotsSection";
import { useBookingSettings } from "./hooks/useBookingSettings";
import { convertJsWeekDayToSettings } from "./utils/dateConversion";

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

  const isDayExcludedCallback = useMemo(() => (date: Date) => {
    if (!settings?.openingHours) return true;
    const settingsWeekDay = convertJsWeekDayToSettings(date.getDay());
    const daySettings = settings.openingHours[settingsWeekDay];
    return !daySettings?.isOpen;
  }, [settings]);

  const { disabledDates } = useDisabledDates({ 
    minDate, 
    maxDate, 
    isDayExcluded: isDayExcludedCallback 
  });

  const timeSlot = form.watch("timeSlot");

  useEffect(() => {
    if (timeSlot && selectedDate) {
      handleTimeSlotChange(timeSlot);
    }
  }, [timeSlot, selectedDate, handleTimeSlotChange]);

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