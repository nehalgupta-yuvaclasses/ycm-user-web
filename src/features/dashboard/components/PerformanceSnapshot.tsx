import * as React from 'react';
import { Trophy, Target, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceSnapshotProps {
  testsAttempted: number;
  averageScore: number;
  improvement: number;
}

export function PerformanceSnapshot({ testsAttempted, averageScore, improvement }: PerformanceSnapshotProps) {
  return (
    <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em]">Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
              <Trophy className="w-6 h-6 text-zinc-900" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900">{testsAttempted}</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Tests Attempted</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
            <TrendingUp className="w-3 h-3 mr-1" />
            +{improvement}%
          </Badge>
        </div>

        <div className="flex items-center gap-4 p-4 border border-zinc-100 rounded-2xl">
          <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-zinc-900">{averageScore}%</p>
              <span className="text-xs font-bold text-zinc-400">Average</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Overall Accuracy</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
