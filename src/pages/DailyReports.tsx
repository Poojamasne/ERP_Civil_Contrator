import { useState } from 'react';
import { dailyReportService, projectService, boqService } from '../utils/crudService';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { Form } from '../components/Form';
import { DailyReport, Project, BOQItem } from '../types';
import { Plus, FileText } from 'lucide-react';

export default function DailyReports() {
  const [reports, setReports] = useState<DailyReport[]>(dailyReportService.getAll());
  const [projects] = useState<Project[]>(projectService.getAll());
  const [boqItems] = useState<BOQItem[]>(boqService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');

  const filteredReports = selectedProject
    ? reports.filter(r => r.projectId === selectedProject)
    : reports;

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (values: Record<string, any>) => {
    dailyReportService.create({
      projectId: values.projectId,
      reportDate: new Date().toISOString().split('T')[0],
      siteEngineer: values.siteEngineer,
      workDescription: values.workDescription,
      quantityExecuted: Number(values.quantityExecuted),
      unit: values.unit,
      boqItemId: values.boqItemId || undefined,
      weather: values.weather,
      noOfWorkers: values.noOfWorkers ? Number(values.noOfWorkers) : undefined,
      remarks: values.remarks,
      photos: [],
    });
    setReports(dailyReportService.getAll());
    setIsModalOpen(false);
  };

  const projectBoqItems = selectedProject
    ? boqItems.filter(b => b.projectId === selectedProject)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Daily Site Reports</h1>
          <p className="text-slate-600 mt-1">Log daily site activities and progress</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> New Report
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
          { header: 'Date', accessor: 'reportDate' },
          { header: 'Project', accessor: 'projectId', render: (id) => projects.find(p => p.id === id)?.name },
          { header: 'Site Engineer', accessor: 'siteEngineer' },
          { header: 'Work Description', accessor: 'workDescription', width: '30%' },
          { header: 'Quantity', accessor: 'quantityExecuted', render: (qty, row) => `${qty} ${row.unit}` },
          { header: 'Workers', accessor: 'noOfWorkers' },
        ]}
        data={filteredReports}
        rowActions={() => (
          <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
            <FileText size={18} />
          </button>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Daily Report">
  <Form
    fields={[
      { name: 'projectId', label: 'Project', type: 'select', required: true, options: projects.map(p => ({ value: p.id, label: p.name })) },
      { name: 'siteEngineer', label: 'Site Engineer Name', type: 'text', required: true, col: 2 },
      { 
        name: 'workDescription', 
        label: 'Work Description', 
        type: 'textarea', 
        required: true,
        className: 'h-10' // Add custom class for smaller height
      },
      { name: 'boqItemId', label: 'BOQ Item (Optional)', type: 'select', options: [
        { value: '', label: 'Select BOQ Item' },
        ...projectBoqItems.map(b => ({ value: b.id, label: b.itemName })),
      ], col: 2 },
      { name: 'quantityExecuted', label: 'Quantity Executed', type: 'number', required: true },
      { name: 'unit', label: 'Unit', type: 'text', placeholder: 'e.g., cum, m³, boxes', col: 2 },
      { name: 'weather', label: 'Weather Conditions', type: 'text', placeholder: 'Clear, Rainy, etc.' },
      { name: 'noOfWorkers', label: 'No of Workers', type: 'number', col: 2 },
      { 
        name: 'remarks', 
        label: 'Remarks', 
        type: 'textarea',
        className: 'h-10' 
      },
    ]}
    onSubmit={handleSubmit}
    onCancel={() => setIsModalOpen(false)}
  />
</Modal>
    </div>
  );
}
