import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'destructive';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  title,
  children,
  ...props
}) => {
  const icons = {
    info: <Info className="h-5 w-5 text-brand-700 mt-0.5 flex-shrink-0" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />,
    destructive: <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />,
  };

  const variants = {
    info: 'bg-brand-50 border-brand-200 text-brand-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    destructive: 'bg-red-50 border-red-200 text-red-900',
  };

  return (
    <div
      role="alert"
      className={cn('flex items-start gap-3 rounded-lg border p-4 text-sm', variants[variant], className)}
      {...props}
    >
      {icons[variant]}
      <div className="space-y-1">
        {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
        <div className="text-sm opacity-90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
