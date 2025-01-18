import { DashboardLayout } from "@/components/admin/dashboard/DashboardLayout";
import { KaraokeBoxesTable } from "./KaraokeBoxesTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { KaraokeBoxDialog } from "./KaraokeBoxDialog";

export const KaraokeBoxesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-[1200px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Boxes Karaoké</h1>
            <p className="text-gray-600">Gérez vos boxes karaoké</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Box
          </Button>
        </div>

        <KaraokeBoxesTable />
        
        <KaraokeBoxDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};