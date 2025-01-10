import { useState } from "react";
import { BookingFormWrapper } from "@/components/booking/BookingFormWrapper";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUserState } from "@/hooks/useUserState";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";

export const BookingForm = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useUserState();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error("Erreur de connexion Google:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  };

  if (!user) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm border-none">
        <CardContent className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
          <h2 className="text-2xl font-semibold">Connectez-vous pour réserver</h2>
          <p className="text-gray-600 max-w-md">
            Pour effectuer une réservation et profiter de notre box karaoké, vous devez être connecté à votre compte.
          </p>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Button 
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-12 text-base"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuer avec Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Ou</span>
              </div>
            </div>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="w-full h-12 text-base bg-violet-600 hover:bg-violet-700"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Se connecter / S'inscrire
            </Button>
          </div>

          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="hidden md:block md:col-span-1 space-y-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Comment ça marche ?
          </h3>
          <div className="space-y-4 text-gray-600">
            <p>
              Réservez votre session de karaoké en quelques étapes simples :
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Renseignez vos coordonnées</li>
              <li>Choisissez votre date et créneau</li>
              <li>Sélectionnez la durée et le nombre de personnes</li>
              <li>Confirmez et payez votre réservation</li>
            </ol>
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-2">
                Première étape : Vos coordonnées
              </h4>
              <p className="text-sm">
                Nous avons besoin de vos informations pour vous contacter et vous envoyer la confirmation de réservation. Toutes vos données sont sécurisées et ne seront utilisées que dans le cadre de votre réservation.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="md:col-span-2">
        <BookingFormWrapper />
      </div>
    </div>
  );
};