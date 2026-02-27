import { useState } from 'react';
import { equipmentService, projectService } from '../utils/crudService';
import { storage } from '../utils/storage';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { Form } from '../components/Form';
import { Equipment, EquipmentAllocation, Project } from '../types';
import { Plus } from 'lucide-react';

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState<Equipment[]>(equipmentService.getAll());
  const [projects] = useState<Project[]>(projectService.getAll());
  const [allocations] = useState<EquipmentAllocation[]>(storage.getItem('equipment_allocations') || []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (values: Record<string, any>) => {
    equipmentService.create({
      name: values.name,
      category: values.category,
      serialNumber: values.serialNumber,
      purchaseDate: values.purchaseDate,
      purchaseValue: values.purchaseValue ? Number(values.purchaseValue) : undefined,
      status: values.status || 'available',
    });
    setEquipments(equipmentService.getAll());
    setIsModalOpen(false);
  };

  const getProjectAssignment = (equipmentId: string) => {
    const allocation = allocations.find(
      a => a.equipmentId === equipmentId && !a.deallocationDate
    );
    if (allocation) {
      const project = projects.find(p => p.id === allocation.projectId);
      return project?.name || 'Unknown';
    }
    return '-';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Equipment & Machinery</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Manage equipment and allocations</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus size={20} /> Add Equipment
        </button>
      </div>

      <Table
        columns={[
          { header: 'Equipment Name', accessor: 'name' },
          { header: 'Category', accessor: 'category' },
          { header: 'Serial #', accessor: 'serialNumber' },
          { header: 'Value (₹)', accessor: 'purchaseValue', render: (v) => v ? v.toLocaleString() : '-' },
          { header: 'Assigned to', accessor: 'id', render: (id) => getProjectAssignment(id) },
          {
            header: 'Status',
            accessor: 'status',
            render: (status) => (
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                status === 'in_use' ? 'bg-blue-100 text-blue-800' :
                status === 'available' ? 'bg-green-100 text-green-800' :
                status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
              </span>
            ),
          },
        ]}
        data={equipments}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Equipment">
        <Form
          fields={[
            { name: 'name', label: 'Equipment Name', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'text', required: true, col: 2 },
            { name: 'serialNumber', label: 'Serial Number', type: 'text' },
            { name: 'purchaseDate', label: 'Purchase Date', type: 'date', col: 2 },
            { name: 'purchaseValue', label: 'Purchase Value (₹)', type: 'number' },
            { name: 'status', label: 'Status', type: 'select', defaultValue: 'available', col: 2, options: [
              { value: 'available', label: 'Available' },
              { value: 'in_use', label: 'In Use' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'retired', label: 'Retired' },
            ] },
          ]}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
