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
      <div className="text-left">
        <Label htmlFor="new-email">Nouvel email</Label>
        <Input
          id="new-email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="nouveau@email.com"
          required
          disabled={isLoading}
          className="bg-white/50 backdrop-blur-sm border-gray-200"
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          {isLoading ? "Envoi en cours..." : "Confirmer"}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="bg-white/50 backdrop-blur-sm border-gray-200"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
};