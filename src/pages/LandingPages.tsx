import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { LandingPagesTable } from "@/components/admin/landing-pages/LandingPagesTable";

export const LandingPages = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <LandingPagesTable />
      </div>
    </DashboardLayout>
  );
};