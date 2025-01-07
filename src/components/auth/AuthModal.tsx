import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AuthForm } from "./AuthForm"

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

  useEffect(() => {
    if (isOpen) {
      setIsLogin(defaultMode === 'login');
    }
  }, [isOpen, defaultMode]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl">
            {isLogin ? "Connexion" : "Créer un compte"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {isLogin 
              ? "Connectez-vous à votre compte pour réserver"
              : "Créez un compte pour réserver votre box"
            }
          </DialogDescription>
        </DialogHeader>
        <AuthForm 
          onClose={onClose}
          isLogin={isLogin}
          onToggleMode={() => setIsLogin(!isLogin)}
        />
      </DialogContent>
    </Dialog>
  )
}