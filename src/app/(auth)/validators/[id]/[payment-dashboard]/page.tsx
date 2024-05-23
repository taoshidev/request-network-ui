import { getValidator } from "@/actions/validators";
import { ValidatorType } from "@/db/types/validator";
import { getAuthUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { getContracts } from "@/actions/contracts";
import { and, eq } from "drizzle-orm";
import { contracts, services, validators } from "@/db/schema";
import { getServices } from "@/actions/services";
import { ValidatorPaymentDashboard } from "@/components/ValidatorPaymentDashboard/ValidatorPaymentDashboard";
import { getValidators } from "@/actions/validators";
import { getUserAPIKeys, getVerifications } from "@/actions/keys";
import { sendToProxy } from "@/actions/apis";
import { getSubscriptions } from "@/actions/subscriptions";
import { subscriptions } from "@/db/schema";
import { getStartAndEndTimestamps } from "@/utils/date";

export default async function Page({ params }: any) {
  const { id } = params;
  const validator: ValidatorType = await getValidator({ id });
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  const userServices = await getServices({
    where: and(eq(services.userId, user.id)),
  });

  let subs = await getSubscriptions({
    where: and(eq(subscriptions.userId, user.id)),
    with: {
      endpoint: {
        with: {
          validator: true,
        },
      },
      user: true,
    },
  });

  if (subs?.error) subs = [];

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

  const { start, end } = getStartAndEndTimestamps();

  const fetchVerificationsAndUsage = async (apiId: string) => {
    const res = await getUserAPIKeys({ apiId });

    const verifications = res?.result?.keys?.map(async (k) => {
      const verification = await getVerifications({ keyId: k?.id });
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

    const usage = await Promise.all(verifications!);
    const usage2 = await Promise.all(monthlyVerifications!);

    return { ...res?.result, keys: usage, monthlyKeys: usage2 };
  };

  const promises = (validatorArr || []).map(async (v: ValidatorType) => {
    const usageData = await fetchVerificationsAndUsage(v.apiId as string);
    return { validator: { ...v, ...usageData } };
  });

  const stats = await Promise.all(promises);

  const userContracts = await getContracts({
    where: and(eq(contracts.userId, user.id)),
    with: { services: true },
  });

  const { id: validatorId, baseApiUrl: url, apiPrefix } = validator!;

  const proxyRes = await sendToProxy({
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
          value: validatorId,
        },
      ],
      with: {
        transactions: true,
      },
    },
  });

  if (proxyRes?.error) {
    console.log(proxyRes?.error);
  }
  const proxyServices = proxyRes?.data || [];

  return (
    <ValidatorPaymentDashboard
      user={user}
      validator={validatorArr?.[0] || []}
      contracts={userContracts}
      stats={stats!}
      proxyServices={proxyServices}
      // services={userServices}
    />
  );
}
