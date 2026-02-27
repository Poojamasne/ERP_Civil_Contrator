import { useState } from 'react';
import { materialService } from '../utils/crudService';
import { storage } from '../utils/storage';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { Form } from '../components/Form';
import { Material, MaterialStock } from '../types';
import { Plus, AlertTriangle } from 'lucide-react';

export default function Inventory() {
  const [materials, setMaterials] = useState<Material[]>(materialService.getAll());
  const [stocks] = useState<MaterialStock[]>(storage.getItem('material_stock') || []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (values: Record<string, any>) => {
    const material = materialService.create({
      name: values.name,
      description: values.description,
      unit: values.unit,
      category: values.category,
      reorderLevel: Number(values.reorderLevel),
    });

    // Create initial stock
    const stock: MaterialStock = {
      id: `stock_${material.id}`,
      materialId: material.id,
      currentStock: 0,
      lastUpdated: new Date().toISOString(),
    };
    const existingStocks = storage.getItem<MaterialStock[]>('material_stock') || [];
    existingStocks.push(stock);
    storage.setItem('material_stock', existingStocks);

    setMaterials(materialService.getAll());
    setIsModalOpen(false);
  };

  const getStock = (materialId: string) => {
    const stock = stocks.find(s => s.materialId === materialId);
    return stock?.currentStock || 0;
  };

  const getMaterial = (materialId: string) => {
    return materials.find(m => m.id === materialId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Inventory & Materials</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Track materials and stock levels</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus size={20} /> Add Material
        </button>
      </div>

      <Table
        columns={[
          { header: 'Material Name', accessor: 'name' },
          { header: 'Category', accessor: 'category' },
          { header: 'Unit', accessor: 'unit' },
          { header: 'Current Stock', accessor: 'id', render: (id) => getStock(id) },
          { header: 'Reorder Level', accessor: 'reorderLevel' },
          {
            header: 'Status',
            accessor: 'id',
            render: (id) => {
              const material = getMaterial(id);
              const stock = getStock(id);
              const isLow = material && stock < material.reorderLevel;
              return isLow ? (
                <span className="flex items-center gap-1 text-orange-600 font-semibold">
                  <AlertTriangle size={16} /> Low Stock
                </span>
              ) : (
                <span className="text-green-600 font-semibold">✓ OK</span>
              );
            },
          },
        ]}
        data={materials}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Material">
        <Form
          fields={[
            { name: 'name', label: 'Material Name', type: 'text', required: true },
            { name: 'unit', label: 'Unit', type: 'text', required: true, col: 2 },
            { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Cement, Steel' },
            { name: 'reorderLevel', label: 'Reorder Level', type: 'number', defaultValue: '100', col: 2 },
            { name: 'description', label: 'Description', type: 'textarea', col: 2 },
          ]}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
