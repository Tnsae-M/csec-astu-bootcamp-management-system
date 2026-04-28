import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Breadcrumbs() {
  const location = useLocation();
  const { role, divisionId, bootcampId, sessionId } = useParams();
  
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getLabel = (segment: string) => {
    if (segment === 'dashboard') return <Home size={14} />;
    if (segment === role) return role?.toUpperCase();
    
    // If this is an ID segment, use the pure name
    if (segment === divisionId) return 'Division';
    if (segment === bootcampId) return 'Bootcamp';
    if (segment === sessionId) return 'Session';
    
    // Capitalize generic segments
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const getUrl = (segment: string, index: number) => {
    const base = `/${pathSegments.slice(0, index + 1).join('/')}`;
    if (segment === role) return `${base}/dashboard`;
    return base;
  };

  // Skip rendering if we are just on the root dashboard or landing
  if (pathSegments.length <= 2 && pathSegments[pathSegments.length-1] === 'dashboard') return null;
  if (pathSegments.length === 0) return null;

  // Filter out redundant segments
  // e.g., if path has 'divisions/123', remove the 'divisions' segment to avoid 'Divisions > Division'
  const filteredSegments = pathSegments.filter((segment, index) => {
    const nextSegment = pathSegments[index + 1];
    if (segment === 'divisions' && nextSegment === divisionId) return false;
    if (segment === 'bootcamps' && nextSegment === bootcampId) return false;
    if (segment === 'sessions' && nextSegment === sessionId) return false;
    return true;
  });

  return (
    <nav className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-text-muted mb-6 overflow-x-auto no-scrollbar py-2 border-b border-brand-border/50">
      {filteredSegments.map((segment, index) => {
        // Re-calculate the original index for URL generation
        const originalIndex = pathSegments.indexOf(segment);
        const url = getUrl(segment, originalIndex);
        const isLast = index === filteredSegments.length - 1;

        return (
          <React.Fragment key={`${url}-${index}`}>
            {index > 0 && <ChevronRight size={12} className="text-brand-border/60 shrink-0" />}
            
            <Link
              to={url}
              className={cn(
                "transition-all hover:text-brand-accent whitespace-nowrap flex items-center gap-1",
                isLast ? "text-brand-accent font-black pointer-events-none" : "text-text-muted/70"
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
