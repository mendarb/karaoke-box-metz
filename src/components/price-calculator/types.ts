export interface PriceCalculatorProps {
  groupSize: string;
  duration: string;
  onPriceCalculated?: (price: number) => void;
}

export interface PriceSettings {
  perHour: number;
  perPerson: number;
}