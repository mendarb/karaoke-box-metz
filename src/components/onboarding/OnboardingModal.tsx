import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Music, Users, Calendar } from "lucide-react";

const slides = [
  {
    title: "Votre Box Karaoké Privée",
    description: "Profitez d'une expérience unique dans votre box privée, équipée d'un système karaoké professionnel",
    icon: <Music className="w-16 h-16 text-kbox-coral mb-4" />,
  },
  {
    title: "Réservez en quelques clics",
    description: "Choisissez votre créneau, la durée et le nombre de personnes. C'est simple et rapide !",
    icon: <Calendar className="w-16 h-16 text-kbox-coral mb-4" />,
  },
  {
    title: "Jusqu'à 15 personnes",
    description: "Invitez vos amis et passez un moment inoubliable dans une ambiance festive",
    icon: <Users className="w-16 h-16 text-kbox-coral mb-4" />,
  },
];

export const OnboardingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setIsOpen(true);
      setHasSeenOnboarding(false);
    } else {
      setHasSeenOnboarding(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenOnboarding", "true");
    setHasSeenOnboarding(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 bg-white">
          <Carousel className="w-full">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="flex flex-col items-center justify-center p-6 min-h-[400px] text-center space-y-4">
                    <div className="bg-kbox-pink/10 rounded-full p-4">
                      {slide.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {slide.title}
                    </h2>
                    <p className="text-gray-600">
                      {slide.description}
                    </p>
                    {index === slides.length - 1 ? (
                      <Button
                        onClick={handleClose}
                        className="mt-4 bg-kbox-coral hover:bg-kbox-orange-dark text-white"
                      >
                        Commencer
                      </Button>
                    ) : null}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </DialogContent>
      </Dialog>

      {hasSeenOnboarding && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg bg-kbox-coral hover:bg-kbox-orange-dark text-white"
          size="icon"
        >
          <Music className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};