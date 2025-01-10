import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookingForm } from "@/components/BookingForm";

interface BookingSectionProps {
  user: any;
  onShowAuth: () => void;
}

const BookingSection = ({ user, onShowAuth }: BookingSectionProps) => {
  const isMobile = useIsMobile();
  
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

  return (
    <div className="flex flex-col bg-white mobile-scroll min-h-[60vh]">
      <div className={`flex-1 flex flex-col p-6 ${isMobile ? 'safe-top' : ''}`}>
        {user ? (
          <BookingForm />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center">
            <div className="rounded-full bg-violet-100 p-3 mb-2">
              <LogIn className="h-6 w-6 text-violet-600" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Connectez-vous pour réserver
              </h2>
              <p className="text-gray-600 text-sm max-w-sm mb-6">
                Pour effectuer une réservation et profiter de notre box karaoké, vous devez être connecté à votre compte.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button 
                onClick={handleGoogleLogin}
                variant="outline"
                className="mobile-button bg-white"
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
                <span className="ml-2">Continuer avec Google</span>
              </Button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Ou</span>
                </div>
              </div>
              <Button 
                onClick={onShowAuth}
                className="mobile-button bg-violet-600 hover:bg-violet-700 text-white"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter / S'inscrire
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSection;