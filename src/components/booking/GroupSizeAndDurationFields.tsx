import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface GroupSizeAndDurationFieldsProps {
  form: UseFormReturn<any>;
  onGroupSizeChange: (value: string) => void;
  onDurationChange: (value: string) => void;
}

export const GroupSizeAndDurationFields = ({
  form,
  onGroupSizeChange,
  onDurationChange,
}: GroupSizeAndDurationFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="groupSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Taille du groupe</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onGroupSizeChange(value);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la taille du groupe" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1-3">1 à 3 personnes (30€/heure)</SelectItem>
                <SelectItem value="4">4 personnes (40€/heure)</SelectItem>
                <SelectItem value="5-10">5 à 10 personnes (50€/heure)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Durée de la réservation</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onDurationChange(value);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez la durée" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">1 heure</SelectItem>
                <SelectItem value="2">2 heures</SelectItem>
                <SelectItem value="3">3 heures</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};