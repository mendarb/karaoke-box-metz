import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

export const useKaraokeBoxForm = (box: any, onSuccess: () => void) => {
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
      toast.success(box ? "Box mise à jour avec succès" : "Box créée avec succès");
      onSuccess();
    },
    onError: (error) => {
      console.error("Error saving box:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement de la box");
    },
  });

  return { form, saveBox, isPending };
};