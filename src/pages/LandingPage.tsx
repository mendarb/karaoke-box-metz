import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LandingPageRenderer } from "@/components/landing-pages/LandingPageRenderer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const LandingPage = () => {
  const { slug } = useParams();

  const { data: page, isLoading } = useQuery({
    queryKey: ["landing-page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

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