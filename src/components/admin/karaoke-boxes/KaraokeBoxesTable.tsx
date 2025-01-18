import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { KaraokeBoxDialog } from "./KaraokeBoxDialog";
import { DeleteKaraokeBoxDialog } from "./DeleteKaraokeBoxDialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const KaraokeBoxesTable = () => {
  const [selectedBox, setSelectedBox] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: boxes, isLoading } = useQuery({
    queryKey: ["karaoke-boxes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("karaoke_boxes")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Capacité</TableHead>
              <TableHead>Prix de base/heure</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boxes?.map((box) => (
              <TableRow key={box.id}>
                <TableCell className="font-medium">{box.name}</TableCell>
                <TableCell>{box.capacity} personnes</TableCell>
                <TableCell>{box.base_price_per_hour}€</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      box.status === "active"
                        ? "success"
                        : box.status === "maintenance"
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {box.status === "active"
                      ? "Active"
                      : box.status === "maintenance"
                      ? "Maintenance"
                      : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBox(box);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBox(box);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <KaraokeBoxDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        box={selectedBox}
      />

      <DeleteKaraokeBoxDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        box={selectedBox}
      />
    </>
  );
};