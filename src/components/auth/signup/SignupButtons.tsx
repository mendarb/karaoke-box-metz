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
        className={`w-full h-12 text-base rounded-xl bg-[#7F56D9] hover:bg-[#7F56D9]/90
          transition-all duration-200 font-medium ${isMobile ? 'text-lg' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? "Chargement..." : "Continuer"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">ou inscrivez-vous avec</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl border border-gray-200"
          onClick={handleGoogleSignup}
          disabled={isLoading}
        >
          <img src="/google.svg" alt="Google" className="w-5 h-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl border border-gray-200"
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl border border-gray-200"
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </Button>
      </div>
    </div>
  )
}