import { supabase } from "@/lib/supabaseClient";
import { auth } from "@/lib/firebase";
import { formatCurrency, formatDateLabel, formatRelativeTime } from "./utils";
import type {
  PaymentStatus,
  PaymentTransaction,
  PaymentSummary,
  PaymentsOverview,
} from "./types";

export interface PublicPaymentSettings {
  provider: "razorpay" | "stripe";
  apiKey: string;
  currency: string;
  gstRate: number;
  isEnabled: boolean;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  apiKey: string;
  gstRate: number;
  provider: string;
  courseTitle: string;
}

export interface RazorpayVerifyPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

type CourseRow = {
  id: string;
  title: string;
};

type ResourceRow = {
  id: string;
  title: string;
  type: string;
};

type PaymentRow = {
  id: string;
  student_id: string | null;
  user_id: string | null;
  amount: number;
  status: string | null;
  created_at: string;
  course_id: string | null;
};

type ResourcePurchaseRow = {
  id: string;
  user_id: string;
  resource_id: string;
  amount: number;
  payment_status: string;
  purchased_at: string;
};

function normalizeStatus(status: string | null): PaymentStatus {
  const value = (status ?? "").toLowerCase();
  if (value === "failed") return "failed";
  if (value === "refunded") return "refunded";
  if (value === "pending") return "pending";
  return "success";
}

async function resolveUserId() {
  return auth?.currentUser?.uid ?? null;
}

