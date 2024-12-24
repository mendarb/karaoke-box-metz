import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"

interface AuthFormProps {
  onClose: () => void;
  isLogin: boolean;
  onToggleMode: () => void;
}

export function AuthForm({ onClose, isLogin, onToggleMode }: AuthFormProps) {
  const handleSuccess = () => {
    onClose()
  }

  return isLogin ? (
    <LoginForm onToggleMode={onToggleMode} />
  ) : (
    <SignupForm onToggleMode={onToggleMode} />
  )
}