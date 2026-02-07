import { cn } from '@/lib/utils';
export default function Table({ children, className }) {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className={cn('w-full text-sm', className)}>
        {children}
      </table>
    </div>
  );
}
export function TableHeader({ children }) {
  return (
    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
      {children}
    </thead>
  );
}
export function TableBody({ children }) {
  return <tbody className="divide-y divide-slate-200">{children}</tbody>;
}
export function TableRow({ children, className, onClick }) {
  return (
    <tr
      className={cn(
        'hover:bg-slate-50 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}
export function TableHead({ children, className }) {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider',
        className
      )}
    >
      {children}
    </th>
  );
}
export function TableCell({ children, className }) {
  return (
    <td className={cn('px-6 py-4 text-slate-900', className)}>
      {children}
    </td>
  );
}