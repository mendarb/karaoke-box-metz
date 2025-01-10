import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PromoCodeDialog } from "./promo-codes/PromoCodeDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeletePromoCodeDialog } from "./promo-codes/DeletePromoCodeDialog";

export const PromoCodesSettings = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: promoCodes, isLoading } = useQuery({
    queryKey: ['promo-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (code: any) => {
    setSelectedCode(code);
    setShowDialog(true);
  };

  const handleDelete = (code: any) => {
    setSelectedCode(code);
    setShowDeleteDialog(true);
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-medium">Codes promo</h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos codes promo et leurs conditions d'utilisation
          </p>
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={() => {
              setSelectedCode(null);
              setShowDialog(true);
            }}
            size="sm"
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Nouveau code
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-20rem)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Utilisations</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes?.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="py-2 font-medium">{code.code}</TableCell>
                  <TableCell className="py-2">
                    {code.type === 'percentage' ? 'Pourcentage' : 'Montant fixe'}
                  </TableCell>
                  <TableCell className="py-2">
                    {code.value}
                    {code.type === 'percentage' ? '%' : '€'}
                  </TableCell>
                  <TableCell className="py-2">
                    {code.current_uses}
                    {code.max_uses ? `/${code.max_uses}` : ''}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(code)}
                        className="h-8 px-2"
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(code)}
                        className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <PromoCodeDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        promoCode={selectedCode}
      />

      <DeletePromoCodeDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        promoCode={selectedCode}
      />
    </Card>
  );
};