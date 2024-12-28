import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFormProps {
  newEmail: string;
  setNewEmail: (email: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const EmailForm = ({
  newEmail,
  setNewEmail,
  isLoading,
  onSubmit,
  onCancel,
}: EmailFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="new-email">Nouvel email</Label>
        <Input
          id="new-email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="nouveau@email.com"
          required
          disabled={isLoading}
        />
      </div>
      <div className="flex space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Envoi en cours..." : "Confirmer"}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
};