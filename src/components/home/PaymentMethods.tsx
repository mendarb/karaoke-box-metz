export const PaymentMethods = () => {
  return (
    <div className="py-12 bg-gray-50 border-t">
      <div className="container mx-auto px-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-8 text-center">
          Paiements acceptés
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 place-items-center max-w-2xl mx-auto animate-fadeIn">
          <div className="bg-[#1A1F2C] rounded-lg p-3 flex items-center justify-center">
            <img src="/lovable-uploads/visa.svg" alt="Visa" className="h-6" />
          </div>
          <div className="flex items-center justify-center">
            <img src="/lovable-uploads/Mastercard.svg" alt="Mastercard" className="h-6" />
          </div>
          <div className="flex items-center justify-center">
            <img src="/lovable-uploads/paypal.svg" alt="PayPal" className="h-6" />
          </div>
          <div className="flex items-center justify-center">
            <img src="/lovable-uploads/apple pay.svg" alt="Apple Pay" className="h-6" />
          </div>
          <div className="flex items-center justify-center">
            <img src="/lovable-uploads/klarna.svg" alt="Klarna" className="h-6" />
          </div>
          <div className="flex items-center justify-center">
            <img src="/lovable-uploads/stripe.svg" alt="Stripe" className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};