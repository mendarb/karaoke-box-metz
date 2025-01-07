import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface SearchBarProps {
  searchEmail: string;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
}

export const SearchBar = ({ 
  searchEmail, 
  isSearching, 
  onSearchChange 
}: SearchBarProps) => {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Rechercher par email, nom ou téléphone"
        value={searchEmail}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pr-10"
      />
      {isSearching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  );
};