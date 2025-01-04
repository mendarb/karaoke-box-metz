import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBooking } from "@/hooks/useBookings";
import { toast } from "sonner";

interface AdminBookingFormProps {
  onClose: () => void;
}

export const AdminBookingForm: React.FC<AdminBookingFormProps> = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const createBookingMutation = useCreateBooking();

  const onSubmit = async (data: any) => {
    try {
      await createBookingMutation.mutateAsync(data);
      toast.success("Réservation créée avec succès");
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la création de la réservation");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" {...register("name", { required: true })} />
        {errors.name && <span className="text-red-500">Ce champ est requis</span>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email", { required: true })} />
        {errors.email && <span className="text-red-500">Ce champ est requis</span>}
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="datetime-local" {...register("date", { required: true })} />
        {errors.date && <span className="text-red-500">Ce champ est requis</span>}
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register("notes")} />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={createBookingMutation.isPending}>
          {createBookingMutation.isPending ? "Création..." : "Créer"}
        </Button>
      </div>
    </form>
  );
};