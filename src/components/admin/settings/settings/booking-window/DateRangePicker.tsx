import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DateRangePickerProps {
  form: UseFormReturn<any>;
}

export const DateRangePicker = ({ form }: DateRangePickerProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="bookingWindow.startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date de début des réservations</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date() || (form.watch("bookingWindow.endDate") && date > form.watch("bookingWindow.endDate"))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              Date à partir de laquelle les clients peuvent réserver
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bookingWindow.endDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date de fin des réservations</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date() || (form.watch("bookingWindow.startDate") && date < form.watch("bookingWindow.startDate"))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              Date jusqu'à laquelle les clients peuvent réserver
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
};