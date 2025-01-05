import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LandingPageRenderer } from "@/components/landing-pages/LandingPageRenderer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";

export const LandingPage = () => {
  const { slug } = useParams();
  const { toast } = useToast();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ["landing-page", slug],
    queryFn: async () => {
      console.log("Fetching landing page for slug:", slug);
      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .is("deleted_at", null)
        .single();

      if (error) {
        console.error("Error fetching landing page:", error);
        throw error;
      }

      console.log("Fetched landing page:", data);
      return data;
    },
    // Options pour forcer le rechargement lors du changement de slug
    refetchOnWindowFocus: false,
    enabled: !!slug,
    staleTime: 0,
    gcTime: 0 // Remplacé cacheTime par gcTime
  });

  if (error) {
    console.error("Error in landing page component:", error);
    toast({
      title: "Erreur",
      description: "Impossible de charger la page",
      variant: "destructive",
    });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Page non trouvée</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Page non trouvée</h1>
      </div>
    );
  }

  return <LandingPageRenderer page={page} />;
};