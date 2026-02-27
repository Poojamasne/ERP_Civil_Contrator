import { useState } from 'react';
import { billingService, projectService } from '../utils/crudService';
import { Modal } from '../components/Modal';
import { Table } from '../components/Table';
import { Form } from '../components/Form';
import { RunningBill, Project } from '../types';
import { Plus, Eye } from 'lucide-react';

export default function Billing() {
  const [bills, setBills] = useState<RunningBill[]>(billingService.getAll());
  const [projects] = useState<Project[]>(projectService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<RunningBill | null>(null);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (values: Record<string, any>) => {
    const billAmount = Number(values.billAmount || 0);
    const retentionPercentage = Number(values.retentionPercentage || 10);
    const retentionAmount = billAmount * (retentionPercentage / 100);
    const subtotal = billAmount + retentionAmount;

    billingService.create({
      projectId: values.projectId,
      billNumber: values.billNumber,
      billDate: values.billDate,
      billAmount,
      retentionPercentage,
      retentionAmount,
      subtotal,
      boqItems: [],
      status: 'draft',
    });
    setBills(billingService.getAll());
    setIsModalOpen(false);
  };

  const updateBillStatus = (billId: string, status: 'draft' | 'submitted' | 'approved' | 'paid') => {
    billingService.update(billId, { status });
    setBills(billingService.getAll());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Billing & Running Bills</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Create and manage project bills</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus size={20} /> Create Bill
        </button>
      </div>

      <Table
        columns={[
          { header: 'Bill #', accessor: 'billNumber' },
          { header: 'Project', accessor: 'projectId', render: (id) => projects.find(p => p.id === id)?.name },
          { header: 'Bill Date', accessor: 'billDate' },
          { header: 'Amount (₹)', accessor: 'billAmount', render: (val) => val.toLocaleString() },
          { header: 'Retention %', accessor: 'retentionPercentage', render: (val) => `${val}%` },
          {
            header: 'Status',
            accessor: 'status',
            render: (status) => (
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                status === 'approved' ? 'bg-green-100 text-green-800' :
                status === 'paid' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            ),
          },
        ]}
        data={bills}
        rowActions={(bill) => (
          <>
            <button onClick={() => setSelectedBill(bill)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
              <Eye size={18} />
            </button>
            <select
              value={bill.status}
              onChange={(e) => updateBillStatus(bill.id, e.target.value as any)}
              className="text-xs px-2 py-1 border border-slate-300 rounded"
            >
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
            </select>
          </>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Running Bill">
        <Form
          fields={[
            { name: 'projectId', label: 'Project', type: 'select', required: true, options: projects.map(p => ({ value: p.id, label: p.name })) },
            { name: 'billNumber', label: 'Bill Number', type: 'text', placeholder: '', required: true },
            { name: 'billDate', label: 'Bill Date', type: 'date', required: true, col: 2 },
            { name: 'billAmount', label: 'Bill Amount (₹)', type: 'number', required: true },
            { name: 'retentionPercentage', label: 'Retention %', type: 'number', defaultValue: '10', col: 2 },
          ]}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={!!selectedBill} onClose={() => setSelectedBill(null)} title="Bill Details">
        {selectedBill && (
          <div className="space-y-4">
            <div><strong>Bill #:</strong> {selectedBill.billNumber}</div>
            <div><strong>Amount:</strong> ₹{selectedBill.billAmount.toLocaleString()}</div>
            <div><strong>Retention:</strong> ₹{selectedBill.retentionAmount.toLocaleString()}</div>
            <div><strong>Subtotal:</strong> ₹{selectedBill.subtotal.toLocaleString()}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
