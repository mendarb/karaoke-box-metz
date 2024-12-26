import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"

interface AuthFormProps {
  onClose: () => void;
  isLogin: boolean;
  onToggleMode: () => void;
}

export function AuthForm({ onClose, isLogin, onToggleMode }: AuthFormProps) {
  return isLogin ? (
    <LoginForm onToggleMode={onToggleMode} onSuccess={onClose} />
  ) : (
    <SignupForm onToggleMode={onToggleMode} onSuccess={onClose} />
  )
}