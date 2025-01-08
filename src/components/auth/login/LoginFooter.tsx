import { Button } from "@/components/ui/button"

interface LoginFooterProps {
  showResetPassword: boolean;
  setShowResetPassword: (show: boolean) => void;
  onToggleMode: () => void;
  isLoading: boolean;
}

export function LoginFooter({
  showResetPassword,
  setShowResetPassword,
  onToggleMode,
  isLoading
}: LoginFooterProps) {
  return (
    <div className="flex flex-col space-y-4 text-center">
      <Button
        type="button"
        variant="link"
        className="text-base text-gray-600 hover:text-gray-900 font-normal"
        onClick={() => setShowResetPassword(!showResetPassword)}
        disabled={isLoading}
      >
        {showResetPassword ? "Retour à la connexion" : "Mot de passe oublié ?"}
      </Button>
      <div className="text-base text-gray-600">
        Pas encore de compte ?{" "}
        <Button
          type="button"
          variant="link"
          className="text-kbox-coral hover:text-kbox-orange-dark font-normal p-0"
          onClick={onToggleMode}
          disabled={isLoading}
        >
          Créer un compte
        </Button>
      </div>
    </div>
  );
}