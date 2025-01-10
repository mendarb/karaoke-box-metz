import { DashboardLayout } from "@/components/admin/dashboard/DashboardLayout";
import { AccountsTable } from "@/components/admin/accounts/AccountsTable";
import { Users } from "lucide-react";

export const Accounts = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-500" />
            <h1 className="text-base font-medium">Gestion des comptes</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Gérez les comptes utilisateurs et leurs informations
          </p>
        </div>
        <AccountsTable />
      </div>
    </DashboardLayout>
  );
};