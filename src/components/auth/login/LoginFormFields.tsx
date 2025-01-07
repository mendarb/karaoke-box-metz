import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useIsMobile } from "@/hooks/use-mobile"

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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
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
          <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            minLength={6}
            disabled={isLoading}
            className={`h-12 rounded-xl bg-gray-50 border-gray-200 ${isMobile ? 'text-base' : ''}`}
          />
        </div>
      )}
    </div>
  );
}