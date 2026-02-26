import {
  Project,
  Client,
  BOQItem,
  RunningBill,
  Invoice,
  Vendor,
  Material,
  DailyReport,
  Equipment,
  EquipmentAllocation,
} from '../types';
import { storage } from '../utils/storage';

// Seed data generators
export function initializeSeedData() {
  // Check if data already exists
  const existingProjects = storage.getItem<Project[]>('projects');
  if (existingProjects && existingProjects.length > 0) {
    return; // Data already initialized
  }

  // Initialize all collections
  initializeClients();
  initializeProjects();
  initializeBoqItems();
  initializeRunningBills();
  initializeInvoices();
  initializeVendors();
  initializeMaterials();
  initializeEquipment();
  initializeDailyReports();
}

function initializeClients() {
  const clients: Client[] = [
    {
      id: 'client_1',
      name: 'Mumbai Metropolitan Development',
      email: 'contact@mmd.com',
      phone: '+91 22-4040-0000',
      address: '123 Business Plaza, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      gstin: '27AAPPP7890A1Z5',
      contactPerson: 'Rajesh Kumar',
      createdAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: 'client_2',
      name: 'Bangalore Infrastructure Ltd',
      email: 'projects@bil.co.in',
      phone: '+91 80-3040-5000',
      address: 'Tech Tower, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560042',
      gstin: '29AAPPP1234B2Z3',
      contactPerson: 'Priya Sharma',
      createdAt: new Date('2024-02-01').toISOString(),
    },
    {
      id: 'client_3',
      name: 'Delhi Metro Rail Corporation',
      email: 'tender@dmrc.co.in',
      phone: '+91 11-4040-0000',
      address: 'DMRC Headquarters, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      gstin: '07AAPPP5678C2Z1',
      contactPerson: 'Amit Verma',
      createdAt: new Date('2024-02-10').toISOString(),
    },
  ];
  storage.setItem('clients', clients);
}

