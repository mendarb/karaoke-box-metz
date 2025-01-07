import { AuthForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { Home, Music, Users, Calendar, Clock, CreditCard, CircleDollarSign, ArrowRight, CreditCardIcon } from "lucide-react";

interface LoginSectionProps {
  user: User | null;
  onShowAuth: () => void;
}

export const LoginSection = ({ user, onShowAuth }: LoginSectionProps) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Colonne de gauche - Formulaire */}
      <div className="flex items-center justify-center p-6 lg:p-8 bg-gradient-to-br from-white to-kbox-pink/10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              Connexion
            </h1>
            <p className="text-base text-gray-600">
              Connectez-vous pour réserver votre box
            </p>
          </div>
          <Card className="p-6 bg-white shadow-lg rounded-[24px] border-gray-100">
            <AuthForm 
              onClose={() => {}} 
              isLogin={true}
              onToggleMode={onShowAuth}
            />
          </Card>
        </div>
      </div>

      {/* Colonne droite - Image et informations */}
      <div className="relative hidden lg:block">
        <img
          src="/lovable-uploads/245a691d-0576-40d2-91fb-cbd34455aec7.png"
          alt="Ambiance karaoké"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-10 text-white">
          <div className="space-y-8 max-w-xl">
            <div className="space-y-4">
              <h2 className="text-5xl font-serif font-bold text-white leading-tight">
                K.Box Metz
                <span className="block text-3xl mt-2 text-white/90">Box Karaoké Privatif</span>
              </h2>
              <p className="text-xl text-gray-200">
                Votre espace karaoké privatif au cœur de Metz
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-full bg-white/10">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-xl text-white">Box Privative</h3>
                  <p className="text-sm text-gray-200">Espace intime et confortable</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-full bg-white/10">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-xl text-white">Catalogue Musical</h3>
                  <p className="text-sm text-gray-200">Plus de 30 000 titres disponibles</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-full bg-white/10">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-xl text-white">Horaires</h3>
                  <p className="text-sm text-gray-200">Du mercredi au dimanche, 17h-23h</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-full bg-white/10">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-xl text-white">Entre Amis</h3>
                  <p className="text-sm text-gray-200">Capacité jusqu'à 10 personnes</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-white/90">Moyens de paiement acceptés</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <CreditCard className="w-5 h-5 text-white mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Carte bancaire</p>
                    <p className="text-xs text-white/80">Paiement sécurisé</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <CircleDollarSign className="w-5 h-5 text-white mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Apple Pay</p>
                    <p className="text-xs text-white/80">Paiement sécurisé</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <CircleDollarSign className="w-5 h-5 text-white mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">PayPal</p>
                    <p className="text-xs text-white/80">Paiement sécurisé</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <CreditCard className="w-5 h-5 text-white mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Paiement en 3x</p>
                    <p className="text-xs text-white/80">Sans frais avec Klarna</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};