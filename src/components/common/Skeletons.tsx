import { Coffee as CoffeeIcon } from 'lucide-react';

export function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200/80 dark:bg-gray-700/30 rounded-2xl ${className}`} />
  );
}

export function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between p-4 space-y-4">
          <SkeletonPulse className="h-48 w-full rounded-2xl" />
          <div className="space-y-3 px-1 flex-grow">
            <SkeletonPulse className="h-6 w-3/4 rounded-lg" />
            <SkeletonPulse className="h-4 w-1/2 rounded-md" />
            <SkeletonPulse className="h-4 w-5/6 rounded-md" />
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-50">
            <SkeletonPulse className="h-6 w-1/4 rounded-full" />
            <SkeletonPulse className="h-4 w-1/3 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, idx) => {
        const heights = ['h-64', 'h-72', 'h-56', 'h-80', 'h-64', 'h-72', 'h-56', 'h-68'];
        const height = heights[idx % heights.length];
        return (
          <div key={idx} className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white p-3 break-inside-avoid">
            <SkeletonPulse className={`${height} w-full rounded-2xl`} />
            <div className="mt-3 space-y-2">
              <SkeletonPulse className="h-5 w-3/4 rounded-md" />
              <SkeletonPulse className="h-4 w-1/2 rounded-md" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TestimonialsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <SkeletonPulse className="w-10 h-10 rounded-full" />
            <div className="space-y-1.5 flex-grow">
              <SkeletonPulse className="h-4 w-1/3 rounded-md" />
              <SkeletonPulse className="h-3 w-1/4 rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-full rounded-md" />
            <SkeletonPulse className="h-4 w-full rounded-md" />
            <SkeletonPulse className="h-4 w-2/3 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-pulse">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <SkeletonPulse className="h-6 w-1/3 rounded-full" />
          <SkeletonPulse className="h-14 w-3/4 rounded-xl" />
          <SkeletonPulse className="h-8 w-5/6 rounded-lg" />
          <SkeletonPulse className="h-20 w-full rounded-xl" />
          <div className="flex gap-4">
            <SkeletonPulse className="h-12 w-32 rounded-full" />
            <SkeletonPulse className="h-12 w-32 rounded-full" />
          </div>
        </div>
        <SkeletonPulse className="h-[400px] w-full rounded-3xl" />
      </div>
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm gap-4">
        <div className="space-y-2 w-1/2">
          <SkeletonPulse className="h-6 w-1/2 rounded-md" />
          <SkeletonPulse className="h-4 w-3/4 rounded-md" />
        </div>
        <SkeletonPulse className="h-10 w-full sm:w-36 rounded-full" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-2xl bg-white space-y-2">
            <SkeletonPulse className="h-3 w-1/2 rounded-md" />
            <SkeletonPulse className="h-8 w-1/3 rounded-md" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-3xl p-6 border border-gray-100 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <SkeletonPulse className="w-12 h-12 rounded-xl" />
            <div className="space-y-1.5 flex-grow">
              <SkeletonPulse className="h-4 w-1/4 rounded-md" />
              <SkeletonPulse className="h-3 w-1/3 rounded-md" />
            </div>
            <SkeletonPulse className="h-8 w-20 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
