interface SignupFooterProps {
  onToggleMode: () => void;
  isLoading: boolean;
}

export function SignupFooter({ onToggleMode, isLoading }: SignupFooterProps) {
  return (
    <div className="text-center space-y-4">
      <p className="text-sm text-gray-500">
        En cliquant sur Créer un compte, vous acceptez nos{' '}
        <a href="/terms" className="text-[#7F56D9] hover:underline">
          Conditions d'utilisation
        </a>{' '}
        et notre{' '}
        <a href="/privacy" className="text-[#7F56D9] hover:underline">
          Politique de confidentialité
        </a>
      </p>
      <p className="text-sm text-gray-600">
        Déjà un compte ?{' '}
        <button
          type="button"
          onClick={onToggleMode}
          className="text-[#7F56D9] hover:underline font-medium"
          disabled={isLoading}
        >
          Connexion
        </button>
      </p>
    </div>
  )
}