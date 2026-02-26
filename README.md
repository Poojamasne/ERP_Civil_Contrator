# ERP CIVI - Professional Civil Contractor ERP System

A complete, production-ready frontend ERP system built for civil contractors. This is a full-featured demo application that runs entirely on the frontend using localStorage, making it perfect for demonstrations, prototypes, and frontend development.

## 🎯 Features

### Core Modules

- **Dashboard**: KPI metrics, revenue charts, project status breakdown, recent transactions
- **Project Management**: Create, edit, delete projects with budget tracking and status management
- **Bill of Quantities (BOQ)**: Define project line items with quantities, rates, and auto-calculated totals
- **Billing System**: Create running bills and final bills with automatic retention calculations
- **Invoicing**: Generate client invoices, track payment status, GST calculations
- **Client Management**: Maintain detailed client records with GSTIN, addresses, contact info
- **Vendor Management**: Track vendors, subcontractors with category classification
- **Inventory**: Materials management with stock tracking and reorder level alerts
- **Equipment**: Manage machinery and equipment with allocation tracking
- **Daily Reports**: Site engineer daily work logs with photo support (base64 storage)
- **Reports**: Financial summaries, project-wise breakdowns, pending payments analysis

### Advanced Features

- **Role-Based Access Control**: 4 user roles (Admin, Finance Manager, Project Manager, Site Engineer)
- **localStorage Persistence**: All data persists across browser sessions
- **Real-time Calculations**: Auto-calculations for totals, retention, GST, profit margins
- **Charts & Analytics**: Recharts integration for visual data representation
- **Professional UI**: Modern, responsive design with Tailwind CSS
- **Modal Forms**: User-friendly forms with validation
- **Data Tables**: Professional tables with sorting, filtering, actions

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📋 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Sidebar and layout
│   ├── auth/           # Login modal
│   ├── KPICard.tsx     # Dashboard KPI cards
│   ├── Modal.tsx       # Modal component
│   ├── Table.tsx       # Data tables
│   └── Form.tsx        # Form component
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   ├── BOQ.tsx
│   ├── Billing.tsx
│   ├── Invoices.tsx
│   ├── Clients.tsx
│   ├── Vendors.tsx
│   ├── Inventory.tsx
│   ├── Equipment.tsx
│   ├── DailyReports.tsx
│   └── Reports.tsx
├── store/              # Zustand state management
│   └── index.ts        # App store with auth & permissions
├── utils/
│   ├── storage.ts      # localStorage utilities (mockable for APIs)
│   ├── crudService.ts  # CRUD operations for all modules
│   └── seedData.ts     # Demo data initialization
├── types/              # TypeScript interfaces
│   └── index.ts        # All data type definitions
├── App.tsx             # Main app component
├── main.tsx            # React entry point
└── index.css           # Tailwind CSS styles
```

## 🔐 User Roles & Permissions

### Admin
- Full access to all modules
- Can create, edit, delete any entity
- Access to all reports

### Finance Manager
- View financial data (invoices, bills, payments)
- Create and manage invoices
- Approve payments
- Financial reports

### Project Manager
- Project creation and management
- BOQ and billing management
- Daily reports viewing
- Equipment and vendor management

### Site Engineer
- View assigned projects
- Submit daily reports
- View site expenses
- Photo uploads

## 💾 Data Persistence

All data is stored in the browser's localStorage using a custom storage service. This makes it perfect for:

- **Demos**: Run locally without any backend
- **Prototypes**: Validate UX before backend development
- **Testing**: Easy data reset and isolation

### localStorage Keys

All data is namespaced with `erp_civi:` prefix:

```
erp_civi:currentUser          # Logged-in user
erp_civi:projects            # Project records
erp_civi:clients             # Client records
erp_civi:boq_items           # BOQ items
erp_civi:running_bills       # Running bills
erp_civi:invoices            # Invoices
erp_civi:vendors             # Vendors
erp_civi:materials           # Materials
erp_civi:material_stock      # Stock levels
erp_civi:equipment           # Equipment
erp_civi:equipment_allocations # Equipment assignments
erp_civi:daily_reports       # Daily work reports
```

## 🔄 CRUD Operations

All CRUD operations are handled by the `crudService` module:

```typescript
import { projectService, clientService, boqService } from '@/utils/crudService';

// Get all
const projects = projectService.getAll();

// Get by ID
const project = projectService.getById('proj_1');

// Create
const newProject = projectService.create({
  name: 'New Project',
  clientId: 'client_1',
  // ... other fields
});

// Update
projectService.update('proj_1', { status: 'ongoing' });

// Delete
projectService.delete('proj_1');
```

## 🎨 UI Components

### Reusable Components

#### KPICard
```tsx
<KPICard
  title="Total Projects"
  value={42}
  color="blue"
  change={8}
  icon={<Briefcase />}
