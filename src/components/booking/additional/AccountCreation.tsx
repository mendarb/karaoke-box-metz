import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AccountCreationProps {
  isAuthenticated: boolean;
  form: any;
  userEmail: string;
}

export const AccountCreation = ({ isAuthenticated, form, userEmail }: AccountCreationProps) => {
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateAccountChange = (checked: boolean) => {
    if (isAuthenticated) return;
    
    setCreateAccount(checked);
    if (checked) {
      form.setValue('createAccount', true);
      form.setValue('password', password);
    } else {
      form.setValue('createAccount', false);
      form.setValue('password', '');
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="createAccount"
          checked={createAccount}
          onCheckedChange={handleCreateAccountChange}
        />
        <label
          htmlFor="createAccount"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Créer un compte avec mes informations pour gérer mes réservations
        </label>
      </div>

      {createAccount && (
        <div className="space-y-4 animate-fadeIn">
          <p className="text-sm text-gray-600">
            Un compte sera créé avec votre email : {userEmail}
          </p>
          <FormItem>
            <FormLabel>Mot de passe</FormLabel>
            <FormControl>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  form.setValue('password', e.target.value);
                }}
                placeholder="Choisissez un mot de passe"
                className="pr-10"
                minLength={6}
                required={createAccount}
              />
            </FormControl>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-violet-600 hover:text-violet-700"
            >
              {showPassword ? "Masquer" : "Afficher"} le mot de passe
            </button>
          </FormItem>
        </div>
      )}
    </div>
  );
};