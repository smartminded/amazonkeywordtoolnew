import { cn } from '@/utils/cn';

export function Button({ className, children, ...props }) {
  return (
    <button
      className={cn(
        'bg-primary-500 hover:bg-primary-600 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-base font-medium text-white transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
