import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SecuritySection = () => {
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleResetPassword = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le lien de réinitialisation",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Email envoyé",
      description: "Vérifiez votre boîte mail pour modifier votre mot de passe",
    });
  };

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
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Sécurité du compte</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Modifier votre mot de passe</h3>
          <Button 
            variant="outline" 
            onClick={handleResetPassword}
          >
            Recevoir un lien de modification
          </Button>
        </div>

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
      </div>
    </Card>
  );
};