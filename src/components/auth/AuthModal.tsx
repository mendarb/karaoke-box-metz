import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AuthForm } from "./AuthForm"

export function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? "Connexion" : "Créer un compte"}
          </DialogTitle>
          <DialogDescription>
            {isLogin 
              ? "Connectez-vous à votre compte"
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