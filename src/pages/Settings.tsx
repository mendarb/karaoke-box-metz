import { DashboardSidebar } from "@/components/admin/DashboardSidebar";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { BookingSettings } from "@/components/admin/settings/BookingSettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";

export const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <DashboardSidebar />
        </ResizablePanel>
        
        <ResizablePanel defaultSize={80}>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
            <div className="grid gap-6 md:grid-cols-2">
              <BookingSettings />
              <NotificationSettings />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};