import { useState } from 'react';
import { vendorService } from '../utils/crudService';
import { Modal } from '../components/Modal';
import { Table } from '../components/Table';
import { Form } from '../components/Form';
import { Vendor } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>(vendorService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const handleCreate = () => {
    setEditingVendor(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this vendor?')) {
      vendorService.delete(id);
      setVendors(vendorService.getAll());
    }
  };

  const handleSubmit = (values: Record<string, any>) => {
    const vendorData = {
      name: values.name,
      category: values.category,
      email: values.email,
      phone: values.phone,
      address: values.address,
      gstin: values.gstin,
      bankAccount: values.bankAccount,
    };
    
    if (editingVendor) {
      vendorService.update(editingVendor.id, vendorData);
    } else {
      vendorService.create(vendorData);
    }
    setVendors(vendorService.getAll());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vendors & Subcontractors</h1>
          <p className="text-slate-600 mt-1">Manage vendor and subcontractor information</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Vendor
        </button>
      </div>

      <Table
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Category', accessor: 'category', render: (v) => v.charAt(0).toUpperCase() + v.slice(1).replace('_', ' ') },
          { header: 'Email', accessor: 'email' },
          { header: 'Phone', accessor: 'phone' },
          { header: 'City', accessor: 'address', render: (a) => a?.split(',').pop()?.trim() || '-' },
          { header: 'GSTIN', accessor: 'gstin' },
        ]}
        data={vendors}
        rowActions={(vendor) => (
          <>
            <button onClick={() => { setEditingVendor(vendor); setIsModalOpen(true); }} className="p-2 hover:bg-yellow-50 rounded-lg text-yellow-600">
              <Edit2 size={18} />
            </button>
            <button onClick={() => handleDelete(vendor.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
              <Trash2 size={18} />
            </button>
          </>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingVendor ? 'Edit Vendor' : 'Add Vendor'}>
        <Form
          fields={[
            { name: 'name', label: 'Vendor Name', type: 'text', required: true, defaultValue: editingVendor?.name },
            { name: 'category', label: 'Category', type: 'select', required: true, defaultValue: editingVendor?.category, options: [
              { value: 'labor', label: 'Labor' },
              { value: 'material', label: 'Material' },
              { value: 'equipment', label: 'Equipment' },
              { value: 'subcontractor', label: 'Subcontractor' },
            ], col: 2 },
            { name: 'email', label: 'Email', type: 'email', defaultValue: editingVendor?.email },
            { name: 'phone', label: 'Phone', type: 'text', required: true, defaultValue: editingVendor?.phone, col: 2 },
            { name: 'address', label: 'Address', type: 'text', defaultValue: editingVendor?.address },
            { name: 'gstin', label: 'GSTIN', type: 'text', defaultValue: editingVendor?.gstin, col: 2 },
            { name: 'bankAccount', label: 'Bank Account', type: 'text', defaultValue: editingVendor?.bankAccount },
          ]}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          submitText={editingVendor ? 'Update' : 'Add'}
        />
      </Modal>
    </div>
  );
}
