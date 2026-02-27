import React, { useState } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  validate?: (value: any) => string | undefined;
  col?: 1 | 2;
  className?: string;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function Form({
  fields,
  onSubmit,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Cancel',
  loading = false,
}: FormProps) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach(field => {
      initial[field.name] = field.defaultValue ?? '';
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && !values[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      } else if (field.validate) {
        const error = field.validate(values[field.name]);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(values);
  };

  // Group fields by column
  const col1Fields = fields.filter(f => f.col !== 2);
  const col2Fields = fields.filter(f => f.col === 2);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Column 1 */}
        <div className="space-y-4 sm:space-y-6">
          {col1Fields.map(field => (
            <FormField
              key={field.name}
              field={field}
              value={values[field.name]}
              error={errors[field.name]}
              onChange={handleChange}
            />
          ))}
        </div>
        {/* Column 2 */}
        <div className="space-y-4 sm:space-y-6">
          {col2Fields.map(field => (
            <FormField
              key={field.name}
              field={field}
              value={values[field.name]}
              error={errors[field.name]}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            {cancelText}
          </button>
        )}
        <button
          type="submit"
          className="btn-primary flex-1"
          disabled={loading}
        >
          {loading ? 'Saving...' : submitText}
        </button>
      </div>
    </form>
  );
}
// Update the FormFieldProps interface
interface FormFieldProps {
  field: FormField; 
  value: any;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

// Update the FormField component to use the className
function FormField({ field, value, error, onChange }: FormFieldProps) {
  // Determine textarea height class
  const textareaHeightClass = field.className || 'h-24'; // Use custom className if provided, otherwise default to h-24
  
  return (
    <div>
      <label className="label-text">
        {field.label}
        {field.required && <span className="text-red-600">*</span>}
      </label>
      {field.type === 'select' ? (
        <select
          name={field.name}
          value={value}
          onChange={onChange}
          className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        >
          <option value="">Select {field.label.toLowerCase()}</option>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          name={field.name}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          className={`input-field resize-none ${textareaHeightClass} ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
      ) : (
        <input
          type={field.type}
          name={field.name}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
      )}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

