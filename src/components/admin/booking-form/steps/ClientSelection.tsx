import { UseFormReturn } from "react-hook-form";
import { UserSelection } from "../UserSelection";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ClientList } from "./client-selection/ClientList";
import { useClientSearch } from "./client-selection/useClientSearch";
import { ClientResult } from "./client-selection/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClientSelectionProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

export const ClientSelection = ({ form, onNext }: ClientSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { existingClients, isSearching, searchClients } = useClientSearch();

  const handleNext = () => {
    if (form.getValues("email")) {
      onNext();
    }
  };

  const handleClientSelect = (client: ClientResult) => {
    form.setValue("email", client.user_email);
    form.setValue("fullName", client.user_name);
    form.setValue("phone", client.user_phone || "");
  };

  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);
    await searchClients(value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Sélection du client</h2>
        <UserSelection 
          form={form}
          onSearchChange={handleSearchChange}
        />
        
        <ScrollArea className="h-[300px]">
          {existingClients && existingClients.length > 0 && (
            <ClientList 
              clients={existingClients}
              onSelectClient={handleClientSelect}
            />
          )}
        </ScrollArea>
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