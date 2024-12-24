import { UseFormReturn } from "react-hook-form";
import { TestModeSwitch } from "./booking-window/TestModeSwitch";
import { DateRangePicker } from "./booking-window/DateRangePicker";

interface BookingWindowSettingsProps {
  form: UseFormReturn<any>;
}

export const BookingWindowSettings = ({ form }: BookingWindowSettingsProps) => {
  return (
    <div className="space-y-6">
      <TestModeSwitch form={form} />
      <DateRangePicker form={form} />
    </div>
  );
};