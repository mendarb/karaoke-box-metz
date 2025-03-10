import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AuthForm } from "./AuthForm"
import { Helmet } from "react-helmet"

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <>
      <Helmet>
        <meta name="google-signin-client_id" content="your-client-id.apps.googleusercontent.com" />
        <meta name="google" content="notranslate" />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px] p-6 bg-white shadow-lg">
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
    </>
  )
}

export default AuthModal