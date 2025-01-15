import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingDocumentsProps {
  invoiceUrl: string;
  isTestBooking?: boolean;
}

export const BookingDocuments = ({ invoiceUrl, isTestBooking }: BookingDocumentsProps) => {
  if (!invoiceUrl) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Documents</h3>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => window.open(invoiceUrl, '_blank', 'noopener,noreferrer')}
      >
        <Download className="mr-2 h-4 w-4" />
        Télécharger {isTestBooking ? 'la facture test' : 'le reçu'}
      </Button>
    </div>
  );
};