import { getValidator } from "@/actions/validators";
import { ValidatorType } from "@/db/types/validator";
import { getAuthUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { validators } from "@/db/schema";
import { ValidatorPaymentDashboard } from "@/components/ValidatorPaymentDashboard/ValidatorPaymentDashboard";
import { getValidators } from "@/actions/validators";
import { getUserAPIKeys, getVerifications } from "@/actions/keys";
import { sendToProxy } from "@/actions/apis";
import { getStartAndEndTimestamps } from "@/utils/date";
import { fetchSubscriptions } from "@/utils/validators";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ params }: any) {
  const { id } = params;
  const validator: ValidatorType = await getValidator({ id });
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  let validatorArr = await getValidators({
    where: and(eq(validators.userId, user.id), eq(validators.id, id)),
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

  const { id: validatorId, baseApiUrl: url, apiPrefix } = validator!;

  const fetchTransactions = async (start: number, end: number) => {
    const res = await sendToProxy({
      endpoint: {
        url: validator?.baseApiUrl!,
        method: "POST",
        path: `${apiPrefix}/services/query`,
      },
      validatorId: validatorId!,
      data: {
        where: [
          {
            type: "eq",
            column: "validatorId",
            value: validatorId!,
          },
        ],
        with: {
          transactions: {
            where: [
              {
                type: "gte",
                column: "createdAt",
                value: start,
              },
              {
                type: "lte",
                column: "createdAt",
                value: end,
              },
            ],
          },
        },
      },
    });

    if (res?.error) {
      console.log(res?.error);
      return [];
    }

    const services = res?.data || [];
    const transactions = services.flatMap((service: any) =>
      service.transactions.map((t: any) => ({
        ...t,
        consumerServiceId: service.consumerServiceId,
      }))
    );

    return transactions;
  };

  const currentTransactions = await fetchTransactions(start, end);
  const previousTransactions = await fetchTransactions(prevStart, prevEnd);

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
