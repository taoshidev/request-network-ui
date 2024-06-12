import { getValidator } from "@/actions/validators";
import { ValidatorType } from "@/db/types/validator";
import { getAuthUser } from "@/actions/auth";
import { and, eq } from "drizzle-orm";
import { validators } from "@/db/schema";
import { ValidatorPaymentDashboard } from "@/components/ValidatorPaymentDashboard/ValidatorPaymentDashboard";
import { getValidators } from "@/actions/validators";
import { getUserAPIKeys, getVerifications } from "@/actions/keys";
import { getStartAndEndTimestamps } from "@/utils/date";
import { fetchSubscriptions, fetchTransactions } from "@/utils/validators";
import ClientRedirect from "@/components/ClientRedirect";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ params }: any) {
  const { id } = params;
  const validator: ValidatorType = await getValidator({ id });
  const user = await getAuthUser();

  if (!user) return <ClientRedirect href="/login" message="Session expired..."/>;

  let validatorArr = await getValidators({
    where: and(eq(validators.userId, user?.id!), eq(validators.id, id)),
    with: {
      endpoints: {
        with: {
          subnet: true,
          subscriptions: {
            with: {
              user: {
                columns: {
                  email: true,
                },
              },
            },
          },
          contract: {
            with: {
              services: true,
            },
          },
        },
      },
    },
  });

  if (validatorArr?.error) validatorArr = [];

  const { start, end, prevStart, prevEnd } = getStartAndEndTimestamps();

  const fetchVerificationsAndUsage = async (apiId: string) => {
    const res = await getUserAPIKeys({ apiId });

    const verifications = res?.result?.keys?.map(async (k) => {
      const verification = await getVerifications({
        keyId: k?.id,
      });
      return Object.assign(k, {
        usage: verification?.result?.verifications?.[0] || {
          time: null,
          success: 0,
          rateLimited: 0,
          usageExceeded: 0,
        },
      });
    });

    const monthlyVerifications = res?.result?.keys?.map(async (k) => {
      const monthlyVerification = await getVerifications({
        keyId: k?.id,
        start,
        end,
      });
      return Object.assign(k, {
        monthlyUsage: monthlyVerification?.result?.verifications || [],
      });
    });

    const prevMonthlyVerifications = res?.result?.keys?.map(async (k) => {
      const prevMonthlyVerification = await getVerifications({
        keyId: k?.id,
        start: prevStart,
        end: prevEnd,
      });
      return Object.assign(k, {
        prevMonthlyUsage: prevMonthlyVerification?.result?.verifications || [],
      });
    });

    const usage = await Promise.all(verifications!);
    const monthlyUsage = await Promise.all(monthlyVerifications!);
    const prevMonthlyUsage = await Promise.all(prevMonthlyVerifications!);

    return {
      ...res?.result,
      keys: usage,
      monthlyKeys: monthlyUsage,
      prevMonthlyKeys: prevMonthlyUsage,
    };
  };

  const promises = (validatorArr || []).map(async (v: ValidatorType) => {
    const usageData = await fetchVerificationsAndUsage(v.apiId as string);
    return { validator: { ...v, ...usageData } };
  });

  const stats = await Promise.all(promises);

  const currentTransactions = await fetchTransactions(start, end, validator);
  const previousTransactions = await fetchTransactions(
    prevStart,
    prevEnd,
    validator
  );
  const currentSubscriptions = await fetchSubscriptions(
    id,
    new Date(start).toISOString(),
    new Date(end).toISOString()
  );
  const previousSubscriptions = await fetchSubscriptions(
    id,
    new Date(prevStart).toISOString(),
    new Date(prevEnd).toISOString()
  );

  return (
    <ValidatorPaymentDashboard
      validator={validatorArr?.[0] || []}
      stats={stats!}
      currentTransactions={currentTransactions || []}
      previousTransactions={previousTransactions || []}
      currentSubscriptions={currentSubscriptions}
      previousSubscriptions={previousSubscriptions}
    />
  );
}
