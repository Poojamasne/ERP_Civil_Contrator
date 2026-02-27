// Data types and interfaces for ERP CIVIL system

export type UserRole = 'admin' | 'finance' | 'project_manager' | 'site_engineer';
export type ProjectStatus = 'planning' | 'ongoing' | 'completed' | 'on_hold';
export type BillStatus = 'draft' | 'submitted' | 'approved' | 'paid';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

// User & Authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

// Projects
export interface Project {
  id: string;
  name: string;
  clientId: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: ProjectStatus;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStats {
  totalProjects: number;
  ongoingProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalSpent: number;
  profitEstimate: number;
}

// BOQ (Bill of Quantities)
export interface BOQItem {
  id: string;
  projectId: string;
  itemName: string;
  description?: string;
  quantity: number;
  unit: string;
  rate: number;
  totalAmount: number;
  createdAt: string;
}

// Billing
export interface RunningBill {
  id: string;
  projectId: string;
  billNumber: string;
  billDate: string;
  boqItems: {
    itemId: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
  subtotal: number;
  retentionPercentage: number;
  retentionAmount: number;
  billAmount: number;
  status: BillStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FinalBill {
  id: string;
  projectId: string;
  billNumber: string;
  billDate: string;
  totalAmount: number;
  retentionRelease: number;
  finalAmount: number;
  status: BillStatus;
  createdAt: string;
}

// Invoices & Payments
export interface Invoice {
  id: string;
  projectId: string;
  invoiceNumber: string;
  billId: string; // reference to running or final bill
  invoiceDate: string;
  dueDate: string;
  amount: number;
  tax?: number;
  totalAmount: number;
  status: InvoiceStatus;
  clientId: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMode: 'cash' | 'cheque' | 'transfer' | 'other';
  referenceNumber?: string;
  remarks?: string;
  receivedDate: string;
}

// Clients
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  gstin?: string;
  contactPerson?: string;
  createdAt: string;
}

// Vendors & Subcontractors
export interface Vendor {
  id: string;
  name: string;
  category: 'labor' | 'material' | 'equipment' | 'subcontractor';
  email?: string;
  phone: string;
  address?: string;
  bankAccount?: string;
  gstin?: string;
  createdAt: string;
}

export interface VendorWork {
  id: string;
  vendorId: string;
  projectId: string;
  workDescription: string;
  assignedDate: string;
  completedDate?: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface VendorBill {
  id: string;
  vendorId: string;
  vendorWorkId: string;
  billNumber: string;
  billDate: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  createdAt: string;
}

// Inventory & Materials
export interface Material {
  id: string;
  name: string;
  description?: string;
  unit: string;
  category: string;
  reorderLevel: number;
  createdAt: string;
}

export interface MaterialStock {
  id: string;
  materialId: string;
  currentStock: number;
  lastUpdated: string;
}

export interface MaterialTransaction {
  id: string;
  materialId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  projectId?: string;
  vendorId?: string;
  remarks?: string;
  transactionDate: string;
  createdAt: string;
}

// Equipment & Machinery
export interface Equipment {
  id: string;
  name: string;
  category: string;
  serialNumber?: string;
  purchaseDate?: string;
  purchaseValue?: number;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  createdAt: string;
}

export interface EquipmentAllocation {
  id: string;
  equipmentId: string;
  projectId: string;
  allocationDate: string;
  deallocationDate?: string;
  createdAt: string;
}

export interface EquipmentMaintenance {
  id: string;
  equipmentId: string;
  maintenanceDate: string;
  description: string;
  cost: number;
  technician?: string;
  nextMaintenanceDate?: string;
  createdAt: string;
}

// Site Engineer Daily Report
export interface DailyReport {
  id: string;
  projectId: string;
  reportDate: string;
  siteEngineer: string;
  workDescription: string;
  quantityExecuted: number;
  unit: string;
  boqItemId?: string;
  weather?: string;
  noOfWorkers?: number;
  remarks?: string;
  photos?: string[]; // base64 encoded images
  createdAt: string;
}

// Dashboard KPIs
export interface DashboardKPI {
  totalProjects: number;
  ongoingProjects: number;
  completedProjects: number;
  totalBilling: number;
  pendingPayments: number;
  profitEstimate: number;
  monthlyBilling: { month: string; amount: number }[];
  projectStatusBreakdown: { status: string; count: number }[];
}

// Role-based permissions
export interface RolePermissions {
  admin: string[];
  finance: string[];
  project_manager: string[];
  site_engineer: string[];
}
