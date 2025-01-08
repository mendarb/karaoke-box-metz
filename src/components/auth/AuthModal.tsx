import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"
import { AuthForm } from "./AuthForm"
import { useIsMobile } from "@/hooks/use-mobile"

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = 'login'
}: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen) {
      setIsLogin(defaultMode === 'login');
    }
  }, [isOpen, defaultMode]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        sm:max-w-[400px] p-0 gap-0 bg-white
        ${isMobile ? 'h-[95vh] w-full mt-0 rounded-none' : 'rounded-[24px] border-0 shadow-none'}
      `}>
        <div className={`p-0 space-y-4 ${isMobile ? 'h-full' : ''}`}>
          <DialogHeader className="space-y-2 p-6 pb-0">
            <h1 className="text-2xl font-semibold text-gray-900 text-left">
              {isLogin ? "Connectez-vous" : "Créez votre compte"}
            </h1>
            <p className="text-base text-gray-500 text-left">
              {isLogin 
                ? "Pas encore de compte ? "
                : "Déjà un compte ? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-kbox-coral hover:underline font-medium"
              >
                {isLogin ? "Créer un compte" : "Se connecter"}
              </button>
            </p>
          </DialogHeader>
          <div className={`${isMobile ? 'h-full' : ''}`}>
            <AuthForm 
              onClose={onClose}
              isLogin={isLogin}
              onToggleMode={() => setIsLogin(!isLogin)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}