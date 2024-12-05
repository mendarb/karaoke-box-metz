import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
import { Checkbox } from "@/components/ui/checkbox";
import { PriceCalculator } from "./PriceCalculator";
import { useForm } from "react-hook-form";

export const BookingForm = () => {
  const { toast } = useToast();
  const [groupSize, setGroupSize] = useState("");
  const [duration, setDuration] = useState("");
  const form = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    toast({
      title: "Réservation envoyée !",
      description: "Nous vous contacterons sous 24 heures pour confirmer votre créneau.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Entrez votre nom complet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse e-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Entrez votre adresse e-mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de téléphone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Indiquez votre numéro de contact" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de réservation</FormLabel>
              <FormControl>
                <Input type="date" min={new Date().toISOString().split("T")[0]} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Créneau horaire</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez un créneau" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="10-12">10h - 12h</SelectItem>
                  <SelectItem value="14-16">14h - 16h</SelectItem>
                  <SelectItem value="18-20">18h - 20h</SelectItem>
                  <SelectItem value="20-22">20h - 22h</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="groupSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taille du groupe</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                setGroupSize(value);
              }}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la taille du groupe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1-3">1 à 3 personnes (30€/heure)</SelectItem>
                  <SelectItem value="4">4 personnes (40€/heure)</SelectItem>
                  <SelectItem value="5-10">5 à 10 personnes (50€/heure)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée de la réservation</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                setDuration(value);
              }}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez la durée" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 heure</SelectItem>
                  <SelectItem value="2">2 heures</SelectItem>
                  <SelectItem value="3">3 heures</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message ou demande spéciale (facultatif)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Exemple : Anniversaire, besoin d'une table supplémentaire"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  J'accepte les conditions générales et la politique d'annulation
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {groupSize && duration && <PriceCalculator groupSize={groupSize} duration={duration} />}

        <Button
          type="submit"
          className="w-full bg-karaoke-primary hover:bg-karaoke-accent transition-colors"
        >
          Réserver ma cabine
        </Button>
      </form>
    </Form>
  );
};