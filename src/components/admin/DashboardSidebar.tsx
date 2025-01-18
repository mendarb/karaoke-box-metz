import { Link } from "react-router-dom";
import { 
  Calendar, 
  Settings as SettingsIcon, 
  Users, 
  BarChart, 
  FileText,
  Home
} from "lucide-react";

export const DashboardSidebar = () => {
  return (
    <div className="flex flex-col gap-1 p-4 bg-white rounded-lg shadow-sm h-full min-w-[250px]">
      <Link
        to="/admin"
        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-gray-700 hover:text-kbox-coral transition-colors"
      >
        <Home className="w-5 h-5" />
        <span className="font-medium">Dashboard</span>
      </Link>
      
      <Link
        to="/admin/calendar"
        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-gray-700 hover:text-kbox-coral transition-colors"
      >
        <Calendar className="w-5 h-5" />
        <span className="font-medium">Calendrier</span>
      </Link>

      <Link
        to="/admin/accounts"
        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-gray-700 hover:text-kbox-coral transition-colors"
      >
        <Users className="w-5 h-5" />
        <span className="font-medium">Comptes</span>
      </Link>

      <Link
        to="/admin/analytics"
        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-gray-700 hover:text-kbox-coral transition-colors"
      >
        <BarChart className="w-5 h-5" />
        <span className="font-medium">Statistiques</span>
      </Link>

      <Link
        to="/admin/karaoke-boxes"
        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-gray-700 hover:text-kbox-coral transition-colors"
      >
        <Home className="w-5 h-5" />
        <span className="font-medium">Box Karaoké</span>
      </Link>

      <Link
        to="/admin/documentation"
        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-gray-700 hover:text-kbox-coral transition-colors"
      >
        <FileText className="w-5 h-5" />
        <span className="font-medium">Documentation</span>
      </Link>

      <Link
        to="/admin/settings"
        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-gray-700 hover:text-kbox-coral transition-colors"
      >
        <SettingsIcon className="w-5 h-5" />
        <span className="font-medium">Paramètres</span>
      </Link>
    </div>
  );
};