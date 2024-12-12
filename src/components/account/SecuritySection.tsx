import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const SecuritySection = () => {
  const { toast } = useToast();

  const handleResetPassword = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/account?tab=security`,
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

  const handleUpdateEmail = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/account?tab=security`,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le lien de modification",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Email envoyé",
      description: "Vérifiez votre boîte mail pour modifier votre email",
    });
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
          <Button 
            variant="outline" 
            onClick={handleUpdateEmail}
          >
            Recevoir un lien de modification
          </Button>
        </div>
      </div>
    </Card>
  );
};