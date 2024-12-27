import { ReactNode } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { DashboardSidebar } from "../DashboardSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-40 flex items-center gap-2 border-b bg-background p-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[240px]">
              <DashboardSidebar />
            </SheetContent>
          </Sheet>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Dashboard Admin</h1>
        </div>
        <div className="p-4">
          {children}
        </div>
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
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};