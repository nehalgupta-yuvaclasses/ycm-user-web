import { Skeleton } from "@/components/ui/skeleton";

export function ResourceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-100 overflow-hidden bg-white">
      {/* Thumbnail */}
      <Skeleton className="aspect-[4/3] w-full" />
      
      <div className="p-6 space-y-4">
        {/* Title & Description */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        {/* Metadata */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-zinc-50">
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
