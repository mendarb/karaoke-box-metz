import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface CreateClientFormProps {
  form: UseFormReturn<any>;
  onBack: () => void;
  onSubmit: () => void;
}

export const CreateClientForm = ({ form, onBack, onSubmit }: CreateClientFormProps) => {
  return (
    <div className="space-y-4">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
      >
        ← Retour à la recherche
      </Button>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            {...form.register("email")}
            type="email"
            required
            placeholder="email@exemple.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Nom complet</label>
          <Input
            {...form.register("fullName")}
            required
            placeholder="Jean Dupont"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <Input
            {...form.register("phone")}
            required
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      <Button onClick={onSubmit} className="w-full">
        Continuer
      </Button>
    </div>
  );
};