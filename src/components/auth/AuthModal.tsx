import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
        ${isMobile ? 'h-[90vh] mt-auto rounded-t-[32px]' : 'rounded-[24px] border-0 shadow-none'}
      `}>
        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-2xl font-medium">
              {isLogin ? "Connexion" : "Créer un compte"}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-500">
              {isLogin 
                ? "Connectez-vous pour continuer"
                : "Déjà un compte ? "}
              {!isLogin && (
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-[#7F56D9] hover:underline"
                >
                  Connexion
                </button>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className={`${isMobile ? 'overflow-y-auto flex-1 -mx-4 px-4' : ''}`}>
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