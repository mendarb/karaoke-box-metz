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
      <DialogContent className={`sm:max-w-[400px] p-4 sm:p-6 ${isMobile ? 'h-[90vh] mt-auto rounded-t-xl' : ''}`}>
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            {isLogin ? "Connexion" : "Créer un compte"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {isLogin 
              ? "Connectez-vous à votre compte pour réserver"
              : "Créez un compte pour réserver votre box"
            }
          </DialogDescription>
        </DialogHeader>
        <div className={`${isMobile ? 'overflow-y-auto flex-1 -mx-4 px-4' : ''}`}>
          <AuthForm 
            onClose={onClose}
            isLogin={isLogin}
            onToggleMode={() => setIsLogin(!isLogin)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}