import { CalendarDays, CreditCard, Layers3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { PaymentSummary as PaymentSummaryType } from '../types';

interface PaymentSummaryProps {
  summary: PaymentSummaryType;
}

const SUMMARY_CARDS = [
  {
    label: 'Total Spent',
    icon: CreditCard,
    getValue: (summary: PaymentSummaryType) => summary.totalSpentLabel,
  },
  {
    label: 'Active Courses',
    icon: Layers3,
    getValue: (summary: PaymentSummaryType) => String(summary.activeCourses),
  },
  {
    label: 'Last Payment',
    icon: CalendarDays,
    getValue: (summary: PaymentSummaryType) => summary.lastPaymentLabel,
  },
] as const;

export function PaymentSummary({ summary }: PaymentSummaryProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {SUMMARY_CARDS.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label} className="border-border bg-card">
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40">
                <Icon className="size-4 text-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-foreground">{card.getValue(summary)}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}