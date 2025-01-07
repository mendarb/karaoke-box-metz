import { UseFormReturn } from "react-hook-form";
import { SearchBar } from "./user-selection/SearchBar";
import { useState } from "react";
import { useUserSearch } from "./user-selection/useUserSearch";

interface UserSelectionProps {
  form: UseFormReturn<any>;
  onUserSelected?: () => void;
  onSearchStart?: () => void;
}

export const UserSelection = ({ form, onUserSelected, onSearchStart }: UserSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchResults, isSearching, searchUser } = useUserSearch(form);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 2) {
      if (onSearchStart) onSearchStart();
      searchUser(value);
    }
  };

  const handleUserSelect = (user: any) => {
    form.setValue("email", user.user_email);
    form.setValue("fullName", user.user_name);
    form.setValue("phone", user.user_phone);
    form.setValue("userId", user.id);
    if (onUserSelected) onUserSelected();
  };

  return (
    <div className="space-y-4">
      <SearchBar
        searchEmail={searchTerm}
        isSearching={isSearching}
        onSearchChange={handleSearch}
      />
      
      {searchResults && searchResults.length > 0 && searchTerm && (
        <div className="border rounded-lg divide-y">
          {searchResults.map((user) => (
            <div
              key={user.user_email}
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => handleUserSelect(user)}
            >
              <div className="font-medium">{user.user_name}</div>
              <div className="text-sm text-gray-500">{user.user_email}</div>
              {user.user_phone && (
                <div className="text-sm text-gray-500">{user.user_phone}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {searchTerm && searchResults && searchResults.length === 0 && !isSearching && (
        <p className="text-sm text-gray-500">Aucun résultat trouvé</p>
      )}
    </div>
  );
};