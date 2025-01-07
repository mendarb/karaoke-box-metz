import { AuthForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { Home, Music, Users, Calendar, Clock, CreditCard, CircleDollarSign } from "lucide-react";
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
      <div className="relative hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/40 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/lovable-uploads/d45fd1b9-de1b-40a3-ae6b-4072948883a6.png')",
          }}
        />
        
        <div className="relative z-20 h-full flex flex-col justify-center p-8 text-white">
          <div className="space-y-8">
            {/* En-tête */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">
                K.Box Metz - Box Karaoké
              </h1>
              <p className="text-lg text-white/90">
                Réservez votre session de karaoké en quelques clics
              </p>
            </div>

            {/* Liste des caractéristiques */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Home className="w-5 h-5 text-white/90" />
                <span>Box privative et insonorisée</span>
              </div>
              <div className="flex items-center space-x-3">
                <Music className="w-5 h-5 text-white/90" />
                <span>Plus de 60 000 titres disponibles</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-white/90" />
                <span>Capacité de 3 à 15 personnes</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-white/90" />
                <span>Ouvert 7j/7</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-white/90" />
                <span>De 10h à minuit</span>
              </div>
            </div>

            {/* Moyens de paiement */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Moyens de paiement acceptés</h3>
              <div className="grid gap-3">
                <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <CreditCard className="w-5 h-5 text-white mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Carte bancaire</p>
                    <p className="text-xs text-white/80">Paiement sécurisé</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <CreditCard className="w-5 h-5 text-white mr-3" />
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