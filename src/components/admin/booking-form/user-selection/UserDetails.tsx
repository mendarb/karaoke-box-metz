import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface UserDetailsProps {
  form: UseFormReturn<any>;
}

export const UserDetails = ({ form }: UserDetailsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          {...form.register("email")}
          disabled
          className="bg-gray-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Nom complet</label>
        <Input
          {...form.register("fullName")}
          disabled
          className="bg-gray-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Téléphone</label>
        <Input
          {...form.register("phone")}
          disabled
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};