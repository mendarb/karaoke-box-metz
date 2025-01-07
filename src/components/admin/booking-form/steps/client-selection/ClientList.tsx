import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";
import { ClientResult } from "./types";

interface ClientListProps {
  clients: ClientResult[];
  onSelectClient: (client: ClientResult) => void;
}

export const ClientList = ({ clients, onSelectClient }: ClientListProps) => {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2">
        {clients.map((client, index) => (
          <Card
            key={index}
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onSelectClient(client)}
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
  );
};