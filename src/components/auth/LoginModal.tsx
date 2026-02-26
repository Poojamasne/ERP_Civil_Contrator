import { useAppStore } from '../../store';
import { UserRole } from '../../types';
import { Shield, Briefcase, BarChart3, HardHat } from 'lucide-react';

const ROLES: Array<{ role: UserRole; label: string; description: string; icon: React.ReactNode }> = [
  {
    role: 'admin',
    label: 'Admin',
    description: 'Full system access and management',
    icon: <Shield size={32} className="text-blue-500" />,
  },
  {
    role: 'finance',
    label: 'Finance Manager',
    description: 'Manage billing, invoices, and payments',
    icon: <BarChart3 size={32} className="text-green-500" />,
  },
  {
    role: 'project_manager',
    label: 'Project Manager',
    description: 'Manage projects, BOQ, and daily reports',
    icon: <Briefcase size={32} className="text-orange-500" />,
  },
  {
    role: 'site_engineer',
    label: 'Site Engineer',
    description: 'Submit daily reports and site data',
    icon: <HardHat size={32} className="text-yellow-500" />,
  },
];

export function LoginModal() {
  const { loginAsRole } = useAppStore();

  return (
    <div className="modal-overlay">
      <div className="modal p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">ERP CIVI</h1>
          <p className="text-slate-600">Civil Contractor Enterprise Resource Planning</p>
        </div>

        <p className="text-center text-slate-600 mb-8">
          Select a role to demo the system with role-specific features and permissions.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {ROLES.map(({ role, label, description, icon }) => (
            <button
              key={role}
              onClick={() => loginAsRole(role)}
              className="p-6 border-2 border-slate-200 rounded-lg text-left hover:border-blue-600 hover:bg-slate-50 transition-all group"
            >
              <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <h3 className="font-semibold text-center text-slate-900 mb-2">{label}</h3>
              <p className="text-xs text-slate-600 text-center group-hover:text-slate-700">{description}</p>
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500 text-center mt-8">
          Demo disclaimer: This is a frontend-only demo using localStorage. All data is stored locally on your device.
        </p>
      </div>
    </div>
  );
}
