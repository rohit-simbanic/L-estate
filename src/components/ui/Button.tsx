import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  animate?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      animate = true,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-gold-500/50 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide cursor-pointer';

    const variants = {
      primary:
        'bg-obsidian-950 text-white hover:bg-obsidian-800 border border-obsidian-950 hover:border-obsidian-800 font-semibold shadow-md shadow-obsidian-950/5',
      secondary:
        'bg-white text-obsidian-900 hover:bg-obsidian-50 border border-obsidian-200 hover:border-obsidian-300 font-medium',
      ghost: 'bg-transparent text-obsidian-600 hover:text-obsidian-900 hover:bg-obsidian-100/70',
      dark: 'bg-obsidian-900 text-white hover:bg-obsidian-800 border border-obsidian-900 hover:border-obsidian-800 font-medium',
      danger: 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/10',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-xs',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    };

    const classes = twMerge(clsx(baseStyles, variants[variant], sizes[size], className));

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </>
    );

    if (!animate || disabled || isLoading) {
      return (
        <button ref={ref} className={classes} disabled={disabled || isLoading} {...props}>
          {content}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.98 }}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {content}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
