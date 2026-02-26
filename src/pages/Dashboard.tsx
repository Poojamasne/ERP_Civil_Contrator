import { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { storage } from '../utils/storage';
import { KPICard } from '../components/KPICard';
import { Table } from '../components/Table';
import { Project, RunningBill, Invoice } from '../types';
import { TrendingUp, DollarSign, Briefcase, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const kpis = useMemo(() => {
    const projects = storage.getItem<Project[]>('projects') || [];
    const runningBills = storage.getItem<RunningBill[]>('running_bills') || [];
    const invoices = storage.getItem<Invoice[]>('invoices') || [];

    const totalProjects = projects.length;
    const ongoingProjects = projects.filter(p => p.status === 'ongoing').length;
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalBilled = runningBills.reduce((sum, b) => sum + b.billAmount, 0);
    const pendingPayments = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.totalAmount, 0);
    const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0);
    const profitEstimate = paidAmount - (totalBilled * 0.6); // Rough estimate

    return {
      totalProjects,
      ongoingProjects,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      totalBudget,
      totalBilled,
      pendingPayments,
      paidAmount,
      profitEstimate: Math.max(0, profitEstimate),
    };
  }, []);

  // Chart data
  const monthlyBillingData = [
    { month: 'Jan', billing: 450000, target: 500000 },
    { month: 'Feb', billing: 520000, target: 500000 },
    { month: 'Mar', billing: 480000, target: 500000 },
    { month: 'Apr', billing: 610000, target: 600000 },
    { month: 'May', billing: 720000, target: 700000 },
    { month: 'Jun', billing: 580000, target: 650000 },
  ];

  const projectStatusData = [
    { name: 'Ongoing', value: kpis.ongoingProjects, color: '#0ea5e9' },
    { name: 'Completed', value: kpis.completedProjects, color: '#10b981' },
    { name: 'On Hold', value: Math.max(0, kpis.totalProjects - kpis.ongoingProjects - kpis.completedProjects), color: '#f59e0b' },
  ];

  const recentInvoices = useMemo(() => {
    const invoices = storage.getItem<Invoice[]>('invoices') || [];
    const clients = storage.getItem<{ id: string; name: string }[]>('clients') || [];
    return invoices.slice(-5).map(inv => ({
      ...inv,
      clientName: clients.find(c => c.id === inv.clientId)?.name || 'Unknown',
    }));
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your project overview.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          title="Total Projects"
          value={kpis.totalProjects}
          color="blue"
          icon={<Briefcase size={32} />}
        />
        <KPICard
          title="Ongoing Projects"
          value={kpis.ongoingProjects}
          color="orange"
          icon={<TrendingUp size={32} />}
        />
        <KPICard
          title="Total Budget"
          value={`₹${(kpis.totalBudget / 1000000).toFixed(1)}M`}
          color="purple"
          icon={<DollarSign size={32} />}
        />
        <KPICard
          title="Pending Payments"
          value={`₹${(kpis.pendingPayments / 100000).toFixed(1)}L`}
          color="red"
          icon={<AlertCircle size={32} />}
        />
      </div>

      {/* Secondary KPI Row */}
      <div className="grid grid-cols-3 gap-6">
        <KPICard
          title="Total Billed"
          value={`₹${(kpis.totalBilled / 100000).toFixed(1)}L`}
          color="green"
          change={8}
        />
        <KPICard
          title="Paid Amount"
          value={`₹${(kpis.paidAmount / 100000).toFixed(1)}L`}
          color="blue"
          change={12}
        />
        <KPICard
          title="Profit Estimate"
          value={`₹${(kpis.profitEstimate / 100000).toFixed(1)}L`}
          color="green"
          change={5}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Billing Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Monthly Billing Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyBillingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="billing" fill="#0ea5e9" name="Actual Billing" />
              <Bar dataKey="target" fill="#cbd5e1" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Status Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Project Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Invoices</h3>
        <Table
          columns={[
            { header: 'Invoice #', accessor: 'invoiceNumber' },
            { header: 'Client', accessor: 'clientName' },
            {
              header: 'Amount',
              accessor: 'totalAmount',
              render: (val) => `₹${(val / 100000).toFixed(2)}L`,
            },
            { header: 'Due Date', accessor: 'dueDate' },
            {
              header: 'Status',
              accessor: 'status',
              render: (status) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              ),
            },
          ]}
          data={recentInvoices}
        />
      </div>
    </div>
  );
}
