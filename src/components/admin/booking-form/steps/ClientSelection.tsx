import { UseFormReturn } from "react-hook-form";
import { UserSelection } from "../UserSelection";
import { CreateClientForm } from "../client-selection/CreateClientForm";

interface ClientSelectionProps {
  form: UseFormReturn<any>;
  onNext: () => void;
  clientType: 'existing' | 'new';
}

export const ClientSelection = ({ form, onNext, clientType }: ClientSelectionProps) => {
  return (
    <div className="space-y-6">
      {clientType === 'existing' ? (
        <UserSelection 
          form={form} 
          onUserSelected={onNext}
        />
      ) : (
        <CreateClientForm 
          form={form}
          onSubmit={onNext}
        />
      )}
    </div>
  );
};