import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { SearchBar } from "./user-selection/SearchBar";
import { UserDetails } from "./user-selection/UserDetails";
import { useUserSearch } from "./user-selection/useUserSearch";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserSelectionProps {
  form: UseFormReturn<any>;
  onSearchChange: (value: string) => void;
}

export const UserSelection = ({ form, onSearchChange }: UserSelectionProps) => {
  const [searchEmail, setSearchEmail] = useState("");
  const { isSearching, userFound, searchResults, searchUser } = useUserSearch(form);

  const handleSearchChange = (value: string) => {
    setSearchEmail(value);
    onSearchChange(value);
  };

  const handleSearch = () => {
    searchUser(searchEmail);
  };

  const handleSelectUser = (user: any) => {
    form.setValue("email", user.user_email);
    form.setValue("fullName", user.user_name);
    form.setValue("phone", user.user_phone || "");
  };

  return (
    <div className="space-y-4">
      <SearchBar
        searchEmail={searchEmail}
        isSearching={isSearching}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
      />

      {searchResults && searchResults.length > 0 && (
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {searchResults.map((user, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleSelectUser(user)}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">{user.user_name}</div>
                    <div className="text-sm text-gray-500">{user.user_email}</div>
                    {user.user_phone && (
                      <div className="text-sm text-gray-500">{user.user_phone}</div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {userFound && <UserDetails form={form} />}
    </div>
  );
};