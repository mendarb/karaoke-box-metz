import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const { data: announcement } = useQuery({
    queryKey: ['announcement'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('message')
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (!isVisible || !announcement) return null;

  return (
    <div className="bg-[#1E1E1E] text-white overflow-hidden py-2.5 relative">
      <div className="flex items-center justify-center">
        <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          <span className="text-sm font-medium px-4">
            🎉 Ouverture le 17 janvier ! Utilisez le code OUVERTURE pour bénéficier de -10% sur votre réservation
          </span>
        </div>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};