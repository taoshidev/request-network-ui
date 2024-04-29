"use client";

import { Fragment } from "react";
import { Title, Box } from "@mantine/core";
import { StatTable } from "@/components/StatTable";
import { ValidatorKeyType } from "@/components/StatTable";

export function ValidatorStatTable({ data }: { data: ValidatorKeyType[] }) {
  return (
    <Box my="xl" className="mb-16">
      <Fragment key="key">
        <Title order={2}>Usage Statistics</Title>
        {(data || []).map((item: ValidatorKeyType) => (
          <StatTable
            key={item?.validator.id}
            data={item?.validator.keys as any}
            caption={item?.validator?.name}
          />
        ))}
      </Fragment>
    </Box>
  );
}
