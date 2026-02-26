import { create } from 'zustand';
import { User, UserRole, RolePermissions } from '../types';
import { storage } from '../utils/storage';

const ROLE_PERMISSIONS: RolePermissions = {
  admin: ['view_all', 'create', 'edit', 'delete', 'approve', 'financial'],
  finance: ['view_financial', 'create_invoice', 'approve_payment', 'billing'],
  project_manager: ['view_projects', 'create_project', 'edit_project', 'manage_boq', 'daily_reports'],
  site_engineer: ['view_project', 'submit_daily_report', 'view_expenses'],
};

interface AppStore {
  // Auth & User
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  loginAsRole: (role: UserRole) => void;
  
  // Permissions
  hasPermission: (permission: string) => boolean;
  canPerform: (module: string, action: string) => boolean;
  
  // Current page/module
  currentModule: string;
  setCurrentModule: (module: string) => void;
}

const createDefaultUser = (role: UserRole): User => {
  const users: Record<UserRole, User> = {
    admin: {
      id: 'admin_1',
      name: 'Admin User',
      email: 'admin@erpcivi.com',
      role: 'admin',
      phone: '+91 9876543210',
      department: 'Administration',
    },
    finance: {
      id: 'finance_1',
      name: 'Finance Manager',
      email: 'finance@erpcivi.com',
      role: 'finance',
      phone: '+91 9876543211',
      department: 'Finance',
    },
    project_manager: {
      id: 'pm_1',
      name: 'Project Manager',
      email: 'pm@erpcivi.com',
      role: 'project_manager',
      phone: '+91 9876543212',
      department: 'Project Management',
    },
    site_engineer: {
      id: 'se_1',
      name: 'Site Engineer',
      email: 'engineer@erpcivi.com',
      role: 'site_engineer',
      phone: '+91 9876543213',
      department: 'Site Operations',
    },
  };
  return users[role];
};

export const useAppStore = create<AppStore>((set, get) => {
  // Initialize user from localStorage if exists
  const savedUser = storage.getItem<User>('currentUser');

  return {
    // Auth state
    user: savedUser,
    isLoggedIn: !!savedUser,
    currentModule: 'dashboard',

    // Auth actions
    setUser: (user: User) => {
      storage.setItem('currentUser', user);
      set({
        user,
        isLoggedIn: true,
      });
    },

    logout: () => {
      storage.removeItem('currentUser');
      set({
        user: null,
        isLoggedIn: false,
      });
    },

    loginAsRole: (role: UserRole) => {
      const user = createDefaultUser(role);
      get().setUser(user);
    },

    // Permission actions
    hasPermission: (permission: string) => {
      const { user } = get();
      if (!user) return false;

      const permissions = ROLE_PERMISSIONS[user.role] || [];
      return permissions.includes(permission);
    },

    canPerform: (module: string, action: string) => {
      const { user } = get();
      if (!user) return false;

      const permissions = ROLE_PERMISSIONS[user.role] || [];

      // More granular permission check
      if (permissions.includes('view_all')) return true; // admin can do everything
      if (action === 'view' && permissions.includes(`view_${module}`)) return true;
      if (action === 'create' && permissions.includes('create')) return true;
      if (action === 'edit' && permissions.includes('edit')) return true;
      if (action === 'delete' && permissions.includes('delete')) return true;
      if (action === 'approve' && permissions.includes('approve')) return true;

      return false;
    },

    // Module navigation
    setCurrentModule: (module: string) => {
      set({ currentModule: module });
    },
  };
});
