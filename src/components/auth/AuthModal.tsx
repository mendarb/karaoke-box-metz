import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AuthForm } from "./AuthForm"
import { useIsMobile } from "@/hooks/use-mobile"

export function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [isLogin, setIsLogin] = useState(true)
  const isMobile = useIsMobile()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        sm:max-w-[400px] 
        ${isMobile ? 'h-[90vh] p-0 rounded-t-xl rounded-b-none fixed bottom-0 mb-0' : ''}
      `}>
        <DialogHeader className={`${isMobile ? 'p-4 border-b' : ''}`}>
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
        <div className={isMobile ? 'p-4 overflow-y-auto flex-1' : ''}>
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