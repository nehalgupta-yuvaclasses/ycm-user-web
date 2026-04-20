import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePaymentDetail } from '@/features/payments/hooks';
import { downloadInvoice, formatPaymentStatus } from '@/features/payments/utils';

function statusClasses(status: string) {
  if (status === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'failed' || status === 'refunded') return 'border-red-200 bg-red-50 text-red-700';
  return 'border-amber-200 bg-amber-50 text-amber-700';
}

export default function PaymentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = usePaymentDetail(id || '');

  if (isLoading) {
    return <div className="h-40 rounded-lg bg-muted/40" />;
  }

  if (!data) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium text-foreground">Payment not found</p>
          <Button nativeButton={false} render={<Link to="/dashboard/payments" />} className="w-full sm:w-auto">
            Back to Payments
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <Button nativeButton={false} render={<Link to="/dashboard/payments" />} variant="ghost" className="w-fit gap-2 px-0">
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-4">
          <div className="space-y-1">
            <Badge variant="outline">{data.typeLabel}</Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{data.itemName}</h1>
            <p className="text-sm text-muted-foreground">{data.createdAtLabel}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={statusClasses(data.status)}>
              {formatPaymentStatus(data.status)}
            </Badge>
            <span className="text-sm text-muted-foreground">{data.amountLabel}</span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => downloadInvoice(data)} className="w-full gap-2 sm:w-auto">
              <Download className="size-4" />
              Download Invoice
            </Button>
            <Button nativeButton={false} render={<a href={data.invoiceUrl ?? data.href} target="_blank" rel="noreferrer" />} variant="outline" className="w-full gap-2 sm:w-auto">
              <ExternalLink className="size-4" />
              Open Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}