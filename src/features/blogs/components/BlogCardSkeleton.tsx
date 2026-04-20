import { Skeleton } from "@/components/ui/skeleton";

export function BlogCardSkeleton() {
  return (
    <div className="rounded-[2rem] border border-zinc-100 overflow-hidden bg-white">
      {/* Thumbnail */}
      <Skeleton className="aspect-[16/10] w-full" />
      
      <div className="p-8 space-y-6">
        {/* Metadata */}
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Title & Excerpt */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-zinc-50">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-5 rounded-md" />
        </div>
      </div>
    </div>
  );
}
