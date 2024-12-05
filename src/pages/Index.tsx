import { BookingForm } from "@/components/BookingForm";
import { Mic } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-violet-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Mic className="h-12 w-12 text-karaoke-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Réservez votre cabine de Karaoké BOX Privatif à Metz 🎤
          </h1>
          <p className="text-lg text-gray-600">
            Utilisez ce formulaire pour réserver une cabine de karaoké privatif. 
            Indiquez vos préférences et nous confirmerons votre réservation sous 24 heures.
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
          <BookingForm />
        </div>
      </div>
    </div>
  );
};

export default Index;