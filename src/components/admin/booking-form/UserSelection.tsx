import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { SearchBar } from "./user-selection/SearchBar";
import { UserDetails } from "./user-selection/UserDetails";
import { useUserSearch } from "./user-selection/useUserSearch";

interface UserSelectionProps {
  form: UseFormReturn<any>;
  onSearchChange: (value: string) => void;
}

export const UserSelection = ({ form, onSearchChange }: UserSelectionProps) => {
  const [searchEmail, setSearchEmail] = useState("");
  const { isSearching, userFound, searchUser } = useUserSearch(form);

  const handleSearchChange = (value: string) => {
    setSearchEmail(value);
    onSearchChange(value);
  };

  const handleSearch = () => {
    searchUser(searchEmail);
  };

  return (
    <div className="space-y-4">
      <SearchBar
        searchEmail={searchEmail}
        isSearching={isSearching}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
      />

      {userFound && <UserDetails form={form} />}
    </div>
  );
};