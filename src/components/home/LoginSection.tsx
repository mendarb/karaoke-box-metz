import { AuthForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { Home, Music, Users, Clock, CreditCard, CircleDollarSign, Star } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";

interface LoginSectionProps {
  user: User | null;
  onShowAuth: () => void;
}

export const LoginSection = ({ user, onShowAuth }: LoginSectionProps) => {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Colonne de gauche */}
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-none">
            {!user ? (
              <AuthForm 
                onClose={() => {}} 
                isLogin={true}
                onToggleMode={onShowAuth}
              />
            ) : (
              <BookingForm />
            )}
          </Card>
        </div>
      </div>

      {/* Colonne de droite */}
      <div className="relative hidden md:block bg-[#ec6342]">
        <div className="relative z-20 h-full flex flex-col justify-center p-8 text-white">
          <div className="space-y-8">
            {/* En-tête */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">
                K.Box Metz - Box Karaoké
              </h1>
              <p className="text-lg text-white/90">
                Votre espace karaoké privatif au cœur de Metz
              </p>
            </div>

            {/* Liste des caractéristiques */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
                <Home className="w-5 h-5 text-white/90 group-hover:rotate-6 transition-transform duration-200" />
                <div>
                  <span className="font-medium">Box Privative</span>
                  <p className="text-sm text-white/80">Espace intime et confortable</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
                <Music className="w-5 h-5 text-white/90 group-hover:rotate-6 transition-transform duration-200" />
                <div>
                  <span className="font-medium">Catalogue Musical</span>
                  <p className="text-sm text-white/80">Plus de 30 000 titres disponibles</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
                <Clock className="w-5 h-5 text-white/90 group-hover:rotate-6 transition-transform duration-200" />
                <div>
                  <span className="font-medium">Horaires</span>
                  <p className="text-sm text-white/80">Du mercredi au dimanche, 17h-23h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
                <Users className="w-5 h-5 text-white/90 group-hover:rotate-6 transition-transform duration-200" />
                <div>
                  <span className="font-medium">Entre Amis</span>
                  <p className="text-sm text-white/80">Capacité jusqu'à 10 personnes</p>
                </div>
              </div>
            </div>

            {/* Moyens de paiement */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Moyens de paiement acceptés</h3>
              <div className="grid gap-3">
                <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors duration-200">
                  <CreditCard className="w-5 h-5 text-white mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Carte bancaire</p>
                    <p className="text-xs text-white/80">Paiement sécurisé</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors duration-200">
                  <CreditCard className="w-5 h-5 text-white mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Apple Pay</p>
                    <p className="text-xs text-white/80">Paiement sécurisé</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors duration-200">
                  <CreditCard className="w-5 h-5 text-white mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Paiement en 3x</p>
                    <p className="text-xs text-white/80">Sans frais avec Klarna</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors duration-200">
                  <CircleDollarSign className="w-5 h-5 text-white mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">PayPal</p>
                    <p className="text-xs text-white/80">Paiement sécurisé</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Témoignage client */}
            <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-sm italic text-white/90">
                "Une expérience incroyable ! La box est super bien équipée et l'ambiance est au top. Parfait pour une soirée entre amis !"
              </p>
              <p className="text-xs text-white/70 mt-2">
                - Marie L.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};