/>
```

#### Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Project"
  size="lg"
>
  {/* Content */}
</Modal>
```

#### Table
```tsx
<Table
  columns={[
    { header: 'Name', accessor: 'name' },
    { header: 'Status', accessor: 'status' }
  ]}
  data={data}
  rowActions={(row) => <button>Edit</button>}
/>
```

#### Form
```tsx
<Form
  fields={[
    { name: 'name', label: 'Project Name', type: 'text', required: true },
    { name: 'status', label: 'Status', type: 'select', options: [...] }
  ]}
  onSubmit={(values) => handleSubmit(values)}
/>
```

## 🔌 API Integration (Future)

The architecture is designed to easily swap localStorage with backend APIs:

```typescript
// Current: localStorage
export const storage = { /* localStorage implementation */ };

// Future: Replace with API calls
export const storage = {
  getItem: async (key) => {
    const response = await fetch(`/api/${key}`);
    return response.json();
  },
  setItem: async (key, value) => {
    return fetch(`/api/${key}`, { method: 'POST', body: JSON.stringify(value) });
  },
};
```

The CRUD services and all pages will work without modifications!

## 📊 Demo Data

The system comes pre-populated with realistic demo data:

- **4 Sample Projects**: Various civil construction projects
- **3 Sample Clients**: Real company names and details
- **10+ BOQ Items**: Sample bill of quantity entries
- **Sample Bills & Invoices**: With different statuses
- **4 Vendors**: Material suppliers and labor contractors
- **Equipment List**: Construction machinery with allocations
- **Daily Reports**: Sample site engineer reports

To reset data:
```javascript
// In browser console
localStorage.clear();
location.reload(); // Reload to reinitialize seed data
```

## 🎯 Common Use Cases

### Creating a Project
1. Navigate to Projects module
2. Click "New Project"
3. Fill in project details (name, client, dates, budget)
4. Select status (Planning/Ongoing/Completed)
5. Click Create

### Adding BOQ Items
1. Go to BOQ module
2. Filter by project
3. Click "Add BOQ Item"
4. Enter item details (quantity, unit, rate)
5. System auto-calculates total amount

### Creating Bills
1. Navigate to Billing module
2. Click "Create Bill"
3. Select project and BOQ items
4. System calculates retention automatically
5. Change status through dropdown

### Generating Invoices
1. Go to Invoices module
2. Click "New Invoice"
3. Link to a bill
4. System calculates GST (18%)
5. Track payment status

## 🛠 Technology Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Storage**: Browser localStorage

## 📱 Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design

## 🔒 Data Security Notes

**Important**: Since this is a frontend-only demo using localStorage:

- Data is stored unencrypted in browser storage
- Data is lost if browser cache is cleared
- Not suitable for production use with real data
- Use only for demos and prototypes

For production, replace localStorage with secure backend APIs and implement proper authentication/authorization.

## 🚀 Deployment

### Deploy as Static Site

The app can be deployed to any static hosting service:

```bash
# Build
npm run build

# Deploy dist/ folder to:
# - Netlify
# - Vercel
# - GitHub Pages
# - AWS S3
# - Cloudflare Pages
```

## 📚 Key Modules Explained

### Storage Service (`utils/storage.ts`)
Handles all localStorage operations with try-catch error handling. Mockable interface for future API replacement.

### CRUD Service (`utils/crudService.ts`)
Provides CRUD operations for each entity. Each service auto-generates IDs and timestamps.

### Store (`store/index.ts`)
Zustand store handles:
- User authentication state
- Role-based permissions
- Current navigation module
- Permission checking methods

### Type Definitions (`types/index.ts`)
Complete TypeScript interfaces for all data models with proper typing.

## 🎓 Learning Resource

This project demonstrates:
- ✅ React hooks and component composition
- ✅ TypeScript best practices
- ✅ State management with Zustand
- ✅ localStorage API usage
- ✅ Form validation and handling
- ✅ Table components with pagination
- ✅ Chart integration
- ✅ Modal dialogs
- ✅ Responsive design
- ✅ RBAC implementation

## 📝 License

MIT - Feel free to use this template for your projects!

## 🤝 Contributing

This demo can be extended with:
- More modules (HR, Payroll, Accounts, etc.)
- Advanced filtering and search
- Export to PDF/Excel
- Real-time notifications
- Multi-language support
- Dark mode theme
- Mobile app version

## 📧 Support

For issues or questions:
1. Check the demo data in `utils/seedData.ts`
2. Review component examples in `pages/`
3. Check TypeScript types in `types/index.ts`
4. Inspect localStorage in browser DevTools

---

**Built with ❤️ for Civil Contractors | Made with React + TypeScript**

**Version**: 1.0.0  
**Last Updated**: February 26, 2026
#   E R P _ C i v i l _ C o n t r a t o r  
 