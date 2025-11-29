
import React, { useState, ReactNode } from 'react';

interface CarouselProps {
  children: ReactNode[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export const Carousel: React.FC<CarouselProps> = ({ children, activeIndex, onChange }) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchStart('touches' in e ? e.touches[0].clientX : e.clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStart || !isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = touchStart - currentX;
    setDragOffset(diff);
  };

  const onTouchEnd = () => {
    if (!touchStart) return;
    
    if (dragOffset > minSwipeDistance) {
      // Next
      if (activeIndex < children.length - 1) onChange(activeIndex + 1);
    } else if (dragOffset < -minSwipeDistance) {
      // Prev
      if (activeIndex > 0) onChange(activeIndex - 1);
    }

    setTouchStart(null);
    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <div 
        className="w-full h-full overflow-hidden relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
        onMouseLeave={onTouchEnd}
    >
      <div 
        className="flex h-full w-full transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translateX(calc(-${activeIndex * 100}% - ${isDragging ? dragOffset : 0}px))` }}
      >
        {children.map((child, index) => (
          // Removed p-4 to allow full edge-to-edge content
          <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
