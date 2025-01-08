import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useIsMobile } from "@/hooks/use-mobile"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface LoginFormFieldsProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  isLoading: boolean;
  showResetPassword: boolean;
}

export function LoginFormFields({
  email,
  password,
  setEmail,
  setPassword,
  isLoading,
  showResetPassword
}: LoginFormFieldsProps) {
  const isMobile = useIsMobile();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base font-normal text-gray-700">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="votre@email.com"
          disabled={isLoading}
          className={`h-12 rounded-xl bg-gray-50 border-gray-200 ${isMobile ? 'text-base' : ''}`}
        />
      </div>
      {!showResetPassword && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-base font-normal text-gray-700">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              disabled={isLoading}
              className={`h-12 rounded-xl bg-gray-50 border-gray-200 ${isMobile ? 'text-base' : ''} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}