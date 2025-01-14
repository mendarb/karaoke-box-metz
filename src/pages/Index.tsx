import { useIsMobile } from "@/hooks/use-mobile";
import { useUserState } from "@/hooks/useUserState";
import { CookieConsent } from "@/components/legal/cookie-consent/CookieConsent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { HomeContent } from "@/components/home/HomeContent";
import { HomeLoading } from "@/components/home/HomeLoading";
import { AdminDashboardButton } from "@/components/admin/AdminDashboardButton";

export const Index = () => {
  const isMobile = useIsMobile();
  const { isAdmin } = useUserState();

  const { isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <HomeLoading />;
  }

  return (
    <div className="min-h-screen bg-background">
      {!isMobile && isAdmin && <AdminDashboardButton />}
      <HomeContent />
      <CookieConsent />
    </div>
  );
};