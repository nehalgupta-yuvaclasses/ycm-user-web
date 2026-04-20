export function ResourceSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 animate-pulse">
      <div className="aspect-[4/3] bg-zinc-100" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-zinc-100 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-zinc-100 rounded w-full" />
          <div className="h-4 bg-zinc-100 rounded w-2/3" />
        </div>
        <div className="pt-6 border-t border-zinc-50 flex justify-between">
          <div className="w-16 h-8 bg-zinc-100 rounded-lg" />
          <div className="w-16 h-8 bg-zinc-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
