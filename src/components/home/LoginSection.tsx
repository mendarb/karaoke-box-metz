import { AuthForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";

interface LoginSectionProps {
  user: User | null;
  onShowAuth: () => void;
}

export const LoginSection = ({ user, onShowAuth }: LoginSectionProps) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Colonne de gauche - Formulaire */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Créer votre compte
            </h1>
            <p className="text-base text-gray-600">
              Commencez votre expérience karaoké dès maintenant
            </p>
          </div>
          <Card className="p-8 bg-white shadow-sm rounded-xl border-0">
            <AuthForm 
              onClose={() => {}} 
              isLogin={false}
              onToggleMode={() => {}}
            />
          </Card>
        </div>
      </div>

      {/* Colonne de droite - Image et informations */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/95" />
        <img
          src="/lovable-uploads/245a691d-0576-40d2-91fb-cbd34455aec7.png"
          alt="Ambiance karaoké"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
          <div className="space-y-8 max-w-lg">
            <h2 className="text-4xl font-bold">K.Box Metz - Box Karaoké</h2>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="font-semibold text-xl">Box Privative</h3>
                <p className="text-sm text-gray-200">Espace intime et confortable</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-xl">Catalogue Musical</h3>
                <p className="text-sm text-gray-200">Plus de 30 000 titres disponibles</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-xl">Horaires</h3>
                <p className="text-sm text-gray-200">Du mercredi au dimanche, 17h-23h</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-xl">Entre Amis</h3>
                <p className="text-sm text-gray-200">Capacité jusqu'à 10 personnes</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-xl">Un espace privatif unique</h3>
              <ul className="text-sm text-gray-200 grid grid-cols-2 gap-y-2">
                <li className="flex items-center space-x-2">
                  <span className="text-kbox-coral">•</span>
                  <span>Écran HD interactif</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-kbox-coral">•</span>
                  <span>Système audio pro</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-kbox-coral">•</span>
                  <span>Éclairage LED</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-kbox-coral">•</span>
                  <span>Isolation phonique</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-kbox-coral">•</span>
                  <span>Service en salle</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-kbox-coral">•</span>
                  <span>Banquettes confortables</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};