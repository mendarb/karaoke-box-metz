export const PaymentMethods = () => {
  return (
    <div className="py-8 bg-white border-t">
      <div className="container mx-auto px-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Paiements acceptés
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-6">
          <img src="/lovable-uploads/visa.svg" alt="Visa" className="h-8" />
          <img src="/lovable-uploads/Mastercard.svg" alt="Mastercard" className="h-8" />
          <img src="/lovable-uploads/paypal.svg" alt="PayPal" className="h-8" />
          <img src="/lovable-uploads/klarna.svg" alt="Klarna" className="h-8" />
          <img src="/lovable-uploads/stripe.svg" alt="Stripe" className="h-8" />
          <img src="/lovable-uploads/apple pay.svg" alt="Apple Pay" className="h-8" />
        </div>
      </div>
    </div>
  );
};