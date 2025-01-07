import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

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
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          className="pl-9"
          placeholder="Rechercher un utilisateur par email"
          value={searchEmail}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          aria-label="Email de l'utilisateur"
        />
      </div>
      <Button 
        onClick={onSearch}
        disabled={isSearching || !searchEmail}
        aria-label={isSearching ? "Recherche en cours..." : "Rechercher l'utilisateur"}
      >
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Rechercher"
        )}
      </Button>
    </div>
  );
};