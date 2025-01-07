import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchEmail: string;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchBar = ({ 
  searchEmail, 
  isSearching, 
  onSearchChange, 
  onSearch 
}: SearchBarProps) => {
  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Rechercher par email, nom ou téléphone"
        value={searchEmail}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <Button 
        onClick={onSearch}
        disabled={isSearching}
        variant="outline"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};