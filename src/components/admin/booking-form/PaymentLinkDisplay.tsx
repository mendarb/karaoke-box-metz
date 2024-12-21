import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PaymentLinkDisplayProps {
  paymentLink: string;
}

export const PaymentLinkDisplay = ({ paymentLink }: PaymentLinkDisplayProps) => {
  const { toast } = useToast();

  return (
    <div className="mt-4 p-4 bg-green-50 rounded-lg">
      <p className="font-medium text-green-800">Lien de paiement généré :</p>
      <div className="flex items-center gap-2 mt-2">
        <Input value={paymentLink} readOnly />
        <Button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(paymentLink);
            toast({
              title: "Copié !",
              description: "Le lien a été copié dans le presse-papier.",
            });
          }}
        >
          Copier
        </Button>
      </div>
    </div>
  );
};