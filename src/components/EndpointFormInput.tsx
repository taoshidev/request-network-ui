import { Box, NumberInput, TextInput, Select, Group } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { UseFormReturnType } from "@mantine/form";
import { EndpointType } from "@/db/types/endpoint";

export function EndpointFormInput({
  form,
  validators,
  subnets,
}: {
  form: UseFormReturnType<Partial<ValidatorType & EndpointType>>;
  subnets: Array<SubnetType>;
  validators?: Array<ValidatorType>;
}) {
  const verifiedValidators = validators
    ? (validators || [])
        .filter((v) => v.verified)
        .map((v) => ({
          value: v.id as string,
          label: v?.account?.meta?.name || "Unknown",
        }))
    : [];

  const availableSubnets = subnets.map((s) => ({
    value: s.id,
    label: s.label,
  }));

  return (
    <>
      <Box mb="md">
        <TextInput
          withAsterisk
          label="URL"
          placeholder="URL"
          {...form.getInputProps("url")}
        />
      </Box>
      {validators && (
        <Box mb="md">
          <Select
            withAsterisk
            label="Which Validator"
            placeholder="Pick value or enter anything"
            data={verifiedValidators}
            {...form.getInputProps("validator")}
          />
        </Box>
      )}
      <Box mb="md">
        <Select
          label="Which Subnet"
          withAsterisk
          placeholder="Pick value or enter anything"
          data={availableSubnets}
          {...form.getInputProps("subnet")}
        />
      </Box>
      <Box mb="md">
        <DateTimePicker
          label="Expiry Date"
          description="When should your keys expire?"
          withSeconds
          placeholder="Pick date"
          {...form.getInputProps("expires")}
        />
      </Box>
      <Box mb="md">
        <NumberInput
          label="Limit"
          withAsterisk
          description="The total amount of burstable requests."
          placeholder="Input placeholder"
          {...form.getInputProps("limit")}
        />
      </Box>
      <Group mb="md" grow>
        <Box>
          <NumberInput
            label="Refill Rate"
            withAsterisk
            description="How many tokens to refill during each refillInterval"
            placeholder="Input placeholder"
            {...form.getInputProps("refillRate")}
          />
        </Box>
        <Box>
          <NumberInput
            label="Refill Interval"
            withAsterisk
            description="Determines the speed at which tokens are refilled."
            placeholder="Input placeholder"
            {...form.getInputProps("refillInterval")}
          />
        </Box>
      </Group>
    </>
  );
}
