import { CreditCard, CircleDollarSign } from "lucide-react";

export const PaymentMethods = () => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      <div className="flex items-center p-3 bg-black/20 backdrop-blur-sm rounded-xl hover:bg-black/30 transition-colors duration-200">
        <CreditCard className="w-4 h-4 text-white mr-2" />
        <div className="text-left">
          <p className="text-sm font-medium text-white">Paiement en 3x</p>
          <p className="text-xs text-white/80">Sans frais avec Klarna</p>
        </div>
      </div>
      <div className="flex items-center p-3 bg-black/20 backdrop-blur-sm rounded-xl hover:bg-black/30 transition-colors duration-200">
        <CircleDollarSign className="w-4 h-4 text-white mr-2" />
        <div className="text-left">
          <p className="text-sm font-medium text-white">PayPal</p>
          <p className="text-xs text-white/80">Paiement sécurisé</p>
        </div>
      </div>
    </div>
  );
};