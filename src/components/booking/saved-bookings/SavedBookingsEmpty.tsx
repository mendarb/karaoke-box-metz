import { ShoppingCart } from "lucide-react";

export const SavedBookingsEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <ShoppingCart className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">Aucune réservation sauvegardée</h3>
      <p className="text-sm text-gray-500">
        Vos réservations sauvegardées apparaîtront ici
      </p>
    </div>
  );
};