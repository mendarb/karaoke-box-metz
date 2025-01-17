export const PaymentMethods = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/90">
        Paiements acceptés
      </h3>
      <div className="flex items-center gap-6">
        <img src="/lovable-uploads/visa.svg" alt="Visa" className="h-5" />
        <img src="/lovable-uploads/Mastercard.svg" alt="Mastercard" className="h-5" />
        <img src="/lovable-uploads/paypal.svg" alt="PayPal" className="h-5" />
        <img src="/lovable-uploads/klarna.svg" alt="Klarna" className="h-5" />
        <img src="/lovable-uploads/apple pay.svg" alt="Apple Pay" className="h-5" />
      </div>
    </div>
  );
};