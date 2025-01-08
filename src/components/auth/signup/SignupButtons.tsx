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
        className={`w-full h-12 text-base rounded-xl bg-[#7F56D9] hover:bg-[#7F56D9]/90
          transition-all duration-200 font-medium ${isMobile ? 'text-lg' : ''}`}
        disabled={isLoading}
      >
        Continue
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">or sign up with</span>
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
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl border border-gray-200"
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
          </svg>
        </Button>
      </div>
    </div>
  )
}