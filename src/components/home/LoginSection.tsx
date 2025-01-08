import { AuthForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { Home, Music, Users, Clock, CreditCard, CircleDollarSign } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";

interface LoginSectionProps {
  user: User | null;
  onShowAuth: () => void;
}

export const LoginSection = ({ user, onShowAuth }: LoginSectionProps) => {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Colonne de gauche */}
      <div className="flex items-center justify-center p-3">
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
      <div className="relative hidden md:block">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: 'url("/lovable-uploads/827450dc-c0dd-41bb-a327-eacaeda8445b.png")',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-20 h-full flex flex-col justify-center px-16 py-4">
          <div className="space-y-4">
            {/* En-tête */}
            <div className="space-y-2 mb-6">
              <h1 className="text-2xl font-bold text-white">
                K.Box Metz - Box Karaoké
              </h1>
              <p className="text-base text-white/90">
                Votre espace karaoké privatif au cœur de Metz
              </p>
            </div>

            {/* Liste des caractéristiques */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
                <Home className="w-5 h-5 text-white/90 group-hover:rotate-6 transition-transform duration-200" />
                <div>
                  <span className="font-medium text-white">Box Privative</span>
                  <p className="text-sm text-white/80">Espace intime et confortable</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
                <Music className="w-5 h-5 text-white/90 group-hover:rotate-6 transition-transform duration-200" />
                <div>
                  <span className="font-medium text-white">Catalogue Musical</span>
                  <p className="text-sm text-white/80">Plus de 30 000 titres disponibles</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
                <Clock className="w-5 h-5 text-white/90 group-hover:rotate-6 transition-transform duration-200" />
                <div>
                  <span className="font-medium text-white">Horaires</span>
                  <p className="text-sm text-white/80">Du mercredi au dimanche, 17h-23h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
                <Users className="w-5 h-5 text-white/90 group-hover:rotate-6 transition-transform duration-200" />
                <div>
                  <span className="font-medium text-white">Entre Amis</span>
                  <p className="text-sm text-white/80">Capacité jusqu'à 15 personnes</p>
                </div>
              </div>
            </div>

            {/* Moyens de paiement en grille 2x2 */}
            <div className="space-y-3 mt-6">
              <h3 className="text-base font-medium text-white">Moyens de paiement acceptés</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center p-3 bg-black/20 backdrop-blur-sm rounded-xl hover:bg-black/30 transition-colors duration-200">
                  <CreditCard className="w-4 h-4 text-white mr-2" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Carte bancaire</p>
                    <p className="text-xs text-white/80">Paiement sécurisé</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-black/20 backdrop-blur-sm rounded-xl hover:bg-black/30 transition-colors duration-200">
                  <CreditCard className="w-4 h-4 text-white mr-2" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Apple Pay</p>
                    <p className="text-xs text-white/80">Paiement sécurisé</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-black/20 backdrop-blur-sm rounded-xl hover:bg-black/30 transition-colors duration-200">
                  <CreditCard className="w-4 h-4 text-white mr-2" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Paiement en 3x</p>
                    <p className="text-xs text-white/80">Sans frais avec Klarna</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-black/20 backdrop-blur-sm rounded-xl hover:bg-black/30 transition-colors duration-200">
                  <CircleDollarSign className="w-4 h-4 text-white mr-2" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">PayPal</p>
                    <p className="text-xs text-white/80">Paiement sécurisé</p>
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