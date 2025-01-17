export const PaymentMethods = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/90">
        Paiements acceptés
      </h3>
      <div className="flex gap-4 items-center">
        <div className="bg-white/10 p-3 rounded-full">
          <img src="/lovable-uploads/visa.svg" alt="Visa" className="h-5" />
        </div>
        <div className="bg-white/10 p-3 rounded-full">
          <img src="/lovable-uploads/Mastercard.svg" alt="Mastercard" className="h-5" />
        </div>
        <div className="bg-white/10 p-3 rounded-full">
          <img src="/lovable-uploads/paypal.svg" alt="PayPal" className="h-5" />
        </div>
        <div className="bg-white/10 p-3 rounded-full">
          <img src="/lovable-uploads/klarna.svg" alt="Klarna" className="h-5" />
        </div>
        <div className="bg-white/10 p-3 rounded-full">
          <img src="/lovable-uploads/stripe.svg" alt="Stripe" className="h-5" />
        </div>
      </div>
    </div>
  );
};