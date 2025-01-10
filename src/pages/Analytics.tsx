import { DashboardLayout } from "@/components/admin/dashboard/DashboardLayout";
import { AnalyticsContent } from "@/components/admin/analytics/AnalyticsContent";

export const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-[1200px]">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Analyses et statistiques détaillées</p>
        </div>
        <AnalyticsContent />
      </div>
    </DashboardLayout>
  );
};