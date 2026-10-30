import React from 'react';
import { cn } from '../../lib/utils';
import { AccountStatus, UserRole } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'brand';
  status?: AccountStatus;
  role?: UserRole;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  status,
  role,
  children,
  ...props
}) => {
  let resolvedVariant = variant;

  if (status) {
    if (status === 'ACTIVE') resolvedVariant = 'success';
    else if (status === 'PENDING_VERIFICATION') resolvedVariant = 'warning';
    else if (status === 'SUSPENDED' || status === 'REJECTED') resolvedVariant = 'destructive';
  } else if (role) {
    if (role === 'ADMIN') resolvedVariant = 'destructive';
    else if (role === 'PHARMACY_OWNER') resolvedVariant = 'brand';
    else if (role === 'DELIVERY_PARTNER') resolvedVariant = 'warning';
    else resolvedVariant = 'default';
  }

  const variants = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    brand: 'bg-brand-50 text-brand-800 border-brand-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    destructive: 'bg-red-50 text-red-800 border-red-200',
    outline: 'border border-slate-300 text-slate-700 bg-transparent',
  };

  const displayText = children || (status ? status.replace('_', ' ') : role ? role.replace('_', ' ') : '');

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
        variants[resolvedVariant],
        className
      )}
      {...props}
    >
      {displayText}
    </span>
  );
};
