import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, UserPlus, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClientSelectionProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

export const ClientSelection = ({ form, onNext }: ClientSelectionProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [existingClients, setExistingClients] = useState<any[]>([]);
  const [mode, setMode] = useState<"search" | "create">("search");
  const { toast } = useToast();

  const searchClients = async () => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('user_name, user_phone, user_email, user_id')
        .ilike('user_email', `%${searchEmail}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Dédupliquer les clients par email
      const uniqueClients = data?.reduce((acc: any[], current) => {
        const exists = acc.find(client => client.user_email === current.user_email);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      setExistingClients(uniqueClients || []);
    } catch (error) {
      console.error('Error searching clients:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher les clients",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const selectClient = (client: any) => {
    form.setValue("email", client.user_email);
    form.setValue("fullName", client.user_name);
    form.setValue("phone", client.user_phone);
    form.setValue("userId", client.user_id);
    onNext();
  };

  const handleCreateNew = () => {
    form.setValue("email", searchEmail);
    form.setValue("fullName", "");
    form.setValue("phone", "");
    form.setValue("userId", null);
    setMode("create");
  };

  const handleSubmitNew = () => {
    if (!form.getValues("email") || !form.getValues("fullName") || !form.getValues("phone")) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    onNext();
  };

  if (mode === "create") {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setMode("search")}
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
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet</label>
            <Input
              {...form.register("fullName")}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <Input
              {...form.register("phone")}
              required
            />
          </div>
        </div>

        <Button onClick={handleSubmitNew} className="w-full">
          Continuer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Rechercher un client par email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={searchClients}
          disabled={isSearching || !searchEmail}
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {existingClients.length > 0 ? (
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {existingClients.map((client, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => selectClient(client)}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">{client.user_name}</div>
                    <div className="text-sm text-gray-500">{client.user_email}</div>
                    <div className="text-sm text-gray-500">{client.user_phone}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : searchEmail && !isSearching && (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-4">Aucun client trouvé avec cet email</p>
          <Button onClick={handleCreateNew}>
            <UserPlus className="h-4 w-4 mr-2" />
            Créer un nouveau client
          </Button>
        </div>
      )}
    </div>
  );
};