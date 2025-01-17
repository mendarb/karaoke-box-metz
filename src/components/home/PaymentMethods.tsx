export const PaymentMethods = () => {
  return (
    <div className="py-12 bg-gray-50 border-t">
      <div className="container mx-auto px-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-8 text-center">
          Paiements acceptés
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 animate-fadeIn">
          <img src="/lovable-uploads/visa.svg" alt="Visa" className="h-8 hover:opacity-80 transition-opacity" />
          <img src="/lovable-uploads/Mastercard.svg" alt="Mastercard" className="h-8 hover:opacity-80 transition-opacity" />
          <img src="/lovable-uploads/paypal.svg" alt="PayPal" className="h-8 hover:opacity-80 transition-opacity" />
          <img src="/lovable-uploads/apple pay.svg" alt="Apple Pay" className="h-8 hover:opacity-80 transition-opacity" />
        </div>
      </div>
    </div>
  );
};