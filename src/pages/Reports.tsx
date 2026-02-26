import { useMemo } from 'react';
import { projectService, billingService, invoiceService } from '../utils/crudService';
import { storage } from '../utils/storage';
import { Table } from '../components/Table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const projects = projectService.getAll();
  const bills = billingService.getAll();
  const invoices = invoiceService.getAll();

  // Project-wise summary
  const projectSummary = useMemo(() => {
    return projects.map(project => {
      const projectBills = bills.filter(b => b.projectId === project.id);
      const projectInvoices = invoices.filter(i => i.projectId === project.id);
      const totalBilled = projectBills.reduce((sum, b) => sum + b.billAmount, 0);
      const totalInvoiced = projectInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
      const totalPaid = projectInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0);

      return {
        projectName: project.name,
        budget: project.budget,
        billed: totalBilled,
        invoiced: totalInvoiced,
        paid: totalPaid,
        pending: totalInvoiced - totalPaid,
        profitMargin: project.budget > 0 ? ((project.budget - totalBilled) / project.budget * 100).toFixed(2) : 0,
      };
    });
  }, [projects, bills, invoices]);

  // Billing summary by status
  const billingSummary = useMemo(() => {
    const statuses = ['draft', 'submitted', 'approved', 'paid'];
    return statuses.map(status => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count: bills.filter(b => b.status === status).length,
      amount: bills.filter(b => b.status === status).reduce((sum, b) => sum + b.billAmount, 0),
    }));
  }, [bills]);

  // Pending payments
  const pendingPayments = useMemo(() => {
    return invoices
      .filter(inv => inv.status !== 'paid')
      .map(inv => {
        const clients = storage.getItem<{ id: string; name: string }[]>('clients') || [];
        const client = clients.find((c: { id: string; name: string }) => c.id === inv.clientId);
        return {
          invoiceNumber: inv.invoiceNumber,
          clientName: client?.name || 'Unknown',
          dueDate: inv.dueDate,
          amount: inv.totalAmount,
          status: inv.status,
          daysOverdue: inv.status === 'overdue' 
            ? Math.floor((Date.now() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24))
            : 0,
        };
      });
  }, [invoices]);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-slate-600 mt-1">Project summaries and financial reports</p>
      </div>

      {/* Billing Summary Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Billing Status Summary</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={billingSummary}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="status" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="count" fill="#0ea5e9" name="Bill Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project-Wise Summary Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Project-Wise Financial Summary</h3>
        <Table
          columns={[
            { header: 'Project', accessor: 'projectName' },
            { header: 'Budget (₹)', accessor: 'budget', render: (v) => v.toLocaleString() },
            { header: 'Billed (₹)', accessor: 'billed', render: (v) => v.toLocaleString() },
            { header: 'Invoiced (₹)', accessor: 'invoiced', render: (v) => v.toLocaleString() },
            { header: 'Paid (₹)', accessor: 'paid', render: (v) => v.toLocaleString() },
            { header: 'Pending (₹)', accessor: 'pending', render: (v) => v.toLocaleString() },
            { 
              header: 'Profit Margin %', 
              accessor: 'profitMargin',
              render: (v) => `${v}%`,
            },
          ]}
          data={projectSummary}
        />
      </div>

      {/* Pending Payments Report */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Pending & Overdue Payments</h3>
        <Table
          columns={[
            { header: 'Invoice #', accessor: 'invoiceNumber' },
            { header: 'Client', accessor: 'clientName' },
            { header: 'Due Date', accessor: 'dueDate' },
            { header: 'Amount (₹)', accessor: 'amount', render: (v) => v.toLocaleString() },
            { header: 'Days Overdue', accessor: 'daysOverdue' },
            {
              header: 'Status',
              accessor: 'status',
              render: (status) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              ),
            },
          ]}
          data={pendingPayments}
          emptyMessage="All payments are up to date!"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card">
          <p className="text-sm font-medium text-slate-600">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            ₹{(projectSummary.reduce((sum, p) => sum + p.invoiced, 0) / 100000).toFixed(2)}L
          </p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-slate-600">Total Collected</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ₹{(projectSummary.reduce((sum, p) => sum + p.paid, 0) / 100000).toFixed(2)}L
          </p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-slate-600">Pending Payments</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            ₹{(pendingPayments.reduce((sum, p) => sum + p.amount, 0) / 100000).toFixed(2)}L
          </p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-slate-600">Avg Profit Margin</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {(projectSummary.reduce((sum, p) => sum + Number(p.profitMargin), 0) / projectSummary.length).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
