import * as React from 'react';
import { Video, FileText, ChevronRight, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  type: 'Live' | 'Test';
}

interface UpcomingScheduleProps {
  items: ScheduleItem[];
}

export function UpcomingSchedule({ items }: UpcomingScheduleProps) {
  return (
    <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em]">Upcoming Schedule</CardTitle>
        <button className="text-[10px] font-bold text-zinc-900 hover:underline uppercase tracking-widest">View Calendar</button>
      </CardHeader>
      <CardContent className="px-0">
        <div className="divide-y divide-zinc-50">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-6 hover:bg-zinc-50/50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105",
                  item.type === 'Live' ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
                )}>
                  {item.type === 'Live' ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm mb-1">{item.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-all" />
            </div>
          ))}
          {items.length === 0 && (
            <div className="p-12 text-center space-y-2">
              <p className="text-sm font-bold text-zinc-400">No upcoming classes</p>
              <p className="text-xs text-zinc-300">Your schedule is currently clear.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
