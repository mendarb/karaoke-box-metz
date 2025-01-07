import { Button } from "@/components/ui/button"

interface SignupFooterProps {
  onToggleMode: () => void;
  isLoading: boolean;
}

export function SignupFooter({ onToggleMode, isLoading }: SignupFooterProps) {
  return (
    <div className="text-center pt-4">
      <div className="text-sm text-gray-600">
        Déjà un compte ?{" "}
        <Button
          type="button"
          variant="link"
          className="text-kbox-coral hover:text-kbox-orange-dark font-medium p-0"
          onClick={onToggleMode}
          disabled={isLoading}
        >
          Se connecter
        </Button>
      </div>
    </div>
  );
}