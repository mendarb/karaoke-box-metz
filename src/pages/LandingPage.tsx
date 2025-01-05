import { useParams, Navigate } from "react-router-dom";
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
      
      if (!slug) {
        throw new Error("No slug provided");
      }

      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .is("deleted_at", null)
        .maybeSingle();

      if (error) {
        console.error("Error fetching landing page:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Landing page not found");
      }

      console.log("Fetched landing page:", data);
      return data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    console.error("Error in landing page component:", error);
    toast({
      title: "Page non trouvée",
      description: "La page que vous recherchez n'existe pas ou n'est pas accessible.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return <LandingPageRenderer page={page} />;
};