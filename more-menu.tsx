import { useLocation } from "wouter";
import { X, BookText, FileText, MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface MoreMenuProps {
  onClose: () => void;
}

export function MoreMenu({ onClose }: MoreMenuProps) {
  const [, navigate] = useLocation();
  const { logoutMutation } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-xl w-full p-4 animate-in slide-in-from-bottom">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">More Options</h2>
        
        <div className="grid grid-cols-3 gap-4">
          <MenuItem 
            icon={<BookText className="w-5 h-5" />}
            label="Textbooks"
            bgColor="bg-blue-100"
            iconColor="text-blue-500"
            onClick={() => handleNavigation("/textbooks")}
          />
          
          <MenuItem 
            icon={<FileText className="w-5 h-5" />}
            label="Circulars"
            bgColor="bg-yellow-100"
            iconColor="text-yellow-500"
            onClick={() => handleNavigation("/circulars")}
          />
          
          <MenuItem 
            icon={<MessageSquare className="w-5 h-5" />}
            label="Complaint"
            bgColor="bg-teal-100"
            iconColor="text-teal-500"
            onClick={() => handleNavigation("/complaints")}
          />
        </div>
        
        <div className="flex justify-between mt-6">
          <button 
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium" 
            onClick={onClose}
          >
            Close
          </button>
          
          <button 
            className="ml-2 p-3 bg-red-100 text-red-500 rounded-lg"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  iconColor: string;
  onClick: () => void;
}

function MenuItem({ icon, label, bgColor, iconColor, onClick }: MenuItemProps) {
  return (
    <button className="flex flex-col items-center" onClick={onClick}>
      <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center mb-2`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <span className="text-xs text-gray-700">{label}</span>
    </button>
  );
}
