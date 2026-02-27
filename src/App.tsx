import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAppStore } from './store';
import { initializeSeedData } from './utils/seedData';
import { LayoutSidebar } from './components/layout/Sidebar';
import { LoginModal } from './components/auth/LoginModal';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import BOQ from './pages/BOQ';
import Billing from './pages/Billing';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import Vendors from './pages/Vendors';
import Inventory from './pages/Inventory';
import Equipment from './pages/Equipment';
import DailyReports from './pages/DailyReports';
import Reports from './pages/Reports';

type PageModule = 'dashboard' | 'projects' | 'boq' | 'billing' | 'invoices' | 'clients' | 'vendors' | 'inventory' | 'equipment' | 'daily_reports' | 'reports';

function App() {
  const { isLoggedIn, currentModule } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize seed data on first load
  useEffect(() => {
    initializeSeedData();
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="mb-4 text-4xl font-bold text-blue-600">ERP CIVIL</div>
          <div className="text-white">Loading Civil Contractor ERP...</div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginModal />;
  }

  const renderPage = () => {
    const pageMap: Record<PageModule, React.ReactNode> = {
      dashboard: <Dashboard />,
      projects: <Projects />,
      boq: <BOQ />,
      billing: <Billing />,
      invoices: <Invoices />,
      clients: <Clients />,
      vendors: <Vendors />,
      inventory: <Inventory />,
      equipment: <Equipment />,
      daily_reports: <DailyReports />,
      reports: <Reports />,
    };
    return pageMap[currentModule as PageModule] || <Dashboard />;
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <LayoutSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Overlay for mobile/tablet when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Mobile/Tablet Header with Hamburger */}
        <div className="mobile-header lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            title="Toggle Menu"
          >
            {isSidebarOpen ? (
              <X size={24} className="text-slate-900" />
            ) : (
              <Menu size={24} className="text-slate-900" />
            )}
          </button>
          <span className="text-sm font-semibold text-slate-900">ERP CIVIL</span>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-3 sm:p-4 lg:p-8 w-full">
            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
