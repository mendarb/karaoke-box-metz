import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactInfoSettings } from "./site-settings/ContactInfoSettings";
import { BusinessHoursSettings } from "./site-settings/BusinessHoursSettings";
import { LegalPagesSettings } from "./site-settings/LegalPagesSettings";

export const SiteSettingsForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;
      
      const settingsMap = data.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});

      return settingsMap;
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      // Update each settings category
      for (const [key, value] of Object.entries(values)) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value }, { onConflict: 'key' });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: "Succès",
        description: "Les paramètres ont été enregistrés",
      });
    },
    onError: (error) => {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="contact" className="w-full">
          <TabsList>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="hours">Horaires</TabsTrigger>
            <TabsTrigger value="legal">Pages légales</TabsTrigger>
          </TabsList>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactInfoSettings form={form} defaultValues={settings?.contact_info} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Horaires d'ouverture</CardTitle>
              </CardHeader>
              <CardContent>
                <BusinessHoursSettings form={form} defaultValues={settings?.business_hours} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal">
            <Card>
              <CardHeader>
                <CardTitle>Pages légales</CardTitle>
              </CardHeader>
              <CardContent>
                <LegalPagesSettings form={form} defaultValues={settings?.legal_pages} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button type="submit" className="w-full">
          Enregistrer les modifications
        </Button>
      </form>
    </Form>
  );
};