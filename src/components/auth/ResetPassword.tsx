import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le mot de passe",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Succès",
      description: "Votre mot de passe a été mis à jour",
    });
    
    navigate("/account/security");
    setIsLoading(false);
  };

  return (
    <div className="container max-w-md mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Réinitialisation du mot de passe</h1>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Chargement..." : "Mettre à jour le mot de passe"}
          </Button>
        </form>
      </Card>
    </div>
  );
};