import { MessageSquare } from "lucide-react";

interface MessageSectionProps {
  message: string;
}

export const MessageSection = ({ message }: MessageSectionProps) => {
  return (
    <div className="space-y-2 border-t border-gray-100 pt-3">
      <div className="flex items-start space-x-2">
        <MessageSquare className="h-4 w-4 text-violet-500 mt-1" />
        <div>
          <p className="font-medium text-sm text-gray-700">Message</p>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};