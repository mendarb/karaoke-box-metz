import { BookingForm } from "@/components/BookingForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-violet-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <img 
            src="/lovable-uploads/59d9c366-5156-416c-a63a-8ab38e3fe556.png" 
            alt="Kara-OK Box Privatif"
            className="h-24 mx-auto mb-8"
          />
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Réservez votre cabine de karaoké privatif à Metz. Indiquez vos préférences et nous confirmerons votre réservation sous 24 heures.
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-violet-100">
          <BookingForm />
        </div>
      </div>
    </div>
  );
};

export default Index;