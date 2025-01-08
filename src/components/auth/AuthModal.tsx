import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
        ${isMobile ? 'h-[100vh] w-full mt-0 rounded-none' : 'rounded-[24px] border-0 shadow-none'}
      `}>
        <div className={`p-0 h-full flex flex-col`}>
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold">
              {isLogin ? "Connectez-vous" : "Créez votre compte"}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {isLogin 
                ? "Accédez à votre espace pour gérer vos réservations"
                : "Rejoignez-nous pour profiter d'une expérience unique"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
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