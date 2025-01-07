import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { SearchForm } from "./client-selection/SearchForm";
import { ClientList } from "./client-selection/ClientList";
import { CreateClientForm } from "./client-selection/CreateClientForm";
import { useClientSearch } from "./client-selection/useClientSearch";
import type { ClientResult } from "./client-selection/types";

interface ClientSelectionProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

export const ClientSelection = ({ form, onNext }: ClientSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState<"search" | "create">("search");
  const { toast } = useToast();
  const { isSearching, existingClients, searchClients } = useClientSearch();

  const handleSearch = () => {
    searchClients(searchTerm);
  };

  const selectClient = (client: ClientResult) => {
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
      <CreateClientForm
        form={form}
        onBack={() => setMode("search")}
        onSubmit={handleSubmitNew}
      />
    );
  }

  return (
    <div className="space-y-4">
      <SearchForm
        searchTerm={searchTerm}
        isSearching={isSearching}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
      />

      {existingClients.length > 0 ? (
        <ClientList
          clients={existingClients}
          onSelectClient={selectClient}
        />
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