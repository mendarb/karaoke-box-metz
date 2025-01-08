import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

export const InfoColumn = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 text-center">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-gray-900">
          Réservez votre session karaoké
        </h1>
        <p className="text-base text-gray-500">
          Pour profiter de notre box karaoké, connectez-vous à votre compte ou créez-en un nouveau en quelques clics.
        </p>
      </div>

      <div className="w-full space-y-4">
        <Button 
          variant="default"
          className="w-full h-12 bg-kbox-coral hover:bg-kbox-orange-dark text-white rounded-xl text-base font-medium"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Se connecter pour réserver
        </Button>

        <Button 
          variant="outline"
          className="w-full h-12 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-base font-medium"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Créer un compte pour réserver
        </Button>
      </div>
    </div>
  );
};