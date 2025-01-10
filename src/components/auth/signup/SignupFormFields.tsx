import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SignupFormFieldsProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  phoneCountryCode: string;
  setPhoneCountryCode: (value: string) => void;
  isLoading: boolean;
}

const COUNTRY_CODES = [
  { value: '+33', label: '🇫🇷 +33' },
  { value: '+32', label: '🇧🇪 +32' },
  { value: '+352', label: '🇱🇺 +352' },
  { value: '+41', label: '🇨🇭 +41' },
];

export function SignupFormFields({
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  phone,
  setPhone,
  phoneCountryCode,
  setPhoneCountryCode,
  isLoading
}: SignupFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">Nom complet *</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="Jean Dupont"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="votre@email.com"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe *</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          minLength={6}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone *</Label>
        <div className="flex gap-2">
          <Select
            value={phoneCountryCode}
            onValueChange={setPhoneCountryCode}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Indicatif" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_CODES.map((code) => (
                <SelectItem key={code.value} value={code.value}>
                  {code.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="06 12 34 56 78"
            disabled={isLoading}
            className="flex-1"
          />
        </div>
      </div>
    </>
  )
}