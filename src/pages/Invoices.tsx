import { useState } from 'react';
import { invoiceService, projectService, clientService } from '../utils/crudService';
import { Modal } from '../components/Modal';
import { Table } from '../components/Table';
import { Form } from '../components/Form';
import { Invoice, Project, Client } from '../types';
import { Plus, Download } from 'lucide-react';

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(invoiceService.getAll());
  const [projects] = useState<Project[]>(projectService.getAll());
  const [clients] = useState<Client[]>(clientService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (values: Record<string, any>) => {
    const amount = Number(values.amount);
    const tax = amount * 0.18; // 18% GST

    invoiceService.create({
      projectId: values.projectId,
      clientId: values.clientId,
      invoiceNumber: values.invoiceNumber,
      billId: values.billId,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: values.dueDate,
      amount,
      tax,
      totalAmount: amount + tax,
      status: 'draft',
    });
    setInvoices(invoiceService.getAll());
    setIsModalOpen(false);
  };

  const updateInvoiceStatus = (invoiceId: string, status: 'draft' | 'sent' | 'paid' | 'overdue') => {
    invoiceService.update(invoiceId, { status });
    setInvoices(invoiceService.getAll());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-600 mt-1">Create and track client invoices</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> New Invoice
        </button>
      </div>

      <Table
        columns={[
          { header: 'Invoice #', accessor: 'invoiceNumber' },
          { header: 'Client', accessor: 'clientId', render: (id) => clients.find(c => c.id === id)?.name },
          { header: 'Amount (₹)', accessor: 'totalAmount', render: (val) => val.toLocaleString() },
          { header: 'Due Date', accessor: 'dueDate' },
          {
            header: 'Status',
            accessor: 'status',
            render: (status) => (
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                status === 'paid' ? 'bg-green-100 text-green-800' :
                status === 'sent' ? 'bg-blue-100 text-blue-800' :
                status === 'overdue' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            ),
          },
        ]}
        data={invoices}
        rowActions={(invoice) => (
          <>
            <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
              <Download size={18} />
            </button>
            <select
              value={invoice.status}
              onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value as any)}
              className="text-xs px-2 py-1 border border-slate-300 rounded"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Invoice">
        <Form
          fields={[
            { name: 'projectId', label: 'Project', type: 'select', required: true, options: projects.map(p => ({ value: p.id, label: p.name })) },
            { name: 'clientId', label: 'Client', type: 'select', required: true, options: clients.map(c => ({ value: c.id, label: c.name })) },
            { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', placeholder: 'INV/2024/001', required: true },
            { name: 'billId', label: 'Bill Reference', type: 'text', required: true, col: 2 },
            { name: 'amount', label: 'Amount (₹)', type: 'number', required: true },
            { name: 'dueDate', label: 'Due Date', type: 'date', required: true, col: 2 },
          ]}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
