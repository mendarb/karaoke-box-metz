import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { PaymentMethod } from "../BookingForm";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export const PaymentMethodSelector = ({ value, onChange }: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Méthode de paiement</h3>
      <RadioGroup
        defaultValue={value}
        onValueChange={(value) => onChange(value as PaymentMethod)}
        className="grid grid-cols-3 gap-4"
      >
        <div>
          <RadioGroupItem value="stripe" id="stripe" className="peer sr-only" />
          <Label
            htmlFor="stripe"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-violet-600 [&:has([data-state=checked])]:border-violet-600"
          >
            <span>Stripe (en ligne)</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="sumup" id="sumup" className="peer sr-only" />
          <Label
            htmlFor="sumup"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-violet-600 [&:has([data-state=checked])]:border-violet-600"
          >
            <span>SumUp (carte)</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
          <Label
            htmlFor="cash"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-violet-600 [&:has([data-state=checked])]:border-violet-600"
          >
            <span>Espèces</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};