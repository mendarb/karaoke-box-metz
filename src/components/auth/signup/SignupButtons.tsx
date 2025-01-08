import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

interface SignupButtonsProps {
  isLoading: boolean;
  handleGoogleSignup: () => Promise<void>;
}

export function SignupButtons({ isLoading, handleGoogleSignup }: SignupButtonsProps) {
  const isMobile = useIsMobile()

  return (
    <div className="space-y-6">
      <Button 
        type="submit" 
        className={`w-full h-12 text-base rounded-xl bg-kbox-coral hover:bg-kbox-orange-dark
          transition-all duration-200 font-medium ${isMobile ? 'text-lg' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? "Chargement..." : "Créer un compte"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">ou</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 text-base rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all duration-200 font-normal"
        onClick={handleGoogleSignup}
        disabled={isLoading}
      >
        <img src="/google.svg" alt="Google" className="w-5 h-5 mr-3" />
        Continuer avec Google
      </Button>
    </div>
  )
}