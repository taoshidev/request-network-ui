import { Fragment } from "react";
import { Title, Box } from "@mantine/core";
import { StatTable } from "@/components/StatTable";
import { ValidatorKeyType } from "@/components/StatTable";

export function ValidatorStatTable({ data }: { data: ValidatorKeyType[] }) {

  const renderStatTables = () => {
    return data.map((item: ValidatorKeyType) => {
      if (Array.isArray(item.validator.keys)) {
        return (
          <StatTable
            key={item?.validator?.id}
            data={item?.validator?.keys as any}
            caption={item?.validator?.name as string}
          />
        );
      } else {
        return null;
      }
    });
  };

  const hasDataWithKeys =
    data &&
    data.some(
      (item) =>
        Array.isArray(item.validator.keys) && item.validator.keys.length > 0
    );

  return (
    <Fragment>
      {hasDataWithKeys && (
        <Box my="xl" className="mb-16">
          {data?.length > 0 && (
            <Fragment key="key">
              <Title order={2}>Usage Statistics</Title>
              {renderStatTables()}
            </Fragment>
          )}
        </Box>
      )}
    </Fragment>
  );
}
