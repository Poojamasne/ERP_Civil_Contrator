import { storage } from './storage';
import { Project, Client, BOQItem, RunningBill, Invoice, Vendor, Material, Equipment, DailyReport } from '../types';

// Generic CRUD operations
function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Projects CRUD
export const projectService = {
  getAll: () => storage.getItem<Project[]>('projects') || [],
  getById: (id: string) => storage.getItem<Project[]>('projects')?.find(p => p.id === id),
  create: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: createId('proj'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const projects = storage.getItem<Project[]>('projects') || [];
    projects.push(newProject);
    storage.setItem('projects', projects);
    return newProject;
  },
  update: (id: string, updates: Partial<Project>) => {
    const projects = storage.getItem<Project[]>('projects') || [];
    const index = projects.findIndex(p => p.id === id);
    if (index >= 0) {
      projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      storage.setItem('projects', projects);
      return projects[index];
    }
    return null;
  },
  delete: (id: string) => {
    const projects = storage.getItem<Project[]>('projects') || [];
    const filtered = projects.filter(p => p.id !== id);
    storage.setItem('projects', filtered);
    return true;
  },
};

// Clients CRUD
export const clientService = {
  getAll: () => storage.getItem<Client[]>('clients') || [],
  getById: (id: string) => storage.getItem<Client[]>('clients')?.find(c => c.id === id),
  create: (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: createId('client'),
      createdAt: new Date().toISOString(),
    };
    const clients = storage.getItem<Client[]>('clients') || [];
    clients.push(newClient);
    storage.setItem('clients', clients);
    return newClient;
  },
  update: (id: string, updates: Partial<Client>) => {
    const clients = storage.getItem<Client[]>('clients') || [];
    const index = clients.findIndex(c => c.id === id);
    if (index >= 0) {
      clients[index] = { ...clients[index], ...updates };
      storage.setItem('clients', clients);
      return clients[index];
    }
    return null;
  },
  delete: (id: string) => {
    const clients = storage.getItem<Client[]>('clients') || [];
    const filtered = clients.filter(c => c.id !== id);
    storage.setItem('clients', filtered);
    return true;
  },
};

// BOQ Items CRUD
export const boqService = {
  getAll: () => storage.getItem<BOQItem[]>('boq_items') || [],
  getByProjectId: (projectId: string) =>
    (storage.getItem<BOQItem[]>('boq_items') || []).filter(b => b.projectId === projectId),
  create: (boq: Omit<BOQItem, 'id' | 'createdAt'>) => {
    const newBoq: BOQItem = {
      ...boq,
      id: createId('boq'),
      createdAt: new Date().toISOString(),
    };
    const boqs = storage.getItem<BOQItem[]>('boq_items') || [];
    boqs.push(newBoq);
    storage.setItem('boq_items', boqs);
    return newBoq;
  },
  update: (id: string, updates: Partial<BOQItem>) => {
    const boqs = storage.getItem<BOQItem[]>('boq_items') || [];
    const index = boqs.findIndex(b => b.id === id);
    if (index >= 0) {
      boqs[index] = { ...boqs[index], ...updates };
      storage.setItem('boq_items', boqs);
      return boqs[index];
    }
    return null;
  },
  delete: (id: string) => {
    const boqs = storage.getItem<BOQItem[]>('boq_items') || [];
    const filtered = boqs.filter(b => b.id !== id);
    storage.setItem('boq_items', filtered);
    return true;
  },
};

