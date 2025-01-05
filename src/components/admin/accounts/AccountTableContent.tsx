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
          <td colSpan={4} className="py-8 text-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <p>Aucun compte utilisateur trouvé</p>
              <p className="text-sm">Les comptes utilisateurs s'afficheront ici une fois créés</p>
            </div>
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