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
    if (!values.projectId) {
      alert('Please select a project');
      return;
    }
    if (!values.billNumber || values.billNumber.trim() === '') {
      alert('Bill number is required');
      return;
    }
    if (!values.billDate) {
      alert('Bill date is required');
      return;
    }

    const billAmount = Number(values.billAmount || 0);
    const retentionPercentage = Number(values.retentionPercentage || 10);

    if (isNaN(billAmount) || billAmount <= 0) {
      alert('Bill amount must be greater than 0');
      return;
    }
    if (isNaN(retentionPercentage) || retentionPercentage < 0 || retentionPercentage > 100) {
      alert('Retention percentage must be between 0 and 100');
      return;
    }

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
          { header: 'Bill #', accessor: 'billNumber', width: '12%' },
          { header: 'Project', accessor: 'projectId', width: '20%', render: (id) => projects.find(p => p.id === id)?.name },
          { header: 'Bill Date', accessor: 'billDate', width: '15%' },
          { header: 'Amount (₹)', accessor: 'billAmount', width: '15%', render: (val) => val.toLocaleString('en-IN') },
          { header: 'Retention %', accessor: 'retentionPercentage', width: '12%', render: (val) => `${val}%` },
          {
            header: 'Status',
            accessor: 'status',
            width: '12%',
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
