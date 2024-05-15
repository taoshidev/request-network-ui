"use client";

import { Fragment } from "react";
import { Endpoints } from "@/components/Endpoints";
import { Validators } from "@/components/Validators";
import { ValidatorStatTable } from "@/components/ValidatorStatTable";
import { Alert, Divider, Text, Box, Group, Button } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { ContractModal } from "@/components/ContractModal";
import { useDisclosure } from "@mantine/hooks";

export function ValidatorDashboard({
  user,
  validators,
  subnets,
  stats,
  contracts,
}: any) {
  const endpoints = validators?.map((v) => v.endpoints)?.flat();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Fragment>
      {contracts?.length === 0 ? (
        <Alert  className="mb-7" color="orange" icon={<IconAlertCircle />}>
          <Text className="mb-7">
            You don&apos;t have any service contracts. Add your Terms of
            Service, create your Validators to start receiving customers.
          </Text>
          <Box className="flex justify-end">
            <ContractModal opened={opened} close={close} user={user} />
          </Box>
          <Box>
            <Group className="justify-between">
              <Button onClick={open}>Add Service Contract</Button>
            </Group>
          </Box>
        </Alert>
      ) : (
        <Validators
          user={user}
          validators={validators}
          subnets={subnets}
          contracts={contracts}
        />
      )}
      {validators?.length > 0 ? (
        <>
          <Divider variant="dashed" />
          <Endpoints
            contracts={contracts}
            endpoints={endpoints}
            validators={validators}
            subnets={subnets}
          />
          <Divider variant="dashed" />
          {stats.length > 0 && <ValidatorStatTable data={stats} />}
        </>
      ) : (
        contracts?.length > 0 && (<Alert color="orange" icon={<IconAlertCircle />}>
        <Text className="mb-7">
          You don&apos;t have any Validators yet. Add your validators, attach
          endpoints, configure services and more.
        </Text>
      </Alert>)
      )}
    </Fragment>
  );
}
