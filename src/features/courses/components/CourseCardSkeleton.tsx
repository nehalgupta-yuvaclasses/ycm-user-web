import * as React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const CourseCardSkeleton: React.FC = () => {
  return (
    <Card className="flex flex-col h-full overflow-hidden border-zinc-100 bg-white">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      
      <CardContent className="flex-1 p-5 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-4">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>
        
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="mt-auto pt-4 flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-11 w-24 rounded-xl" />
      </CardFooter>
    </Card>
  );
};
