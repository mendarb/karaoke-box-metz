import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  capacity: z.string().min(1, "La capacité est requise"),
  base_price_per_hour: z.string().min(1, "Le prix de base est requis"),
  status: z.enum(["active", "maintenance", "inactive"]),
});

type KaraokeBoxDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  box?: any;
};

export const KaraokeBoxDialog = ({
  open,
  onOpenChange,
  box,
}: KaraokeBoxDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: box?.name || "",
      description: box?.description || "",
      capacity: box?.capacity?.toString() || "",
      base_price_per_hour: box?.base_price_per_hour?.toString() || "",
      status: box?.status || "active",
    },
  });

  const { mutate: saveBox, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const data = {
        ...values,
        capacity: parseInt(values.capacity),
        base_price_per_hour: parseFloat(values.base_price_per_hour),
      };

      if (box) {
        const { error } = await supabase
          .from("karaoke_boxes")
          .update(data)
          .eq("id", box.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("karaoke_boxes").insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["karaoke-boxes"] });
      toast.success(
        box ? "Box mise à jour avec succès" : "Box créée avec succès"
      );
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(
        "Une erreur est survenue lors de l'enregistrement de la box"
      );
      console.error("Error saving box:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    saveBox(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {box ? "Modifier la box" : "Nouvelle box"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacité (personnes)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="base_price_per_hour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix de base par heure (€)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};