import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDisabledDates } from "./hooks/useDisabledDates";
import { useDateTimeSelection } from "./hooks/useDateTimeSelection";
import { CalendarSection } from "./CalendarSection";
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

  const isDayExcludedCallback = useMemo(() => {
    return (date: Date) => {
      if (!settings?.openingHours) return true;
      const settingsWeekDay = convertJsWeekDayToSettings(date.getDay());
      const isOpen = settings.openingHours[settingsWeekDay]?.isOpen;
      console.log('Vérification jour:', {
        date: date.toISOString(),
        settingsWeekDay,
        isOpen
      });
      return !isOpen;
    };
  }, [settings]);

  const { disabledDates } = useDisabledDates({ 
    minDate, 
    maxDate, 
    isDayExcluded: isDayExcludedCallback 
  });

  useEffect(() => {
    const timeSlot = form.watch("timeSlot");
    if (timeSlot && selectedDate) {
      handleTimeSlotChange(timeSlot);
    }
  }, [form.watch("timeSlot"), selectedDate]);

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