import * as React from 'react';
import { Download, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface DashboardHeaderProps {
  userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Overview</h1>
          <p className="text-sm text-zinc-500 font-medium">Welcome back, {userName}! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-zinc-200 font-bold text-zinc-600 bg-white">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl font-bold shadow-lg shadow-zinc-900/10">
            <Play className="w-4 h-4 mr-2 fill-current" />
            Start Learning
          </Button>
        </div>
      </div>
      <Separator className="bg-zinc-100" />
    </div>
  );
}
