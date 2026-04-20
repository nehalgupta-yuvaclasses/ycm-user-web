export function BlogSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 animate-pulse">
      <div className="aspect-[16/10] bg-zinc-100" />
      <div className="p-8 space-y-4">
        <div className="h-3 bg-zinc-100 rounded w-1/4" />
        <div className="h-6 bg-zinc-100 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-zinc-100 rounded w-full" />
          <div className="h-4 bg-zinc-100 rounded w-2/3" />
        </div>
        <div className="pt-6 flex items-center justify-between border-t border-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-100" />
            <div className="space-y-1">
              <div className="h-2 bg-zinc-100 rounded w-8" />
              <div className="h-3 bg-zinc-100 rounded w-16" />
            </div>
          </div>
          <div className="h-5 bg-zinc-100 rounded w-5" />
        </div>
      </div>
    </div>
  );
}
