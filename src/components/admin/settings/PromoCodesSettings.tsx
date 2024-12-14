import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PromoCodeDialog } from "./promo-codes/PromoCodeDialog";
import { DeletePromoCodeDialog } from "./promo-codes/DeletePromoCodeDialog";

export const PromoCodesSettings = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: promoCodes, refetch } = useQuery({
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
    setIsDialogOpen(true);
  };

  const handleDelete = (code: any) => {
    setSelectedCode(code);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Codes promo</CardTitle>
        <CardDescription>Gérez vos codes promotionnels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button onClick={() => setIsDialogOpen(true)}>
            Ajouter un code promo
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Utilisations</TableHead>
                <TableHead>Validité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes?.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-medium">{code.code}</TableCell>
                  <TableCell>
                    {code.type === 'percentage' ? 'Pourcentage' : 
                     code.type === 'fixed_amount' ? 'Montant fixe' : 
                     'Gratuit'}
                  </TableCell>
                  <TableCell>
                    {code.type === 'percentage' ? `${code.value}%` :
                     code.type === 'fixed_amount' ? `${code.value}€` :
                     'Gratuit'}
                  </TableCell>
                  <TableCell>
                    {code.current_uses}/{code.max_uses || '∞'}
                  </TableCell>
                  <TableCell>
                    {code.start_date && (
                      <span>
                        Du {format(new Date(code.start_date), 'dd/MM/yyyy', { locale: fr })}
                      </span>
                    )}
                    {code.end_date && (
                      <span>
                        {' '}au {format(new Date(code.end_date), 'dd/MM/yyyy', { locale: fr })}
                      </span>
                    )}
                    {!code.start_date && !code.end_date && 'Pas de limite'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={code.is_active ? "default" : "secondary"}>
                      {code.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(code)}
                      >
                        Modifier
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(code)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <PromoCodeDialog 
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedCode(null);
          }}
          promoCode={selectedCode}
          onSuccess={() => {
            refetch();
            setIsDialogOpen(false);
            setSelectedCode(null);
          }}
        />

        <DeletePromoCodeDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedCode(null);
          }}
          promoCode={selectedCode}
          onSuccess={() => {
            refetch();
            setIsDeleteDialogOpen(false);
            setSelectedCode(null);
          }}
        />
      </CardContent>
    </Card>
  );
};