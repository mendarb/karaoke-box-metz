import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { AccountsTable } from "@/components/admin/accounts/AccountsTable";

export const Accounts = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des comptes</h1>
        <AccountsTable />
      </div>
    </DashboardLayout>
  );
};