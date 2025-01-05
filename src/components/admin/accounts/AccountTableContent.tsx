import { TableBody } from "@/components/ui/table";
import { AccountTableRow } from "./AccountTableRow";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
}

interface AccountTableContentProps {
  profiles: UserProfile[];
}

export const AccountTableContent = ({ profiles }: AccountTableContentProps) => {
  if (profiles.length === 0) {
    return (
      <TableBody>
        <tr>
          <td colSpan={4} className="text-center text-muted-foreground p-4">
            Aucun compte utilisateur trouvé
          </td>
        </tr>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {profiles.map((profile) => (
        <AccountTableRow key={profile.id} profile={profile} />
      ))}
    </TableBody>
  );
};