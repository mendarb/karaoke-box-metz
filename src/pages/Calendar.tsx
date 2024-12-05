import { DashboardSidebar } from "@/components/admin/DashboardSidebar";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";

export const Calendar = () => {
  return (
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <DashboardSidebar />
        </ResizablePanel>
        
        <ResizablePanel defaultSize={80}>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Calendrier des réservations</h1>
            <div className="bg-card rounded-lg shadow-lg p-6">
              {/* Calendar content will be implemented in a future update */}
              <p className="text-muted-foreground">Le calendrier sera bientôt disponible.</p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};