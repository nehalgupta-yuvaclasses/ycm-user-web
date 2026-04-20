import type { PaymentTransaction } from './types';

export function formatPaymentStatus(status: PaymentTransaction['status']) {
  if (status === 'refunded') {
    return 'Refunded';
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatRelativeTime(dateIso: string) {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateLabel(dateIso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateIso));
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildInvoiceMarkup(transactions: PaymentTransaction[]) {
  const rows = transactions
    .map(
      (transaction) => `
        <tr>
          <td>${escapeHtml(transaction.itemName)}</td>
          <td>${escapeHtml(transaction.typeLabel)}</td>
          <td>${escapeHtml(transaction.amountLabel)}</td>
          <td>${escapeHtml(transaction.createdAtLabel)}</td>
          <td>${escapeHtml(formatPaymentStatus(transaction.status))}</td>
        </tr>
      `
    )
    .join('');

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Yuva Classes Invoices</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 32px; color: #111827; background: #f9fafb; }
          .sheet { max-width: 920px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; }
          h1 { margin: 0 0 8px; font-size: 24px; }
          p { margin: 0 0 20px; color: #6b7280; }
          table { width: 100%; border-collapse: collapse; }
          th, td { text-align: left; padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
          th { color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
          .meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 20px 0 24px; }
          .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px; }
          .label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
          .value { font-size: 18px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="sheet">
          <h1>Yuva Classes invoices</h1>
          <p>Your purchase history and receipts.</p>
          <div class="meta">
            <div class="card"><div class="label">Generated</div><div class="value">${escapeHtml(formatDateLabel(new Date().toISOString()))}</div></div>
            <div class="card"><div class="label">Total receipts</div><div class="value">${transactions.length}</div></div>
            <div class="card"><div class="label">Currency</div><div class="value">INR</div></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </body>
    </html>
  `;
}

export function downloadInvoices(transactions: PaymentTransaction[], fileName = 'invoices.html') {
  if (transactions.length === 0) {
    return;
  }

  const blob = new Blob([buildInvoiceMarkup(transactions)], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadInvoice(transaction: PaymentTransaction) {
  downloadInvoices([transaction], `invoice-${transaction.id}.html`);
}