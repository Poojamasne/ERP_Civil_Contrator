import { useState } from 'react';
import { projectService, clientService } from '../utils/crudService';
import { Modal } from '../components/Modal';
import { Table } from '../components/Table';
import { Form } from '../components/Form';
import type { FormField } from '../components/Form';
import { Project, Client } from '../types';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(projectService.getAll());
  const [clients] = useState<Client[]>(clientService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const formFields: FormField[] = [
    {
      name: 'name',
      label: 'Project Name',
      type: 'text',
      placeholder: 'Enter project name',
      required: true,
      defaultValue: editingProject?.name,
    },
    {
      name: 'clientId',
      label: 'Client',
      type: 'select',
      required: true,
      options: clients.map(c => ({ value: c.id, label: c.name })),
      defaultValue: editingProject?.clientId,
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
      defaultValue: editingProject?.startDate,
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
      defaultValue: editingProject?.endDate,
    },
    {
      name: 'budget',
      label: 'Budget (₹)',
      type: 'number',
      placeholder: '0',
      required: true,
      defaultValue: editingProject?.budget,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: editingProject?.status,
      options: [
        { value: 'planning', label: 'Planning' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'completed', label: 'Completed' },
        { value: 'on_hold', label: 'On Hold' },
      ],
      col: 2,
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'Project location',
      defaultValue: editingProject?.location,
      col: 2,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Project description',
      defaultValue: editingProject?.description,
      col: 2,
    },
  ];

  const handleCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      projectService.delete(id);
      setProjects(projectService.getAll());
    }
  };

  const handleSubmit = (values: Record<string, any>) => {
    const projectData = {
      name: values.name,
      clientId: values.clientId,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      budget: Number(values.budget),
      status: values.status || 'planning',
      location: values.location,
    };
    
    if (editingProject) {
      projectService.update(editingProject.id, projectData);
    } else {
      projectService.create(projectData);
    }
    setProjects(projectService.getAll());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Manage all project information</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      {/* Projects Table */}
      <Table
        columns={[
          { header: 'Project Name', accessor: 'name' },
          {
            header: 'Client',
            accessor: 'clientId',
            render: (clientId) => {
              const client = clients.find(c => c.id === clientId);
              return client?.name || 'Unknown';
            },
          },
          { header: 'Start Date', accessor: 'startDate' },
          { header: 'End Date', accessor: 'endDate' },
          {
            header: 'Budget',
            accessor: 'budget',
            render: (val) => `₹${(val / 100000).toFixed(2)}L`,
          },
          {
            header: 'Status',
            accessor: 'status',
            render: (status) => (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                status === 'ongoing'
                  ? 'bg-blue-100 text-blue-800'
                  : status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : status === 'planning'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </span>
            ),
          },
        ]}
        data={projects}
        rowActions={(project) => (
          <>
            <button
              onClick={() => setSelectedProject(project)}
              className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
              title="View details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => handleEdit(project)}
              className="p-2 hover:bg-yellow-50 rounded-lg text-yellow-600"
              title="Edit project"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => handleDelete(project.id)}
              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
              title="Delete project"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
        emptyMessage="No projects found. Create one to get started."
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        size="lg"
      >
        <Form
          fields={formFields}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          submitText={editingProject ? 'Update' : 'Create'}
        />
      </Modal>

      {/* Project Details Modal */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.name || 'Project Details'}
        size="lg"
      >
        {selectedProject && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-600">Client</p>
                <p className="text-lg font-semibold text-slate-900">
                  {clients.find(c => c.id === selectedProject.clientId)?.name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Location</p>
                <p className="text-lg font-semibold text-slate-900">{selectedProject.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Budget</p>
                <p className="text-lg font-semibold text-slate-900">
                  ₹{(selectedProject.budget / 1000000).toFixed(2)}M
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Status</p>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 capitalize">
                  {selectedProject.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Start Date</p>
                <p className="text-lg font-semibold text-slate-900">{selectedProject.startDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">End Date</p>
                <p className="text-lg font-semibold text-slate-900">{selectedProject.endDate}</p>
              </div>
            </div>
            {selectedProject.description && (
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Description</p>
                <p className="text-slate-900">{selectedProject.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
