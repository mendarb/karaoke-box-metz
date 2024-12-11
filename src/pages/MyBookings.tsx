import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookingHistory } from "@/components/booking/BookingHistory";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Accès refusé",
          description: "Vous devez être connecté pour accéder à cette page",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <BookingHistory />
    </div>
  );
};