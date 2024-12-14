import { DashboardSidebar } from "@/components/admin/DashboardSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BookingSettings } from "@/components/admin/settings/BookingSettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { PromoCodesSettings } from "@/components/admin/settings/PromoCodesSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const Settings = () => {
  const isMobile = useIsMobile();

  const renderContent = () => (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      <div className="grid gap-6">
        <BookingSettings />
        <PromoCodesSettings />
        <NotificationSettings />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center border-b p-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <DashboardSidebar />
            </SheetContent>
          </Sheet>
        </div>

        {renderContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <DashboardSidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          {renderContent()}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};