import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SheetTrigger } from "@/components/ui/sheet";

interface CartButtonProps {
  count: number;
}

export const CartButton = ({ count }: CartButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative hover:bg-violet-50 hover:border-violet-200"
              aria-label="Panier des réservations"
            >
              <ShoppingCart className="h-5 w-5 text-violet-600" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {count}
                </span>
              )}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Vos réservations sauvegardées</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};