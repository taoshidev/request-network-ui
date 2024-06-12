import { getAuthUser } from "@/actions/auth";
import { getKey } from "@/actions/keys";
import { getSubscriptions } from "@/actions/subscriptions";
import { subscriptions } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { ConsumerPaymentDashboard } from "@/components/ConsumerPaymentDashboard/ConsumerPaymentDashboard";
import { getVerifications } from "@/actions/keys";
import { getStartAndEndTimestamps } from "@/utils/date";
import { fetchServiceTransactions, fetchPaymentStatusTransactions } from "@/utils/validators";
import { addDays, getDaysInMonth, startOfMonth } from "date-fns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ params }: any) {
  const user = await getAuthUser();

  if (!user) return;
  
  const { start, end, prevStart, prevEnd } = getStartAndEndTimestamps();

  const fetchSubscriptions = async (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    let subs = await getSubscriptions({
      where: and(
        eq(subscriptions.userId, user?.id!),
        gte(subscriptions.createdAt, startDate),
        lte(subscriptions.createdAt, endDate)
      ),
      with: {
        service: true,
        validator: true,
        endpoint: {
          with: {
            subnet: true,
            validator: {
              columns: {
                signature: false,
                description: false,
                hotkey: false,
                account: false,
              },
            },
          },
        },
      },
    });

    if (subs?.error) subs = [];
    return subs;
  };

  const currentSubscriptions = await fetchSubscriptions(
    new Date(start).toISOString(),
    new Date(end).toISOString()
  );
  const previousSubscriptions = await fetchSubscriptions(
    new Date(prevStart).toISOString(),
    new Date(prevEnd).toISOString()
  );

  const fetchKeys = async () => {

    const today = new Date();
    const startOfMonthDate = startOfMonth(today);
    const midMonthDate = addDays(startOfMonthDate, 14);
    const endOfMonthDate = addDays(startOfMonthDate, getDaysInMonth(today) - 1);
  
    const paymentStatusStart = today.getDate() < 15 ? startOfMonthDate.getTime() : midMonthDate.getTime();
    const paymentStatusEnd = today.getDate() < 15 ? midMonthDate.getTime() : endOfMonthDate.getTime();

    
    const validatorsMap = new Map();
    for (const sub of currentSubscriptions) {
      const { result: keyData } = await getKey({
        keyId: sub.keyId as string,
      });
      const validatorId = sub.endpoint.validator.id;
      if (!validatorsMap.has(validatorId)) {
        validatorsMap.set(validatorId, {
          ...sub.endpoint.validator,
          subscriptions: [],
        });
      }

      const verification = await getVerifications({
        keyId: sub?.keyId,
      });

      const monthlyVerification = await getVerifications({
        keyId: sub?.keyId,
        start,
        end,
      });

      const prevMonthlyVerification = await getVerifications({
        keyId: sub?.keyId,
        start: prevStart,
        end: prevEnd,
      });

      const validator = validatorsMap.get(validatorId);
      validator.subscriptions.push({
        ...sub,
        keyData,
        ...{
          keys: verification?.result?.verifications?.[0] || {
            time: null,
            success: 0,
            rateLimited: 0,
            usageExceeded: 0,
          },
          monthlyKeys: monthlyVerification?.result?.verifications || [],
          prevMonthlyKeys: prevMonthlyVerification?.result?.verifications || [],
          proxyService: await fetchServiceTransactions(
            validator,
            sub?.proxyServiceId
          ),
          transactions: await fetchPaymentStatusTransactions(
            paymentStatusStart,
            paymentStatusEnd,
            validator,
            sub?.consumerWalletAddress
          ),
        },
      });
    }

    return Array.from(validatorsMap.values());
  };

  const stats = await fetchKeys();

  return (
    <ConsumerPaymentDashboard
      stats={stats?.[0] || {}}
      currentSubscriptions={currentSubscriptions}
      previousSubscriptions={previousSubscriptions}
    />
  );
}
