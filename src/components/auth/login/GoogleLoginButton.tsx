import { Button } from "@/components/ui/button"

interface GoogleLoginButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function GoogleLoginButton({ onClick, isLoading }: GoogleLoginButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-12 text-base rounded-xl border-2 border-white/30 bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
      onClick={onClick}
      disabled={isLoading}
    >
      <img src="/google.svg" alt="Google" className="w-5 h-5 mr-3" />
      Continuer avec Google
    </Button>
  );
}