async function invokePaymentFunction<T>(
  action: string,
  payload: Record<string, unknown> = {},
  extraHeaders: Record<string, string> | null = null,
) {
  const { data, error } = await supabase.functions.invoke("razorpay-payments", {
    body: { action, ...payload },
    headers: extraHeaders ?? undefined,
  });

  if (error) {
    throw error;
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as T;
}

export async function fetchPublicPaymentSettings(
  extraHeaders?: Record<string, string>,
) {
  return invokePaymentFunction<PublicPaymentSettings>(
    "get_public_payment_settings",
    {},
    extraHeaders,
  );
}

export async function createRazorpayOrder(
  payload: { courseId: string; amount: number },
  extraHeaders?: Record<string, string>,
) {
  return invokePaymentFunction<RazorpayOrderResponse>(
    "create_razorpay_order",
    payload,
    extraHeaders,
  );
}

export async function verifyRazorpayPayment(
  payload: RazorpayVerifyPayload,
  extraHeaders?: Record<string, string>,
) {
  return invokePaymentFunction<{
    success: boolean;
    paymentId: string;
    orderId: string;
    courseId: string;
  }>(
    "verify_payment",
    payload as unknown as Record<string, unknown>,
    extraHeaders,
  );
}

function mapTransactions(
  payments: PaymentRow[],
  purchases: ResourcePurchaseRow[],
  courseMap: Map<string, CourseRow>,
  resourceMap: Map<string, ResourceRow>,
) {
  const courseTransactions: PaymentTransaction[] = payments.map((payment) => {
    const course = payment.course_id ? courseMap.get(payment.course_id) : null;
    const status = normalizeStatus(payment.status);

    return {
      id: payment.id,
      itemName: course?.title ?? "Course purchase",
      type: "course",
      typeLabel: "Course",
      amount: payment.amount,
      amountLabel: formatCurrency(payment.amount),
      status,
      createdAt: payment.created_at,
      createdAtLabel: formatDateLabel(payment.created_at),
      invoiceUrl: null,
      href: `/dashboard/payments/${payment.id}`,
    };
  });

  const resourceTransactions: PaymentTransaction[] = purchases.map(
    (purchase) => {
      const resource = resourceMap.get(purchase.resource_id);
      const status = normalizeStatus(
        purchase.payment_status === "paid"
          ? "success"
          : purchase.payment_status,
      );

      return {
        id: purchase.id,
        itemName: resource?.title ?? "Study resource",
        type: "resource",
        typeLabel:
          resource?.type === "book"
            ? "Book"
            : resource?.type === "notes"
              ? "Notes"
              : "Resource",
        amount: purchase.amount,
        amountLabel: formatCurrency(purchase.amount),
        status,
        createdAt: purchase.purchased_at,
        createdAtLabel: formatDateLabel(purchase.purchased_at),
        invoiceUrl: null,
        href: `/dashboard/payments/${purchase.id}`,
      };
    },
  );

  return [...courseTransactions, ...resourceTransactions].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function buildSummary(
  transactions: PaymentTransaction[],
): PaymentSummary | null {
  if (transactions.length === 0) {
    return null;
  }

  const successfulTransactions = transactions.filter(
    (transaction) => transaction.status === "success",
  );
  const totalSpent = successfulTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );
  const activeCourses = new Set(
    transactions
      .filter(
        (transaction) =>
          transaction.type === "course" && transaction.status === "success",
      )
      .map((transaction) => transaction.itemName),
  ).size;
  const lastPaymentAt = transactions[0]?.createdAt ?? new Date().toISOString();

  return {
    totalSpent,
    totalSpentLabel: formatCurrency(totalSpent),
    activeCourses,
    lastPaymentAt,
    lastPaymentLabel: formatRelativeTime(lastPaymentAt),
  };
}

export async function fetchPaymentsOverview(): Promise<PaymentsOverview> {
  const userId = await resolveUserId();

  if (!userId) {
    return {
      summary: null,
      transactions: [],
    };
  }

  const [paymentsResponse, purchasesResponse] = await Promise.all([
    supabase
      .from("payments")
      .select("id, student_id, user_id, amount, status, created_at, course_id")
      .or(`student_id.eq.${userId},user_id.eq.${userId}`)
      .order("created_at", { ascending: false }),
    supabase
      .from("resource_purchases")
      .select("id, user_id, resource_id, amount, payment_status, purchased_at")
      .eq("user_id", userId)
      .order("purchased_at", { ascending: false }),
  ]);

  if (paymentsResponse.error) {
    throw paymentsResponse.error;
  }

  if (purchasesResponse.error) {
    throw purchasesResponse.error;
  }

  const payments = (paymentsResponse.data as PaymentRow[] | null) ?? [];
  const purchases =
    (purchasesResponse.data as ResourcePurchaseRow[] | null) ?? [];
  const courseIds = [
    ...new Set(
      payments
        .map((payment) => payment.course_id)
        .filter((courseId): courseId is string => Boolean(courseId)),
    ),
  ];
  const resourceIds = [
    ...new Set(
      purchases
        .map((purchase) => purchase.resource_id)
        .filter((resourceId): resourceId is string => Boolean(resourceId)),
    ),
  ];

  const [coursesResponse, resourcesResponse] = await Promise.all([
    courseIds.length > 0
      ? supabase.from("courses").select("id, title").in("id", courseIds)
      : Promise.resolve({ data: [], error: null }),
    resourceIds.length > 0
      ? supabase
          .from("resources")
          .select("id, title, type")
          .in("id", resourceIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (coursesResponse.error) {
    throw coursesResponse.error;
  }

  if (resourcesResponse.error) {
    throw resourcesResponse.error;
  }

  const courseMap = new Map<string, CourseRow>();
  ((coursesResponse.data as CourseRow[] | null) ?? []).forEach((course) => {
    courseMap.set(course.id, course);
  });

  const resourceMap = new Map<string, ResourceRow>();
  ((resourcesResponse.data as ResourceRow[] | null) ?? []).forEach(
    (resource) => {
      resourceMap.set(resource.id, resource);
    },
  );

  const transactions = mapTransactions(
    payments,
    purchases,
    courseMap,
    resourceMap,
  );

  return {
    summary: buildSummary(transactions),
    transactions,
  };
}

export async function fetchPaymentById(id: string) {
  const overview = await fetchPaymentsOverview();
  return (
    overview.transactions.find((transaction) => transaction.id === id) ?? null
  );
}
