import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

interface SearchFormProps {
  searchTerm: string;
  isSearching: boolean;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchForm = ({
  searchTerm,
  isSearching,
  onSearchTermChange,
  onSearch,
}: SearchFormProps) => {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Rechercher par email, nom ou téléphone"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        className="flex-1"
      />
      <Button 
        onClick={onSearch}
        disabled={isSearching || !searchTerm}
      >
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};