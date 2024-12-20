import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";

interface CabinSelectionProps {
  form: UseFormReturn<any>;
}

export const CabinSelection = ({ form }: CabinSelectionProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <FormField
        control={form.control}
        name="cabin"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Choisissez votre cabine</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <FormItem>
                  <FormControl>
                    <div>
                      <RadioGroupItem
                        value="metz"
                        id="metz"
                        className="peer sr-only"
                      />
                      <label
                        htmlFor="metz"
                        className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-violet-600 [&:has([data-state=checked])]:border-violet-600 cursor-pointer"
                      >
                        <div className="space-y-1 text-center">
                          <p className="text-lg font-medium leading-none">
                            Metz Centre
                          </p>
                          <p className="text-sm text-muted-foreground">
                            1 rue du Karaoké, 57000 Metz
                          </p>
                        </div>
                      </label>
                    </div>
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormControl>
                    <div>
                      <RadioGroupItem
                        value="thionville"
                        id="thionville"
                        className="peer sr-only"
                        disabled
                      />
                      <label
                        htmlFor="thionville"
                        className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-violet-600 [&:has([data-state=checked])]:border-violet-600 cursor-not-allowed opacity-50"
                      >
                        <div className="space-y-1 text-center">
                          <p className="text-lg font-medium leading-none">
                            Thionville
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Bientôt disponible
                          </p>
                        </div>
                      </label>
                    </div>
                  </FormControl>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};