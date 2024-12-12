import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const EmailSection = () => {
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const { error } = await supabase.auth.updateUser({ 
      email: newEmail 
    }, {
      emailRedirectTo: `${window.location.origin}/account/security`
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'email",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Email envoyé",
      description: "Vérifiez votre boîte mail pour confirmer le changement d'email",
    });
    
    setShowEmailInput(false);
    setNewEmail("");
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Modifier votre email</h3>
      {showEmailInput ? (
        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <div>
            <Label htmlFor="new-email">Nouvel email</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nouveau@email.com"
              required
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit">
              Confirmer
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setShowEmailInput(false);
                setNewEmail("");
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setShowEmailInput(true)}
        >
          Changer d'email
        </Button>
      )}
    </div>
  );
};