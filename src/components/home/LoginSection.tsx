import { AuthForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { Home, Music, Users, Calendar, Clock, CreditCard, CircleDollarSign } from "lucide-react";

interface LoginSectionProps {
  user: User | null;
  onShowAuth: () => void;
}

export const LoginSection = ({ user, onShowAuth }: LoginSectionProps) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Colonne de gauche - Formulaire */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-[#ec6342]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">
              Connexion
            </h1>
            <p className="text-base text-white/90">
              Connectez-vous pour réserver votre box
            </p>
          </div>
          <Card className="p-8 bg-white shadow-lg rounded-xl">
            <AuthForm 
              onClose={() => {}} 
              isLogin={true}
              onToggleMode={() => {}}
            />
          </Card>

          <div className="mt-8 space-y-4">
            <div className="text-sm text-white/90 text-center">Moyens de paiement acceptés</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <CreditCard className="w-5 h-5 text-white mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Paiement en 3x</p>
                  <p className="text-xs text-white/80">Sans frais avec Klarna</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <CircleDollarSign className="w-5 h-5 text-white mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">PayPal</p>
                  <p className="text-xs text-white/80">Paiement sécurisé</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <img src="/lovable-uploads/72f8f139-d39e-4cac-b328-14d86dbc6927.png" alt="Visa" className="h-8" />
              <img src="/lovable-uploads/85294882-1624-4fa6-a2d0-09d415c43674.png" alt="Mastercard" className="h-8" />
              <img src="/lovable-uploads/b4b03af7-d741-46f7-a7f3-e927b989289f.png" alt="Apple Pay" className="h-8" />
              <img src="/lovable-uploads/cfa63d4d-3758-45b6-8316-13d7d026d109.png" alt="PayPal" className="h-8" />
              <img src="/lovable-uploads/d45fd1b9-de1b-40a3-ae6b-4072948883a6.png" alt="Klarna" className="h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Colonne de droite - Image et informations */}
      <div className="relative hidden lg:block">
        <img
          src="/lovable-uploads/245a691d-0576-40d2-91fb-cbd34455aec7.png"
          alt="Ambiance karaoké"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/85 to-black/75 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
          <div className="space-y-12 max-w-lg">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">K.Box Metz - Box Karaoké</h2>
              <p className="text-lg text-gray-200">Votre espace karaoké privatif au cœur de Metz</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-start space-x-3">
                <Home className="w-6 h-6 text-white mt-1" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl text-white">Box Privative</h3>
                  <p className="text-sm text-gray-200">Espace intime et confortable</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Music className="w-6 h-6 text-white mt-1" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl text-white">Catalogue Musical</h3>
                  <p className="text-sm text-gray-200">Plus de 30 000 titres disponibles</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-white mt-1" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl text-white">Horaires</h3>
                  <p className="text-sm text-gray-200">Du mercredi au dimanche, 17h-23h</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 text-white mt-1" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl text-white">Entre Amis</h3>
                  <p className="text-sm text-gray-200">Capacité jusqu'à 10 personnes</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-white" />
                <h3 className="font-semibold text-xl text-white">Un espace privatif unique</h3>
              </div>
              <ul className="text-sm text-gray-200 grid grid-cols-2 gap-y-2">
                <li className="flex items-center space-x-2">
                  <span className="text-white">•</span>
                  <span>Écran HD interactif</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-white">•</span>
                  <span>Système audio pro</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-white">•</span>
                  <span>Éclairage LED</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-white">•</span>
                  <span>Isolation phonique</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-white">•</span>
                  <span>Service en salle</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-white">•</span>
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