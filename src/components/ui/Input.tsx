import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const baseClasses =
  'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 ' +
  'placeholder:text-zinc-400 transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ' +
  'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

// ─── Input ────────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(baseClasses, 'h-10', className)} {...props} />
  )
);
Input.displayName = 'Input';

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  monospace?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, monospace, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        baseClasses,
        'min-h-[160px] resize-y leading-relaxed',
        monospace && 'font-mono text-xs',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
