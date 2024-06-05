import { useEffect, useState } from "react";
import { Box, NumberInput, TextInput, Select, Group } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { ServiceType } from "@/db/types/service";
import { getAuthUser } from "@/actions/auth";
import { UserType } from "@/db/types/user";
import { useRouter } from "next/navigation";

export function ServiceFormInput({
  form,
}: {
  form: UseFormReturnType<Partial<ServiceType>>;
}) {
  const [currencyType, setCurrencyType] = useState("");
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthUser();
      if (!user) {
        router.push("/login");
      }
      setUser(user);
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const isCryptoCurrencyType = form.getInputProps("currencyType").value;
    setCurrencyType(isCryptoCurrencyType);
    // eslint-disable-next-line
  }, [form.getInputProps("currencyType").value]);

  const currencyTypes = [
    {
      value: "FIAT",
      label: "FIAT",
      disabled: !user?.user_metadata?.stripe_enabled,
    },
    {
      value: "USDC",
      label: "USDC",
      disabled: !user?.user_metadata?.crypto_enabled,
    },
    {
      value: "USDT",
      label: "USDT",
      disabled: !user?.user_metadata?.crypto_enabled,
    },
  ];

  return (
    <>
      <Box mb="md">
        <TextInput
          label="Service Name"
          withAsterisk
          placeholder="Service Name"
          {...form.getInputProps("name")}
        />
      </Box>
      <Group mb="md" grow>
        <Box mb="md">
          <Select
            label="Currency Type"
            withAsterisk
            value={form.values.currencyType || ""}
            placeholder="Choose a currency type"
            data={currencyTypes}
            {...form.getInputProps("currencyType")}
          />
        </Box>

        <Box mb="md">
          <TextInput
            withAsterisk
            label={
              "Price in " +
              (currencyType === "USDC" || currencyType === "USDT"
                ? currencyType
                : "USD")
            }
            placeholder="5"
            {...form.getInputProps("price")}
          />
        </Box>
      </Group>

      <Group mb="md" grow>
        <Box mb="md">
          <NumberInput
            label="Request Limit"
            withAsterisk
            description="Determines the total numbers of requests."
            placeholder="10000"
            {...form.getInputProps("remaining")}
          />
        </Box>
        <Box mb="md">
          <NumberInput
            label="Limit"
            withAsterisk
            description="The total amount of burstable requests."
            placeholder="10"
            {...form.getInputProps("limit")}
          />
        </Box>
      </Group>
      <Box mb="md">
        <DateTimePicker
          label="Expiry Date"
          description="When should your keys expire?"
          withSeconds
          valueFormat="MM/DD/YYYY hh:mm:ss A"
          placeholder="Expiry Date"
          {...form.getInputProps("expires")}
        />
      </Box>

      <Group mb="md" grow>
        <Box>
          <NumberInput
            label="Refill Rate"
            withAsterisk
            description="How many tokens to refill during each interval"
            placeholder="1"
            {...form.getInputProps("refillRate")}
          />
        </Box>
        <Box>
          <NumberInput
            label="Refill Interval"
            withAsterisk
            description="Determines the speed at which tokens are refilled."
            placeholder="1000"
            {...form.getInputProps("refillInterval")}
          />
        </Box>
      </Group>
    </>
  );
}
