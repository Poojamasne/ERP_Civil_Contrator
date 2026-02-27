import { useAppStore } from '../../store';
import { User, LogOut, Home, Briefcase, FileText, Users, Truck, Package, Wrench, FileCheck, BarChart3 } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  module: string;
  requiredPermission?: string;
  roles?: string[];
}

interface LayoutSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function LayoutSidebar({ isOpen = false, onClose }: LayoutSidebarProps) {
  const { user, currentModule, setCurrentModule, logout } = useAppStore();

  const handleMenuClick = (module: string) => {
    setCurrentModule(module);
    if (onClose) {
      onClose();
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home size={20} />,
      module: 'dashboard',
      roles: ['admin', 'finance', 'project_manager', 'site_engineer'],
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Briefcase size={20} />,
      module: 'projects',
      roles: ['admin', 'project_manager'],
    },
    {
      id: 'boq',
      label: 'BOQ',
      icon: <FileText size={20} />,
      module: 'boq',
      roles: ['admin', 'project_manager'],
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: <FileCheck size={20} />,
      module: 'billing',
      roles: ['admin', 'finance', 'project_manager'],
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: <BarChart3 size={20} />,
      module: 'invoices',
      roles: ['admin', 'finance'],
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: <Users size={20} />,
      module: 'clients',
      roles: ['admin', 'finance', 'project_manager'],
    },
    {
      id: 'vendors',
      label: 'Vendors',
      icon: <Truck size={20} />,
      module: 'vendors',
      roles: ['admin', 'project_manager'],
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Package size={20} />,
      module: 'inventory',
      roles: ['admin', 'project_manager'],
    },
    {
      id: 'equipment',
      label: 'Equipment',
      icon: <Wrench size={20} />,
      module: 'equipment',
      roles: ['admin', 'project_manager'],
    },
    {
      id: 'daily_reports',
      label: 'Daily Reports',
      icon: <FileText size={20} />,
      module: 'daily_reports',
      roles: ['admin', 'project_manager', 'site_engineer'],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 size={20} />,
      module: 'reports',
      roles: ['admin', 'finance', 'project_manager'],
    },
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || '');
  });

  return (
    <aside className={`sidebar fixed lg:static transition-all duration-300 ease-in-out ${
      isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-16 sm:w-20 lg:translate-x-0 lg:w-64'
    }`}>
      {/* Logo */}
      <div className={`px-2 sm:px-4 lg:px-6 py-4 sm:py-6 border-b border-slate-800 flex-shrink-0 flex items-center ${
        isOpen ? 'justify-start ml-2' : 'justify-center lg:justify-start lg:ml-2'
      }`}>
        <img src="/Logo.svg" alt="" className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8" style={{width: '80%', height: '80%'}} />
      </div>

      {/* User Info */}
      {user && (
        <div className={`px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-slate-800 flex-shrink-0 ${
          isOpen ? 'block' : 'hidden lg:block'
        }`}>
          <div className={`flex items-center gap-2 sm:gap-3 ${
            isOpen ? 'justify-start ml-1' : 'justify-center lg:justify-start lg:ml-1'
          }`}>
            <div className="w-8 sm:w-9 lg:w-10 h-8 sm:h-9 lg:h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white">
              <User size={18} className="sm:size-5" />
            </div>
            <div className={`min-w-0 ${isOpen ? 'block' : 'hidden lg:block'}`}>
              <p className="text-xs sm:text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize truncate">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu - Scrollable */}
      <nav className="flex-1 overflow-y-auto py-2 sm:py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {visibleMenuItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.module)}
            className={`sidebar-item ${
              currentModule === item.module ? 'sidebar-item-active' : ''
            } flex items-center gap-2 sm:gap-3 w-full px-1 sm:px-2 lg:px-4 ${
              isOpen ? 'justify-start ml-1' : 'justify-center lg:justify-start lg:ml-1'
            }`}
            title={item.label}
          >
            <span className="flex-shrink-0 flex items-center justify-center">
              {item.icon}
            </span>
            <span className={`text-nowrap text-xs sm:text-sm ${
              isOpen ? 'inline' : 'hidden lg:inline'
            }`}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer - Logout */}
      <div className={`px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-slate-800 flex-shrink-0 ${
        isOpen ? 'block' : 'hidden lg:block'
      }`}>
        <button
          onClick={() => logout()}
          className={`sidebar-item flex items-center gap-2 sm:gap-3 w-full text-red-400 hover:bg-red-950 hover:text-red-300 px-1 sm:px-2 lg:px-4 ${
            isOpen ? 'justify-start ml-1' : 'justify-center lg:justify-start lg:ml-1'
          }`}
          title="Logout"
        >
          <LogOut size={18} className="sm:size-5 lg:size-5" />
          <span className={`text-xs sm:text-sm ${
            isOpen ? 'inline' : 'hidden lg:inline'
          }`}>Logout</span>
        </button>
      </div>

      {/* Version */}
      <div className={`px-2 sm:px-4 lg:px-6 py-1 sm:py-2 text-xs text-slate-500 text-center border-t border-slate-800 flex-shrink-0 ${
        isOpen ? 'block' : 'hidden lg:block'
      }`}>
        <p className={`${isOpen ? 'block' : 'hidden lg:block'}`}>v1.0.0</p>
        <p className={`${isOpen ? 'hidden' : 'lg:hidden'}`}>v1</p>
      </div>
    </aside>
  );
}
