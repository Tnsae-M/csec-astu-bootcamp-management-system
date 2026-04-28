import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Breadcrumbs() {
  const location = useLocation();
  const { role, divisionId, bootcampId, sessionId } = useParams();
  
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Helper to generate hierarchical labels
  const getLabel = (segment: string) => {
    if (segment === 'dashboard') return <Home size={14} />;
    if (segment === role) return role?.toUpperCase();
    if (segment === divisionId) return 'Division Hub';
    if (segment === bootcampId) return 'Bootcamp Hub';
    if (segment === sessionId) return 'Session Hub';
    
    // Capitalize generic segments
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  // Skip rendering if we are just on the root dashboard
  if (pathSegments.length <= 2) return null;

  return (
    <nav className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-text-muted mb-8 overflow-x-auto no-scrollbar py-2">
      {pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <React.Fragment key={url}>
            {index > 0 && <ChevronRight size={12} className="text-brand-border shrink-0" />}
            
            <Link
              to={url}
              className={cn(
                "transition-colors hover:text-brand-accent whitespace-nowrap flex items-center",
                isLast ? "text-brand-accent pointer-events-none" : "text-text-muted"
              )}
            >
              {getLabel(segment)}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
