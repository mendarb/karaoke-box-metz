import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const PasswordSection = () => {
  const { toast } = useToast();

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

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Modifier votre mot de passe</h3>
      <Button 
        variant="outline" 
        onClick={handleResetPassword}
      >
        Recevoir un lien de modification
      </Button>
    </div>
  );
};