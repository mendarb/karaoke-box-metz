import { ReactNode, useState } from "react";
import { DashboardSidebar } from "../DashboardSidebar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Toggle */}
      <div className="fixed top-3 right-3 z-50 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0">
            <DashboardSidebar />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 overflow-auto">
        <main className="p-3 md:p-6 pb-20 md:pb-6">
          {title && (
            <h1 className="text-lg font-medium mb-4">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};