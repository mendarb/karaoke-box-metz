import { DashboardLayout } from "@/components/admin/dashboard/DashboardLayout";
import { AnalyticsContent } from "@/components/admin/analytics/AnalyticsContent";

export const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <AnalyticsContent />
      </div>
    </DashboardLayout>
  );
};