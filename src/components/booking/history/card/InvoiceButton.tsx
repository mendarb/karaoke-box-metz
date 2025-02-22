import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceButtonProps {
  paymentStatus: string;
  invoiceUrl?: string;
  isTestBooking: boolean;
}

export const InvoiceButton = ({ paymentStatus, invoiceUrl, isTestBooking }: InvoiceButtonProps) => {
  if (paymentStatus !== 'paid' || !invoiceUrl) return null;

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          window.open(invoiceUrl, '_blank', 'noopener,noreferrer');
        }}
      >
        <Download className="mr-2 h-4 w-4" />
        Télécharger {isTestBooking ? 'la facture test' : 'le reçu'}
      </Button>
    </div>
  );
};