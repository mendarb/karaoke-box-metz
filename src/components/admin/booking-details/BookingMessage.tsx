import { MessageSquare } from "lucide-react";

interface BookingMessageProps {
  message: string;
}

export const BookingMessage = ({ message }: BookingMessageProps) => {
  if (!message) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Message</h3>
      <p className="text-sm flex items-start">
        <MessageSquare className="mr-2 h-4 w-4 mt-0.5" />
        {message}
      </p>
    </div>
  );
};