export function CourseSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 animate-pulse">
      <div className="aspect-video bg-zinc-100" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-zinc-100 rounded w-1/4" />
        <div className="h-6 bg-zinc-100 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-zinc-100 rounded w-full" />
          <div className="h-4 bg-zinc-100 rounded w-2/3" />
        </div>
        <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
          <div className="h-6 bg-zinc-100 rounded w-20" />
          <div className="h-4 bg-zinc-100 rounded w-24" />
        </div>
      </div>
    </div>
  );
}
