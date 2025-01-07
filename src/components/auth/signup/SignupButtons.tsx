import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { GoogleSignupButton } from "./GoogleSignupButton"

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

      <div className="space-y-4">
        <GoogleSignupButton 
          onClick={handleGoogleSignup}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}