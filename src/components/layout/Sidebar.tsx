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

export function LayoutSidebar() {
  const { user, currentModule, setCurrentModule, logout } = useAppStore();

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
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-4 md:px-6 py-6 border-b border-slate-800 flex-shrink-0">
       <img src="/src/assets/Logo.svg" alt="ERP CIVI" className="w-8 h-8 mb-2" style={{width: '80%', height: '80%', alignItems: 'center'}}/>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 md:px-6 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div className="min-w-0 hidden md:block">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize truncate">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu - Scrollable */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {visibleMenuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentModule(item.module)}
            className={`sidebar-item ${
              currentModule === item.module ? 'sidebar-item-active' : ''
            } flex items-center gap-3 w-full px-2 md:px-4`}
            title={item.label}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="hidden md:inline text-nowrap">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer - Logout */}
      <div className="px-4 md:px-6 py-4 border-t border-slate-800 flex-shrink-0">
        <button
          onClick={() => logout()}
          className="sidebar-item flex items-center gap-3 w-full text-red-400 hover:bg-red-950 hover:text-red-300 px-2 md:px-4 justify-center md:justify-start"
          title="Logout"
        >
          <LogOut size={20} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>

      {/* Version */}
      <div className="px-4 md:px-6 py-2 text-xs text-slate-500 text-center border-t border-slate-800 flex-shrink-0">
        <p className="hidden md:block">v1.0.0</p>
        <p className="md:hidden">v1</p>
      </div>
    </aside>
  );
}
