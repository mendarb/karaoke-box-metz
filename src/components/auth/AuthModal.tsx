import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AuthForm } from "./AuthForm"

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Dialog>
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
          isLogin={isLogin}
          onToggleMode={() => setIsLogin(!isLogin)}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal