import { DashboardLayout } from "@/components/admin/dashboard/DashboardLayout";
import { AccountsTable } from "@/components/admin/accounts/AccountsTable";
import { Users } from "lucide-react";

export const Accounts = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-[1200px]">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Comptes</h1>
          <p className="text-gray-600">Gérez les comptes utilisateurs et leurs informations</p>
        </div>
        <AccountsTable />
      </div>
    </DashboardLayout>
  );
};