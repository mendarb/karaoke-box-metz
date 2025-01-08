import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useIsMobile } from "@/hooks/use-mobile"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const phoneCountryCodes = [
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+32", country: "BE", flag: "🇧🇪" },
  { code: "+41", country: "CH", flag: "🇨🇭" },
  { code: "+352", country: "LU", flag: "🇱🇺" },
  { code: "+377", country: "MC", flag: "🇲🇨" },
]

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
  const [selectedCountryCode, setSelectedCountryCode] = useState("+33")

  const handlePhoneChange = (value: string) => {
    const cleanedValue = value.replace(/[^\d+]/g, '')
    setPhone(cleanedValue)
  }

  return (
    <div className="space-y-2.5">
      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="text-sm font-normal text-gray-700">Nom complet</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="John Doe"
          disabled={isLoading}
          className="h-11 rounded-xl bg-gray-50 border-gray-200"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-normal text-gray-700">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="votre@email.com"
          disabled={isLoading}
          className="h-11 rounded-xl bg-gray-50 border-gray-200"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-sm font-normal text-gray-700">Téléphone</Label>
        <div className="flex gap-2">
          <Select
            value={selectedCountryCode}
            onValueChange={setSelectedCountryCode}
          >
            <SelectTrigger className="w-[70px] h-11 rounded-xl bg-gray-50 border-gray-200">
              <SelectValue>
                {phoneCountryCodes.find(c => c.code === selectedCountryCode)?.flag}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {phoneCountryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <span className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.code}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            required
            placeholder="6 12 34 56 78"
            disabled={isLoading}
            className="h-11 rounded-xl bg-gray-50 border-gray-200 flex-1"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-normal text-gray-700">Mot de passe</Label>
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
            className="h-11 rounded-xl bg-gray-50 border-gray-200 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}