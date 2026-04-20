import { Link } from 'react-router-dom';
import { Download, FileText, Layers3, SquarePlay } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PaymentTransaction } from '../types';
import { downloadInvoice, formatPaymentStatus } from '../utils';

interface TransactionItemProps {
  transaction: PaymentTransaction;
}

function statusClasses(status: PaymentTransaction['status']) {
  if (status === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'failed' || status === 'refunded') return 'border-red-200 bg-red-50 text-red-700';
  return 'border-amber-200 bg-amber-50 text-amber-700';
}

function TypeIcon({ type }: { type: PaymentTransaction['type'] }) {
  if (type === 'resource') return <FileText className="size-4" />;
  if (type === 'test') return <SquarePlay className="size-4" />;
  return <Layers3 className="size-4" />;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  return (
    <Card className="relative overflow-hidden border-border bg-card transition-colors hover:border-foreground/20">
      <Link to={transaction.href} aria-label={`Open ${transaction.itemName}`} className="absolute inset-0 z-0" />

      <CardContent className="relative z-10 space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40 text-foreground">
                <TypeIcon type={transaction.type} />
              </div>
              <div className="min-w-0 space-y-1">
                <h3 className="truncate text-sm font-medium text-foreground">{transaction.itemName}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{transaction.typeLabel}</Badge>
                  <span className="text-xs text-muted-foreground">{transaction.createdAtLabel}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-base font-medium text-foreground">{transaction.amountLabel}</p>
            <Badge variant="outline" className={statusClasses(transaction.status)}>
              {formatPaymentStatus(transaction.status)}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">{transaction.createdAtLabel}</p>
          <Button variant="outline" className="relative z-20 w-full gap-2 sm:w-auto" onClick={() => downloadInvoice(transaction)}>
            <Download className="size-4" />
            Download Invoice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}