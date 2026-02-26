import { useState } from 'react';
import { boqService, projectService } from '../utils/crudService';
import { Modal } from '../components/Modal';
import { Table } from '../components/Table';
import { Form } from '../components/Form';
import { BOQItem, Project } from '../types';
import { Plus, Trash2 } from 'lucide-react';

export default function BOQ() {
  const [boqItems, setBoqItems] = useState<BOQItem[]>(boqService.getAll());
  const [projects] = useState<Project[]>(projectService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BOQItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');

  const filteredItems = selectedProject
    ? boqItems.filter(b => b.projectId === selectedProject)
    : boqItems;

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this BOQ item?')) {
      boqService.delete(id);
      setBoqItems(boqService.getAll());
    }
  };

  const handleSubmit = (values: Record<string, any>) => {
    const quantity = Number(values.quantity);
    const rate = Number(values.rate);
    const totalAmount = quantity * rate;

    if (editingItem) {
      boqService.update(editingItem.id, {
        ...editingItem,
        ...values,
        quantity,
        rate,
        totalAmount,
      });
    } else {
      boqService.create({
        projectId: values.projectId,
        itemName: values.itemName,
        description: values.description,
        quantity,
        unit: values.unit,
        rate,
        totalAmount,
      });
    }
    setBoqItems(boqService.getAll());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bill of Quantities</h1>
          <p className="text-slate-600 mt-1">Manage project BOQ items and rates</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add BOQ Item
        </button>
      </div>

      <div className="card">
        <label className="label-text">Filter by Project</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="input-field"
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <Table
        columns={[
          { header: 'Project', accessor: 'projectId', render: (id) => projects.find(p => p.id === id)?.name },
          { header: 'Item Name', accessor: 'itemName' },
          { header: 'Quantity', accessor: 'quantity' },
          { header: 'Unit', accessor: 'unit' },
          { header: 'Rate (₹)', accessor: 'rate', render: (val) => val.toLocaleString() },
          { header: 'Total (₹)', accessor: 'totalAmount', render: (val) => val.toLocaleString() },
        ]}
        data={filteredItems}
        rowActions={(item) => (
          <>
            <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
              <Trash2 size={18} />
            </button>
          </>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add BOQ Item">
        <Form
          fields={[
            { name: 'projectId', label: 'Project', type: 'select', required: true, options: projects.map(p => ({ value: p.id, label: p.name })) },
            { name: 'itemName', label: 'Item Name', type: 'text', required: true },
            { name: 'quantity', label: 'Quantity', type: 'number', required: true },
            { name: 'unit', label: 'Unit', type: 'text', required: true, col: 2 },
            { name: 'rate', label: 'Rate (₹)', type: 'number', required: true, col: 2 },
          ]}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
