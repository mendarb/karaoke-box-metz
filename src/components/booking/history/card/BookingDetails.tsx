import { Users, Euro } from "lucide-react";

interface BookingDetailsProps {
  groupSize: string;
  price: number;
}

export const BookingDetails = ({ groupSize, price }: BookingDetailsProps) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-violet-500" />
        <span className="text-gray-600 dark:text-gray-400">
          {groupSize} {parseInt(groupSize) > 1 ? 'personnes' : 'personne'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Euro className="h-4 w-4 text-violet-500" />
        <span className="text-gray-600 dark:text-gray-400">{price}€</span>
      </div>
    </div>
  );
};