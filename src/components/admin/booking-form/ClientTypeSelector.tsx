import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ClientTypeSelectorProps {
  value: 'existing' | 'new';
  onChange: (value: 'existing' | 'new') => void;
}

export const ClientTypeSelector = ({ value, onChange }: ClientTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Type de client</h3>
      <RadioGroup
        defaultValue={value}
        onValueChange={(value) => onChange(value as 'existing' | 'new')}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem value="existing" id="existing" className="peer sr-only" />
          <Label
            htmlFor="existing"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-violet-600 [&:has([data-state=checked])]:border-violet-600"
          >
            <span>Client existant</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="new" id="new" className="peer sr-only" />
          <Label
            htmlFor="new"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-violet-600 [&:has([data-state=checked])]:border-violet-600"
          >
            <span>Nouveau client</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};