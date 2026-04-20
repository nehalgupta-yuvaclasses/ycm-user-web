import { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentSummary } from '@/features/payments/components/PaymentSummary';
import { TransactionList } from '@/features/payments/components/TransactionList';
import { usePaymentsOverview } from '@/features/payments/hooks';
import type { PaymentTransaction, PaymentType } from '@/features/payments/types';
import { downloadInvoices } from '@/features/payments/utils';

type PaymentFilter = 'all' | PaymentType;

function PaymentsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-full sm:w-44" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  );
}

function filterTransactions(transactions: PaymentTransaction[], filter: PaymentFilter, query: string) {
  const needle = query.trim().toLowerCase();

  return transactions.filter((transaction) => {
    const matchesType = filter === 'all' || transaction.type === filter;
    const matchesQuery = !needle || transaction.itemName.toLowerCase().includes(needle) || transaction.typeLabel.toLowerCase().includes(needle);
    return matchesType && matchesQuery;
  });
}

function EmptyFilterState() {
  return (
    <Card className="border-border bg-card">
      <CardContent className="space-y-3 p-4 sm:p-5">
        <p className="text-sm font-medium text-foreground">No matching payments</p>
        <p className="text-sm text-muted-foreground">Clear the search or switch tabs to see more records.</p>
      </CardContent>
    </Card>
  );
}

export default function Payments() {
  const { data, isLoading, isError, refetch } = usePaymentsOverview();
  const [filter, setFilter] = useState<PaymentFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return <PaymentsSkeleton />;
  }

  if (isError || !data) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium text-foreground">Unable to load payments</p>
          <p className="text-sm text-muted-foreground">Try again in a moment.</p>
          <Button onClick={() => refetch()} className="w-full sm:w-auto">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const filteredTransactions = filterTransactions(data.transactions, filter, searchQuery);
  const hasTransactions = data.transactions.length > 0;

  return (
    <div className="space-y-4 pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">Manage your purchases and invoices</p>
        </div>

        <Button onClick={() => downloadInvoices(data.transactions)} disabled={data.transactions.length === 0} className="w-full gap-2 sm:w-auto">
          <Download className="size-4" />
          Download All Invoices
        </Button>
      </div>

      {data.summary ? <PaymentSummary summary={data.summary} /> : null}

      {hasTransactions ? (
        <>
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by item name"
              className="h-10 pl-9"
              aria-label="Search payments"
            />
          </div>

          <Tabs value={filter} onValueChange={(value) => setFilter(value as PaymentFilter)}>
            <TabsList variant="line" className="w-max gap-1 rounded-none p-0 text-foreground/60">
              <TabsTrigger value="all" className="px-3 py-2 text-sm">
                All
              </TabsTrigger>
              <TabsTrigger value="course" className="px-3 py-2 text-sm">
                Courses
              </TabsTrigger>
              <TabsTrigger value="test" className="px-3 py-2 text-sm">
                Tests
              </TabsTrigger>
              <TabsTrigger value="resource" className="px-3 py-2 text-sm">
                Resources
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredTransactions.length > 0 ? <TransactionList transactions={filteredTransactions} /> : <EmptyFilterState />}
        </>
      ) : (
        <TransactionList transactions={[]} />
      )}
    </div>
  );
}