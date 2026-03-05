import { useAppStore } from '../../store';
import { User, LogOut, Home, Briefcase, FileText, Users, Truck, Package, Wrench, FileCheck, BarChart3, X } from 'lucide-react';

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
    <>
      {/* Desktop Sidebar - Static on desktop, hidden on mobile */}
      <aside className="hidden lg:flex lg:flex-col sidebar-desktop">
        {/* Logo */}
        <div className="px-4 lg:px-6 py-4 lg:py-6 border-b border-slate-800 flex-shrink-0 flex items-center justify-start ml-2">
          <img src="/logo.svg" alt="Logo" className="w-28 h-10" />
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3 justify-start ml-1">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.department}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {visibleMenuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.module)}
              className={`sidebar-item ${
                currentModule === item.module ? 'sidebar-item-active' : ''
              } flex items-center gap-3 w-full px-4 justify-start ml-1`}
              title={item.label}
            >
              <span className="flex-shrink-0 flex items-center justify-center">
                {item.icon}
              </span>
              <span className="text-sm inline">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer - Logout */}
        <div className="px-4 lg:px-6 py-3 lg:py-4 border-t border-slate-800 flex-shrink-0">
          <button
            onClick={() => logout()}
            className="sidebar-item flex items-center gap-3 w-full text-red-400 hover:bg-red-950 hover:text-red-300 px-4 justify-start ml-1"
            title="Logout"
          >
            <LogOut size={20} />
            <span className="text-sm inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar - Drawer on mobile/tablet */}
      {isOpen && (
        <aside className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 z-40 shadow-2xl overflow-y-auto">
        {/* Mobile Sidebar Header with Close Button */}
        <div className="px-4 py-4 border-b border-slate-800 flex-shrink-0 flex items-center justify-between">
          <img src="/logo.svg" alt="Logo" className="w-28 h-10"/>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
            title="Close Menu"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 py-4 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3 justify-start">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.department}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {visibleMenuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.module)}
              className={`sidebar-item ${
                currentModule === item.module ? 'sidebar-item-active' : ''
              } flex items-center gap-3 w-full px-4 justify-start ml-1`}
              title={item.label}
            >
              <span className="flex-shrink-0 flex items-center justify-center">
                {item.icon}
              </span>
              <span className="text-sm inline">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer - Logout */}
        <div className="px-4 py-4 border-t border-slate-800 flex-shrink-0">
          <button
            onClick={() => logout()}
            className="sidebar-item flex items-center gap-3 w-full text-red-400 hover:bg-red-950 hover:text-red-300 px-4 justify-start ml-1"
            title="Logout"
          >
            <LogOut size={20} />
            <span className="text-sm inline">Logout</span>
          </button>
        </div>
      </aside>
      )}
    </>
  );
}
