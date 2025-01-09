import { useEffect, useState } from "react";

export const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-kbox-orange text-white overflow-hidden py-2 relative">
      <div className="flex items-center justify-center">
        <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap flex items-center gap-8">
          <span className="text-sm font-medium">
            🎉 Ouverture le 17 janvier ! Utilisez le code <span className="font-bold">OUVERTURE</span> pour bénéficier de -10% sur votre réservation
          </span>
          <span className="text-sm font-medium">
            🎉 Ouverture le 17 janvier ! Utilisez le code <span className="font-bold">OUVERTURE</span> pour bénéficier de -10% sur votre réservation
          </span>
        </div>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-kbox-orange-dark rounded-full"
        aria-label="Fermer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};