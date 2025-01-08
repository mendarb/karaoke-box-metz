import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Music, Users, Calendar } from "lucide-react";

const slides = [
  {
    title: "Votre Box Karaoké Privée",
    description: "Profitez d'une expérience unique dans votre box privée, équipée d'un système karaoké professionnel",
    icon: <Music className="w-32 h-32 text-white" />,
  },
  {
    title: "Réservez en quelques clics",
    description: "Choisissez votre créneau, la durée et le nombre de personnes. C'est simple et rapide !",
    icon: <Calendar className="w-32 h-32 text-white" />,
  },
  {
    title: "Jusqu'à 10 personnes",
    description: "Invitez vos amis et passez un moment inoubliable dans une ambiance festive",
    icon: <Users className="w-32 h-32 text-white" />,
  },
];

export const OnboardingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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
    setCurrentSlide(0);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-full h-[100dvh] p-0 gap-0 bg-kbox-violet">
          <div className="w-full h-full flex flex-col justify-between p-6">
            {/* Skip button */}
            <div className="w-full flex justify-end">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-white hover:text-white/80"
              >
                Passer
              </Button>
            </div>

            {/* Progress dots */}
            <div className="w-full flex justify-center gap-2 absolute top-24 left-0 right-0">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-white w-8" : "bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto mt-12">
              <div className="bg-white/10 rounded-full p-12">
                {slides[currentSlide].icon}
              </div>
              <h2 className="text-4xl font-bold text-white">
                {slides[currentSlide].title}
              </h2>
              <p className="text-xl text-white/90">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              {currentSlide > 0 ? (
                <Button
                  variant="ghost"
                  onClick={prevSlide}
                  className="flex items-center gap-2 text-white hover:text-white/80"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </Button>
              ) : (
                <div /> // Spacer
              )}

              {currentSlide < slides.length - 1 ? (
                <Button
                  onClick={nextSlide}
                  className="flex items-center gap-2 bg-white text-kbox-violet hover:bg-white/90"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleClose}
                  className="bg-white text-kbox-violet hover:bg-white/90"
                >
                  Commencer
                </Button>
              )}
            </div>
          </div>
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