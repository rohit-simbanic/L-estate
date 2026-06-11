import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormFieldProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
> {
  id: string;
  label: string;
  error?: { message?: string };
  fieldType?: 'input' | 'textarea' | 'select';
  options?: Array<{ value: string; label: string }>;
  registerProps?: Partial<
    React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  >;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  fieldType = 'input',
  options = [],
  registerProps = {},
  className = '',
  placeholder,
  ...props
}) => {
  const commonClasses = `w-full bg-obsidian-50 border border-obsidian-200 rounded-lg px-3.5 py-2 text-xs text-obsidian-900 placeholder-obsidian-450 focus:outline-none focus:border-gold-600 focus:bg-white transition-all ${
    error ? 'border-red-400 focus:border-red-500' : ''
  } ${className}`;

  return (
    <div className="w-full flex flex-col text-left">
      <label
        htmlFor={id}
        className="text-[10px] uppercase font-bold text-gold-600 tracking-wider block mb-1.5"
      >
        {label}
      </label>

      {fieldType === 'textarea' ? (
        <textarea
          id={id}
          placeholder={placeholder}
          className={`${commonClasses} min-h-28 resize-none`}
          {...props}
          {...registerProps}
        />
      ) : fieldType === 'select' ? (
        <select id={id} className={commonClasses} {...props} {...registerProps}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          placeholder={placeholder}
          className={commonClasses}
          {...props}
          {...registerProps}
        />
      )}

      {/* Custom Animated validation error block */}
      <AnimatePresence>
        {error?.message && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="text-[10px] text-red-600 font-semibold flex items-center gap-1.5 leading-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
              <span>{error.message}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
