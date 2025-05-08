import { useLocation } from "wouter";
import {
  Home,
  BookOpen,
  Video,
  Bell,
  Grid,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { MoreMenu } from "./more-menu";

export function NavBar() {
  const [location, navigate] = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-2 py-1 z-10">
        <NavItem 
          isActive={isActive("/")} 
          icon={<Home className="w-5 h-5" />} 
          label="Home" 
          onClick={() => navigate("/")} 
        />
        <NavItem 
          isActive={isActive("/homework")} 
          icon={<BookOpen className="w-5 h-5" />} 
          label="Homework" 
          onClick={() => navigate("/homework")} 
        />
        <NavItem 
          isActive={isActive("/live-classes")} 
          icon={<Video className="w-5 h-5" />} 
          label="Live" 
          onClick={() => navigate("/live-classes")} 
        />
        <NavItem 
          isActive={isActive("/notices")} 
          icon={<Bell className="w-5 h-5" />} 
          label="Notices" 
          onClick={() => navigate("/notices")} 
        />
        <NavItem 
          isActive={showMoreMenu} 
          icon={<Grid className="w-5 h-5" />} 
          label="More" 
          onClick={() => setShowMoreMenu(true)} 
        />
      </div>

      {showMoreMenu && <MoreMenu onClose={() => setShowMoreMenu(false)} />}
    </>
  );
}

interface NavItemProps {
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function NavItem({ isActive, icon, label, onClick }: NavItemProps) {
  return (
    <button 
      className={`flex flex-col items-center justify-center w-full p-2 ${isActive ? 'text-primary-500' : 'text-gray-600'}`} 
      onClick={onClick}
    >
      <div className="text-xl mb-1">{icon}</div>
      <span className="text-xs">{label}</span>
    </button>
  );
}
