import { Inbox } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center geo-card bg-brand-primary/20 border-dashed border-2">
      <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-text-muted mb-4">
        <Inbox size={32} />
      </div>
      <h3 className="text-lg font-black uppercase tracking-tight text-text-main">{title}</h3>
      <p className="text-sm text-text-muted max-w-xs mt-2 font-medium">{description}</p>
      {actionLabel && (
        <Button onClick={onAction} className="mt-6" variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
