import { Button } from "@/components/ui/button"

interface GoogleSignupButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function GoogleSignupButton({ onClick, isLoading }: GoogleSignupButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-12 text-base rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
      onClick={onClick}
      disabled={isLoading}
    >
      <img src="/google.svg" alt="Google" className="w-5 h-5 mr-3" />
      Continuer avec Google
    </Button>
  );
}