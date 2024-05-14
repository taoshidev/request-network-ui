import { Box, NumberInput, Group } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { ValidatorType } from "@/db/types/validator";
import { UseFormReturnType } from "@mantine/form";
import { EndpointType } from "@/db/types/endpoint";

export function EndpointForm2({
  form,
  mode = "create",
}: {
  form: UseFormReturnType<Partial<ValidatorType & EndpointType>>;
  mode?: "create" | "update";
  validators?: Array<ValidatorType>;
  onError?: ({ error, reason }: { error: boolean; reason: string }) => void;
  hasSubs?: boolean;
}) {
  return (
    <>
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
      <Box mb="md">
        <NumberInput
          label="Limit"
          withAsterisk
          description="The total amount of burstable requests."
          placeholder="Limit"
          {...form.getInputProps("limit")}
        />
      </Box>
      <Group mb="md" grow>
        <Box>
          <NumberInput
            label="Refill Rate"
            withAsterisk
            description="How many tokens to refill during each refillInterval"
            placeholder="Refill Rate"
            {...form.getInputProps("refillRate")}
          />
        </Box>
        <Box>
          <NumberInput
            label="Refill Interval"
            withAsterisk
            description="Determines the speed at which tokens are refilled."
            placeholder="Refill Interval"
            {...form.getInputProps("refillInterval")}
          />
        </Box>
      </Group>
    </>
  );
}
