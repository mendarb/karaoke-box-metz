import { Button } from "@/components/ui/button";

interface BookingFormHeaderProps {
  onAuthClick: () => void;
}

export const BookingFormHeader = ({ onAuthClick }: BookingFormHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <Button 
        onClick={onAuthClick}
        variant="outline"
        className="bg-white"
      >
        Se connecter
      </Button>
      <img 
        src="/lovable-uploads/59d9c366-5156-416c-a63a-8ab38e3fe556.png" 
        alt="Kara-OK Box Privatif"
        className="h-10 sm:h-12 drop-shadow-lg"
      />
    </div>
  );
};