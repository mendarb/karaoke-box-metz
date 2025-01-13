import { Users } from "lucide-react";

interface GroupSectionProps {
  groupSize: string;
}

export const GroupSection = ({ groupSize }: GroupSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Users className="h-4 w-4 text-violet-500" />
        <p className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center bg-gray-50 rounded-full px-3 py-1 text-sm">
            {groupSize} {parseInt(groupSize) > 1 ? "personnes" : "personne"}
          </span>
        </p>
      </div>
    </div>
  );
};