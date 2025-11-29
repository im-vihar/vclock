import React, { ReactNode } from 'react';

interface WidgetCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  headerAction?: ReactNode;
  span?: number; // Simplified grid span concept
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ children, className = '', title, headerAction, span = 1 }) => {
  return (
    <div className={`glass-panel rounded-3xl p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:bg-white/5 ${className}`}>
      {(title || headerAction) && (
        <div className="flex justify-between items-center mb-4 z-10">
          {title && <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{title}</h3>}
          {headerAction}
        </div>
      )}
      <div className="flex-1 flex flex-col z-10">
        {children}
      </div>
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
