import { Euro, CreditCard } from "lucide-react";

interface PaymentMethodProps {
  method: string;
}

export const PaymentMethod = ({ method }: PaymentMethodProps) => {
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'Carte bancaire';
      case 'cash':
        return 'Espèces';
      case 'transfer':
        return 'Virement';
      default:
        return method;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'stripe':
        return <CreditCard className="h-4 w-4 text-violet-500" />;
      case 'cash':
        return <Euro className="h-4 w-4 text-violet-500" />;
      case 'transfer':
        return <CreditCard className="h-4 w-4 text-violet-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-violet-500" />;
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-2">
        {getPaymentMethodIcon(method)}
        <span>{getPaymentMethodLabel(method)}</span>
      </div>
    </div>
  );
};