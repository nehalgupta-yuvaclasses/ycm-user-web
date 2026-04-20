import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PaymentTransaction } from '../types';
import { TransactionItem } from './TransactionItem';

interface TransactionListProps {
  transactions: PaymentTransaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">No payments yet</p>
            <h2 className="text-base font-medium text-foreground">Your purchases will appear here</h2>
          </div>
          <Button nativeButton={false} render={<Link to="/dashboard/courses" />} className="w-full sm:w-auto">
            Browse Courses
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-3">
      <p className="text-sm font-medium text-foreground">Transactions</p>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </section>
  );
}