function initializeProjects() {
  const projects: Project[] = [
    {
      id: 'proj_1',
      name: 'Luxury Apartment Complex - Phase 1',
      clientId: 'client_1',
      description: 'Construction of 250-unit luxury residential complex',
      startDate: '2024-01-15',
      endDate: '2025-06-30',
      budget: 5000000,
      status: 'ongoing',
      location: 'Powai, Mumbai',
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'proj_2',
      name: 'Commercial Office Building',
      clientId: 'client_2',
      description: '15-story commercial complex with retail space',
      startDate: '2024-03-01',
      endDate: '2025-12-31',
      budget: 7500000,
      status: 'ongoing',
      location: 'Whitefield, Bangalore',
      createdAt: new Date('2024-03-01').toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'proj_3',
      name: 'Metro Station Extension',
      clientId: 'client_3',
      description: 'Civil construction for new metro station',
      startDate: '2024-02-01',
      endDate: '2025-03-31',
      budget: 12000000,
      status: 'ongoing',
      location: 'East Delhi',
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'proj_4',
      name: 'Educational Institution Campus',
      clientId: 'client_1',
      description: 'Campus infrastructure development - completed',
      startDate: '2023-01-01',
      endDate: '2024-11-30',
      budget: 3500000,
      status: 'completed',
      location: 'Thane, Mumbai',
      createdAt: new Date('2023-01-01').toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  storage.setItem('projects', projects);
}

function initializeBoqItems() {
  const boqItems: BOQItem[] = [
    // Project 1 BOQ items
    {
      id: 'boq_1',
      projectId: 'proj_1',
      itemName: 'Excavation & Foundation',
      description: 'Earth excavation and RCC foundation',
      quantity: 5000,
      unit: 'cum',
      rate: 500,
      totalAmount: 2500000,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'boq_2',
      projectId: 'proj_1',
      itemName: 'Structural Steel Work',
      description: 'Structural steel columns and beams',
      quantity: 800,
      unit: 'ton',
      rate: 50000,
      totalAmount: 40000000,
      createdAt: new Date().toISOString(),
    },
    // Project 2 BOQ items
    {
      id: 'boq_3',
      projectId: 'proj_2',
      itemName: 'Pile Foundation',
      description: 'Deep pile foundation work',
      quantity: 250,
      unit: 'no',
      rate: 100000,
      totalAmount: 25000000,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'boq_4',
      projectId: 'proj_2',
      itemName: 'RCC Columns',
      description: 'RCC column casting and finishing',
      quantity: 2000,
      unit: 'cum',
      rate: 8000,
      totalAmount: 16000000,
      createdAt: new Date().toISOString(),
    },
    // Project 3 BOQ items
    {
      id: 'boq_5',
      projectId: 'proj_3',
      itemName: 'Tunnel Excavation',
      description: 'Underground tunnel boring',
      quantity: 3000,
      unit: 'cum',
      rate: 3000,
      totalAmount: 9000000,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'boq_6',
      projectId: 'proj_3',
      itemName: 'Tunnel Lining',
      description: 'Concrete lining for tunnel',
      quantity: 5000,
      unit: 'sqm',
      rate: 500,
      totalAmount: 2500000,
      createdAt: new Date().toISOString(),
    },
  ];
  storage.setItem('boq_items', boqItems);
}

function initializeRunningBills() {
  const bills: RunningBill[] = [
    {
      id: 'bill_1',
      projectId: 'proj_1',
      billNumber: 'RB/2024/001',
      billDate: '2024-02-15',
      boqItems: [
        { itemId: 'boq_1', quantity: 1000, rate: 500, total: 500000 },
      ],
      subtotal: 500000,
      retentionPercentage: 10,
      retentionAmount: 50000,
      billAmount: 450000,
      status: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'bill_2',
      projectId: 'proj_2',
      billNumber: 'RB/2024/002',
      billDate: '2024-03-20',
      boqItems: [
        { itemId: 'boq_3', quantity: 50, rate: 100000, total: 5000000 },
      ],
      subtotal: 5000000,
      retentionPercentage: 10,
      retentionAmount: 500000,
      billAmount: 4500000,
      status: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  storage.setItem('running_bills', bills);
}

function initializeInvoices() {
  const invoices: Invoice[] = [
    {
      id: 'inv_1',
      projectId: 'proj_1',
      invoiceNumber: 'INV/2024/001',
      billId: 'bill_1',
      invoiceDate: '2024-02-15',
      dueDate: '2024-03-15',
      amount: 450000,
      tax: 81000,
      totalAmount: 531000,
      status: 'paid',
      clientId: 'client_1',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'inv_2',
      projectId: 'proj_2',
      invoiceNumber: 'INV/2024/002',
      billId: 'bill_2',
      invoiceDate: '2024-03-20',
      dueDate: '2024-04-20',
      amount: 4500000,
      tax: 810000,
      totalAmount: 5310000,
      status: 'sent',
      clientId: 'client_2',
      createdAt: new Date().toISOString(),
    },
  ];
  storage.setItem('invoices', invoices);
}

function initializeVendors() {
  const vendors: Vendor[] = [
    {
      id: 'vendor_1',
      name: 'Steel Supplies India Ltd',
      category: 'material',
      email: 'sales@steelsupplies.com',
      phone: '+91 98765-43210',
      address: 'Industrial Estate, Mumbai',
      gstin: '27AAPPP0000A1Z5',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'vendor_2',
      name: 'Concrete Pumping Services',
      category: 'labor',
      email: 'info@concretepump.com',
      phone: '+91 98765-43211',
      address: 'Construction Hub, Bangalore',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'vendor_3',
      name: 'Heavy Equipment Rentals',
      category: 'equipment',
      email: 'rentals@heavyequip.com',
      phone: '+91 98765-43212',
      address: 'Equipment Park, Delhi',
      createdAt: new Date().toISOString(),
    },
  ];
  storage.setItem('vendors', vendors);
}

function initializeMaterials() {
  const materials: Material[] = [
    {
      id: 'mat_1',
      name: 'Cement (50kg bag)',
      unit: 'bag',
      category: 'cement',
      reorderLevel: 500,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mat_2',
      name: 'Steel Bars (10mm)',
      unit: 'ton',
      category: 'steel',
      reorderLevel: 50,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mat_3',
      name: 'Fine Sand',
      unit: 'cum',
      category: 'aggregates',
      reorderLevel: 100,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mat_4',
      name: 'Coarse Aggregate 20mm',
      unit: 'cum',
      category: 'aggregates',
      reorderLevel: 150,
      createdAt: new Date().toISOString(),
    },
  ];
  storage.setItem('materials', materials);

  // Initialize material stock
  const materialStocks = materials.map(m => ({
    id: `stock_${m.id}`,
    materialId: m.id,
    currentStock: Math.floor(m.reorderLevel * 1.5),
    lastUpdated: new Date().toISOString(),
  }));
  storage.setItem('material_stock', materialStocks);
}

function initializeEquipment() {
  const equipmentList: Equipment[] = [
    {
      id: 'equip_1',
      name: 'Excavator CAT 320',
      category: 'excavator',
      serialNumber: 'CAT-2024-001',
      purchaseDate: '2022-06-15',
      purchaseValue: 2500000,
      status: 'in_use',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'equip_2',
      name: 'Tower Crane Liebherr 500HC',
      category: 'crane',
      serialNumber: 'LBH-2023-456',
      purchaseDate: '2023-03-20',
      purchaseValue: 5000000,
      status: 'in_use',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'equip_3',
      name: 'Concrete Pump',
      category: 'pump',
      serialNumber: 'PUMP-2024-789',
      purchaseDate: '2024-01-10',
      purchaseValue: 1500000,
      status: 'available',
      createdAt: new Date().toISOString(),
    },
  ];
  storage.setItem('equipment', equipmentList);

  // Initialize equipment allocation
  const allocations: EquipmentAllocation[] = [
    {
      id: 'alloc_1',
      equipmentId: 'equip_1',
      projectId: 'proj_1',
      allocationDate: '2024-01-20',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'alloc_2',
      equipmentId: 'equip_2',
      projectId: 'proj_2',
      allocationDate: '2024-03-05',
      createdAt: new Date().toISOString(),
    },
  ];
  storage.setItem('equipment_allocations', allocations);
}

function initializeDailyReports() {
  const reports: DailyReport[] = [
    {
      id: 'report_1',
      projectId: 'proj_1',
      reportDate: '2024-12-20',
      siteEngineer: 'Rajesh Kumar',
      workDescription: 'Foundation excavation work on Block A',
      quantityExecuted: 500,
      unit: 'cum',
      boqItemId: 'boq_1',
      weather: 'Partly cloudy, temperature 28°C',
      noOfWorkers: 25,
      remarks: 'Work progressing as per schedule',
      photos: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'report_2',
      projectId: 'proj_2',
      reportDate: '2024-12-20',
      siteEngineer: 'Priya Sharma',
      workDescription: 'Pile cap casting for east wing',
      quantityExecuted: 50,
      unit: 'no',
      boqItemId: 'boq_3',
      weather: 'Clear and dry',
      noOfWorkers: 30,
      remarks: 'Quality checks completed and passed',
      createdAt: new Date().toISOString(),
    },
  ];
  storage.setItem('daily_reports', reports);
}
