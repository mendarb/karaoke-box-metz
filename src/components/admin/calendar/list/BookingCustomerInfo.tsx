import { Mail, Phone, User } from "lucide-react";

interface BookingCustomerInfoProps {
  name: string;
  email: string;
  phone: string;
}

export const BookingCustomerInfo = ({ 
  name, 
  email, 
  phone 
}: BookingCustomerInfoProps) => {
  return (
    <div className="space-y-1 min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-violet-500 shrink-0" />
        <p className="font-medium truncate">{name}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Mail className="h-4 w-4 shrink-0" />
        <a href={`mailto:${email}`} className="hover:text-violet-500 truncate">
          {email}
        </a>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Phone className="h-4 w-4 shrink-0" />
        <a href={`tel:${phone}`} className="hover:text-violet-500">
          {phone}
        </a>
      </div>
    </div>
  );
};