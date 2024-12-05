import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
}

export const DateTimeFields = ({ form }: DateTimeFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date de réservation</FormLabel>
            <FormControl>
              <Input type="date" min={new Date().toISOString().split("T")[0]} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="timeSlot"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Créneau horaire</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un créneau" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="10-12">10h - 12h</SelectItem>
                <SelectItem value="14-16">14h - 16h</SelectItem>
                <SelectItem value="18-20">18h - 20h</SelectItem>
                <SelectItem value="20-22">20h - 22h</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};