// Running Bills CRUD
export const billingService = {
  getAll: () => storage.getItem<RunningBill[]>('running_bills') || [],
  getByProjectId: (projectId: string) =>
    (storage.getItem<RunningBill[]>('running_bills') || []).filter(b => b.projectId === projectId),
  create: (bill: Omit<RunningBill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBill: RunningBill = {
      ...bill,
      id: createId('bill'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const bills = storage.getItem<RunningBill[]>('running_bills') || [];
    bills.push(newBill);
    storage.setItem('running_bills', bills);
    return newBill;
  },
  update: (id: string, updates: Partial<RunningBill>) => {
    const bills = storage.getItem<RunningBill[]>('running_bills') || [];
    const index = bills.findIndex(b => b.id === id);
    if (index >= 0) {
      bills[index] = { ...bills[index], ...updates, updatedAt: new Date().toISOString() };
      storage.setItem('running_bills', bills);
      return bills[index];
    }
    return null;
  },
};

// Invoices CRUD
export const invoiceService = {
  getAll: () => storage.getItem<Invoice[]>('invoices') || [],
  getByProjectId: (projectId: string) =>
    (storage.getItem<Invoice[]>('invoices') || []).filter(i => i.projectId === projectId),
  create: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: createId('inv'),
      createdAt: new Date().toISOString(),
    };
    const invoices = storage.getItem<Invoice[]>('invoices') || [];
    invoices.push(newInvoice);
    storage.setItem('invoices', invoices);
    return newInvoice;
  },
  update: (id: string, updates: Partial<Invoice>) => {
    const invoices = storage.getItem<Invoice[]>('invoices') || [];
    const index = invoices.findIndex(i => i.id === id);
    if (index >= 0) {
      invoices[index] = { ...invoices[index], ...updates };
      storage.setItem('invoices', invoices);
      return invoices[index];
    }
    return null;
  },
};

// Vendors CRUD
export const vendorService = {
  getAll: () => storage.getItem<Vendor[]>('vendors') || [],
  create: (vendor: Omit<Vendor, 'id' | 'createdAt'>) => {
    const newVendor: Vendor = {
      ...vendor,
      id: createId('vendor'),
      createdAt: new Date().toISOString(),
    };
    const vendors = storage.getItem<Vendor[]>('vendors') || [];
    vendors.push(newVendor);
    storage.setItem('vendors', vendors);
    return newVendor;
  },
  update: (id: string, updates: Partial<Vendor>) => {
    const vendors = storage.getItem<Vendor[]>('vendors') || [];
    const index = vendors.findIndex(v => v.id === id);
    if (index >= 0) {
      vendors[index] = { ...vendors[index], ...updates };
      storage.setItem('vendors', vendors);
      return vendors[index];
    }
    return null;
  },
  delete: (id: string) => {
    const vendors = storage.getItem<Vendor[]>('vendors') || [];
    const filtered = vendors.filter(v => v.id !== id);
    storage.setItem('vendors', filtered);
    return true;
  },
};

// Materials CRUD
export const materialService = {
  getAll: () => storage.getItem<Material[]>('materials') || [],
  create: (material: Omit<Material, 'id' | 'createdAt'>) => {
    const newMaterial: Material = {
      ...material,
      id: createId('mat'),
      createdAt: new Date().toISOString(),
    };
    const materials = storage.getItem<Material[]>('materials') || [];
    materials.push(newMaterial);
    storage.setItem('materials', materials);
    return newMaterial;
  },
};

// Equipment CRUD
export const equipmentService = {
  getAll: () => storage.getItem<Equipment[]>('equipment') || [],
  create: (equipment: Omit<Equipment, 'id' | 'createdAt'>) => {
    const newEquipment: Equipment = {
      ...equipment,
      id: createId('equip'),
      createdAt: new Date().toISOString(),
    };
    const equipment_list = storage.getItem<Equipment[]>('equipment') || [];
    equipment_list.push(newEquipment);
    storage.setItem('equipment', equipment_list);
    return newEquipment;
  },
};

// Daily Reports CRUD
export const dailyReportService = {
  getAll: () => storage.getItem<DailyReport[]>('daily_reports') || [],
  getByProjectId: (projectId: string) =>
    (storage.getItem<DailyReport[]>('daily_reports') || []).filter(r => r.projectId === projectId),
  create: (report: Omit<DailyReport, 'id' | 'createdAt'>) => {
    const newReport: DailyReport = {
      ...report,
      id: createId('report'),
      createdAt: new Date().toISOString(),
    };
    const reports = storage.getItem<DailyReport[]>('daily_reports') || [];
    reports.push(newReport);
    storage.setItem('daily_reports', reports);
    return newReport;
  },
};
