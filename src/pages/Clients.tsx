import { useState } from 'react';
import { clientService } from '../utils/crudService';
import { Modal } from '../components/Modal';
import { Table } from '../components/Table';
import { Form } from '../components/Form';
import { Client } from '../types';
import { Plus, Edit2, Trash2, Mail, Phone } from 'lucide-react';

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(clientService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleCreate = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this client?')) {
      clientService.delete(id);
      setClients(clientService.getAll());
    }
  };

  const handleSubmit = (values: Record<string, any>) => {
    const clientData = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      city: values.city,
      state: values.state,
      zipCode: values.zipCode,
      gstin: values.gstin,
      contactPerson: values.contactPerson,
    };
    
    if (editingClient) {
      clientService.update(editingClient.id, clientData);
    } else {
      clientService.create(clientData);
    }
    setClients(clientService.getAll());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Clients</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Manage client information</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus size={20} /> Add Client
        </button>
      </div>

      <Table
        columns={[
          { header: 'Company Name', accessor: 'name' },
          { header: 'Contact Person', accessor: 'contactPerson' },
          { header: 'Email', accessor: 'email' },
          { header: 'Phone', accessor: 'phone' },
          { header: 'City', accessor: 'city' },
          { header: 'GSTIN', accessor: 'gstin' },
        ]}
        data={clients}
        rowActions={(client) => (
          <>
            <a href={`mailto:${client.email}`} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
              <Mail size={18} />
            </a>
            <a href={`tel:${client.phone}`} className="p-2 hover:bg-green-50 rounded-lg text-green-600">
              <Phone size={18} />
            </a>
            <button onClick={() => handleEdit(client)} className="p-2 hover:bg-yellow-50 rounded-lg text-yellow-600">
              <Edit2 size={18} />
            </button>
            <button onClick={() => handleDelete(client.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
              <Trash2 size={18} />
            </button>
          </>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? 'Edit Client' : 'Add New Client'}>
        <Form
          fields={[
            { name: 'name', label: 'Company Name', type: 'text', required: true, defaultValue: editingClient?.name },
            { name: 'contactPerson', label: 'Contact Person', type: 'text', defaultValue: editingClient?.contactPerson, col: 2 },
            { name: 'email', label: 'Email', type: 'email', required: true, defaultValue: editingClient?.email },
            { name: 'phone', label: 'Phone', type: 'text', required: true, defaultValue: editingClient?.phone, col: 2 },
            { name: 'address', label: 'Address', type: 'text', defaultValue: editingClient?.address },
            { name: 'city', label: 'City', type: 'text', defaultValue: editingClient?.city, col: 2 },
            { name: 'state', label: 'State', type: 'text', defaultValue: editingClient?.state },
            { name: 'zipCode', label: 'ZIP Code', type: 'text', defaultValue: editingClient?.zipCode, col: 2 },
            { name: 'gstin', label: 'GSTIN', type: 'text', defaultValue: editingClient?.gstin },
          ]}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          submitText={editingClient ? 'Update' : 'Add'}
        />
      </Modal>
    </div>
  );
}
