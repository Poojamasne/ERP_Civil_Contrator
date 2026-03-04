import { useState } from "react";
import {
  dailyReportService,
  projectService,
  boqService,
} from "../utils/crudService";
import { Table } from "../components/Table";
import { Modal } from "../components/Modal";
import { Form } from "../components/Form";
import { DailyReport, Project, BOQItem } from "../types";
import { Plus, FileText, Eye } from "lucide-react";

export default function DailyReports() {
  const [reports, setReports] = useState<DailyReport[]>(
    dailyReportService.getAll(),
  );
  const [projects] = useState<Project[]>(projectService.getAll());
  const [boqItems] = useState<BOQItem[]>(boqService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(
    null,
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const filteredReports = selectedProject
    ? reports.filter((r) => r.projectId === selectedProject)
    : reports;

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (values: Record<string, any>) => {
    // Validate required fields
    if (!values.projectId) {
      alert('Please select a project');
      return;
    }
    if (!values.siteEngineer || values.siteEngineer.trim() === '') {
      alert('Site engineer name is required');
      return;
    }
    if (!values.workDescription || values.workDescription.trim() === '') {
      alert('Work description is required');
      return;
    }
    if (!values.unit || values.unit.trim() === '') {
      alert('Unit is required');
      return;
    }

    const quantityExecuted = Number(values.quantityExecuted);
    if (isNaN(quantityExecuted) || quantityExecuted <= 0) {
      alert('Quantity executed must be a valid number greater than 0');
      return;
    }

    const noOfWorkers = values.noOfWorkers ? Number(values.noOfWorkers) : undefined;
    if (values.noOfWorkers && (isNaN(noOfWorkers) || noOfWorkers < 0)) {
      alert('Number of workers must be a valid number');
      return;
    }

    dailyReportService.create({
      projectId: values.projectId,
      reportDate: new Date().toISOString().split("T")[0],
      siteEngineer: values.siteEngineer,
      workDescription: values.workDescription,
      quantityExecuted: quantityExecuted,
      unit: values.unit,
      boqItemId: values.boqItemId || undefined,
      weather: values.weather,
      noOfWorkers: noOfWorkers,
      remarks: values.remarks,
      photos: [],
    });
    setReports(dailyReportService.getAll());
    setIsModalOpen(false);
  };

  const handleViewReport = (report: DailyReport) => {
    setSelectedReport(report);
    setViewModalOpen(true);
  };

  const projectBoqItems = selectedProject
    ? boqItems.filter((b) => b.projectId === selectedProject)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Daily Site Reports
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Log daily site activities and progress
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
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
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <Table
        columns={[
          { header: "Date", accessor: "reportDate" },
          {
            header: "Project",
            accessor: "projectId",
            render: (id) => projects.find((p) => p.id === id)?.name,
          },
          { header: "Site Engineer", accessor: "siteEngineer" },
          {
            header: "Work Description",
            accessor: "workDescription",
            width: "30%",
          },
          {
            header: "Quantity",
            accessor: "quantityExecuted",
            render: (qty, row) => `${qty} ${row.unit}`,
          },
          { header: "Workers", accessor: "noOfWorkers" },
        ]}
        data={filteredReports}
        rowActions={(report) => (
          <button
            onClick={() => handleViewReport(report)}
            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
            title="View Report Details"
          >
            <Eye size={18} />
          </button>
        )}
      />

      {/* Create Report Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Daily Report"
      >
        <Form
          fields={[
            {
              name: "projectId",
              label: "Project",
              type: "select",
              required: true,
              options: projects.map((p) => ({ value: p.id, label: p.name })),
            },
            {
              name: "siteEngineer",
              label: "Site Engineer Name",
              type: "text",
              required: true,
              col: 2,
            },
            {
              name: "workDescription",
              label: "Work Description",
              type: "textarea",
              required: true,
              className: "h-10",
            },
            {
              name: "boqItemId",
              label: "BOQ Item (Optional)",
              type: "select",
              options: [
                { value: "", label: "Select BOQ Item" },
                ...projectBoqItems.map((b) => ({
                  value: b.id,
                  label: b.itemName,
                })),
              ],
              col: 2,
            },
            {
              name: "quantityExecuted",
              label: "Quantity Executed",
              type: "number",
              required: true,
            },
            {
              name: "unit",
              label: "Unit",
              type: "text",
              placeholder: "e.g., cum, m³, boxes",
              col: 2,
            },
            {
              name: "weather",
              label: "Weather Conditions",
              type: "text",
              placeholder: "Clear, Rainy, etc.",
            },
            {
              name: "noOfWorkers",
              label: "No of Workers",
              type: "textarea",
              className: "h-10",
              placeholder: "Enter number",
              col: 2,
            },
            {
              name: "remarks",
              label: "Remarks",
              type: "textarea",
              className: "h-10",
            },
          ]}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* View Report Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Daily Report Details"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Report Date
                </label>
                <p className="text-slate-900">{selectedReport.reportDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Project
                </label>
                <p className="text-slate-900">
                  {
                    projects.find((p) => p.id === selectedReport.projectId)
                      ?.name
                  }
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Site Engineer
                </label>
                <p className="text-slate-900">{selectedReport.siteEngineer}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Weather
                </label>
                <p className="text-slate-900">
                  {selectedReport.weather || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-500">
                Work Description
              </label>
              <p className="text-slate-900 mt-1 p-3 bg-slate-50 rounded-lg">
                {selectedReport.workDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Quantity Executed
                </label>
                <p className="text-slate-900">
                  {selectedReport.quantityExecuted} {selectedReport.unit}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Number of Workers
                </label>
                <p className="text-slate-900">
                  {selectedReport.noOfWorkers || "N/A"}
                </p>
              </div>
            </div>

            {selectedReport.boqItemId && (
              <div>
                <label className="text-sm font-medium text-slate-500">
                  BOQ Item
                </label>
                <p className="text-slate-900">
                  {boqItems.find((b) => b.id === selectedReport.boqItemId)
                    ?.itemName || "N/A"}
                </p>
              </div>
            )}

            {selectedReport.remarks && (
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Remarks
                </label>
                <p className="text-slate-900 mt-1 p-3 bg-slate-50 rounded-lg">
                  {selectedReport.remarks}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
