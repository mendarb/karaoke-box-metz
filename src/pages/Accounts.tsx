import { DashboardLayout } from "@/components/admin/dashboard/DashboardLayout";
import { AccountsTable } from "@/components/admin/accounts/AccountsTable";

export const Accounts = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-2xl font-semibold">Gestion des comptes</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les comptes utilisateurs et leurs informations
          </p>
        </div>
        <AccountsTable />
      </div>
    </DashboardLayout>
  );
};