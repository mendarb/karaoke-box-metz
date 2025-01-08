import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useIsMobile } from "@/hooks/use-mobile"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface SignupFormFieldsProps {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  isLoading: boolean;
}

export function SignupFormFields({
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  phone,
  setPhone,
  isLoading
}: SignupFormFieldsProps) {
  const isMobile = useIsMobile()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-base font-normal text-gray-700">Nom complet</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="John Doe"
          disabled={isLoading}
          className={`h-12 rounded-xl bg-gray-50 border-gray-200 ${isMobile ? 'text-base' : ''}`}
        />
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-base font-normal text-gray-700">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="+33 6 12 34 56 78"
          disabled={isLoading}
          className={`h-12 rounded-xl bg-gray-50 border-gray-200 ${isMobile ? 'text-base' : ''}`}
        />
      </div>

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
    </div>
  );
}