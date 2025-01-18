import { useEffect, useState } from "react";
import { X } from "lucide-react";

export const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-kbox-orange text-white overflow-hidden py-2.5 relative">
      <div className="flex items-center justify-center">
        <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          <span className="text-sm font-medium px-4">
            🎉 Ouverture le 17 janvier ! Utilisez le code <span className="font-bold">OUVERTURE</span> pour bénéficier de -10% sur votre réservation
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