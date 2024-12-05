import { Badge } from "@/components/ui/badge";

type StatusConfig = {
  label: string;
  className: string;
};

const statusConfig: Record<string, StatusConfig> = {
  pending: { label: "En attente", className: "bg-yellow-500" },
  confirmed: { label: "Confirmé", className: "bg-green-500" },
  cancelled: { label: "Annulé", className: "bg-red-500" },
};

export const BookingStatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] || statusConfig.pending;
  return <Badge className={config.className}>{config.label}</Badge>;
};