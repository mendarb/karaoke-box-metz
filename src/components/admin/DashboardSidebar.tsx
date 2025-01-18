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
    <div className="flex flex-col gap-2">
      <Link
        to="/admin"
        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
      >
        <Home className="w-4 h-4" />
        <span>Dashboard</span>
      </Link>
      
      <Link
        to="/admin/calendar"
        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
      >
        <Calendar className="w-4 h-4" />
        <span>Calendrier</span>
      </Link>

      <Link
        to="/admin/accounts"
        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
      >
        <Users className="w-4 h-4" />
        <span>Comptes</span>
      </Link>

      <Link
        to="/admin/analytics"
        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
      >
        <BarChart className="w-4 h-4" />
        <span>Statistiques</span>
      </Link>

      <Link
        to="/admin/karaoke-boxes"
        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
      >
        <Home className="w-4 h-4" />
        <span>Box Karaoké</span>
      </Link>

      <Link
        to="/admin/documentation"
        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
      >
        <FileText className="w-4 h-4" />
        <span>Documentation</span>
      </Link>

      <Link
        to="/admin/settings"
        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
      >
        <SettingsIcon className="w-4 h-4" />
        <span>Paramètres</span>
      </Link>
    </div>
  );
};