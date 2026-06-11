import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-obsidian-100 via-obsidian-200/50 to-obsidian-100 rounded-lg ${className}`}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-obsidian-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-5 flex flex-col flex-grow space-y-4 text-left">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-obsidian-200">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const PageSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-3 text-left">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-9 w-96" />
        <Skeleton className="h-3.5 w-full max-w-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
};
