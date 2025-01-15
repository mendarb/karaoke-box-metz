import { Mail, Phone } from "lucide-react";

interface CustomerInfoProps {
  name: string;
  email: string;
  phone: string;
}

export const CustomerInfo = ({ name, email, phone }: CustomerInfoProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Informations client</h3>
      <div className="space-y-1 text-sm">
        <p className="flex items-center">
          <span className="font-medium">{name}</span>
        </p>
        <p className="flex items-center">
          <Mail className="mr-2 h-4 w-4" />
          {email}
        </p>
        <p className="flex items-center">
          <Phone className="mr-2 h-4 w-4" />
          {phone}
        </p>
      </div>
    </div>
  );
};