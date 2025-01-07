import { UseFormReturn } from "react-hook-form";
import { UserSelection } from "../UserSelection";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ClientList } from "./client-selection/ClientList";
import { useClientSearch } from "./client-selection/useClientSearch";

interface ClientSelectionProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

export const ClientSelection = ({ form, onNext }: ClientSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, isLoading } = useClientSearch(searchTerm);

  const handleNext = () => {
    if (form.getValues("email")) {
      onNext();
    }
  };

  const handleClientSelect = (client: any) => {
    form.setValue("email", client.user_email);
    form.setValue("fullName", client.user_name);
    form.setValue("phone", client.user_phone || "");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Sélection du client</h2>
        <UserSelection 
          form={form}
          onSearchChange={setSearchTerm}
        />
        
        {clients && clients.length > 0 && (
          <ClientList 
            clients={clients}
            onSelectClient={handleClientSelect}
          />
        )}
      </div>

      <Button 
        onClick={handleNext}
        disabled={!form.getValues("email")}
        className="w-full"
      >
        Suivant
      </Button>
    </div>
  );
};