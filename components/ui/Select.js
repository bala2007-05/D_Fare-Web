import { cn } from '@/lib/utils';

export default function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        'w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
        'transition-colors cursor-pointer',
        className
      )}
      style={{
        color: '#0F2A47',
        ...props.style
      }}
      {...props}
    >
      {children}
    </select>
  );
}
