import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, UserPlus, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClientSelectionProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

export const ClientSelection = ({ form, onNext }: ClientSelectionProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [existingClients, setExistingClients] = useState<any[]>([]);
  const [mode, setMode] = useState<"search" | "create">("search");
  const { toast } = useToast();

  const searchClients = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un terme de recherche",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      // Recherche dans les réservations existantes
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('user_name, user_phone, user_email, user_id')
        .or(`user_email.ilike.%${searchTerm}%,user_name.ilike.%${searchTerm}%,user_phone.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Recherche dans les profils
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, phone')
        .or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);

      if (profilesError) throw profilesError;

      // Fusionner et dédupliquer les résultats
      const bookingClients = bookingsData?.map(booking => ({
        user_id: booking.user_id,
        user_email: booking.user_email,
        user_name: booking.user_name,
        user_phone: booking.user_phone,
        source: 'booking'
      })) || [];

      const profileClients = profilesData?.map(profile => ({
        user_id: profile.id,
        user_email: profile.email,
        user_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        user_phone: profile.phone,
        source: 'profile'
      })) || [];

      const allClients = [...bookingClients, ...profileClients];
      
      // Dédupliquer par email
      const uniqueClients = allClients.reduce((acc: any[], current) => {
        const exists = acc.find(client => 
          client.user_email === current.user_email || 
          (client.user_phone && client.user_phone === current.user_phone)
        );
        if (!exists && (current.user_email || current.user_phone)) {
          acc.push(current);
        }
        return acc;
      }, []);

      setExistingClients(uniqueClients);

      if (uniqueClients.length === 0) {
        toast({
          title: "Aucun résultat",
          description: "Aucun client trouvé avec ces critères",
        });
      }
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
    form.setValue("email", searchTerm);
    form.setValue("fullName", "");
    form.setValue("phone", "");
    form.setValue("userId", null);
    setMode("create");
  };

  const handleSubmitNew = () => {
    const email = form.getValues("email");
    const fullName = form.getValues("fullName");
    const phone = form.getValues("phone");

    if (!email || !fullName || !phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
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
          placeholder="Rechercher par email, nom ou téléphone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchClients()}
          className="flex-1"
        />
        <Button 
          onClick={searchClients}
          disabled={isSearching || !searchTerm}
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
                    {client.user_phone && (
                      <div className="text-sm text-gray-500">{client.user_phone}</div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : searchTerm && !isSearching && (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-4">Aucun client trouvé</p>
          <Button onClick={handleCreateNew}>
            <UserPlus className="h-4 w-4 mr-2" />
            Créer un nouveau client
          </Button>
        </div>
      )}
    </div>
  );
};