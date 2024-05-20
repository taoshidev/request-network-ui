"use client";

import { Fragment } from "react";
import { Endpoints } from "@/components/Endpoints";
import { Validators } from "@/components/Validators";
import { ValidatorStatTable } from "@/components/ValidatorStatTable";
import { Alert, Divider, Text, Box, Group, Button, Card } from "@mantine/core";
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
        <Alert
          className="mb-7 shadow-sm"
          color="orange"
          icon={<IconAlertCircle />}
        >
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
        <Card className="shadow-sm">
          <Validators
            user={user}
            validators={validators}
            subnets={subnets}
            contracts={contracts}
          />
        </Card>
      )}
      {validators?.length > 0 ? (
        <>
          <Card className="shadow-sm mt-7">
            <Endpoints
              contracts={contracts}
              endpoints={endpoints}
              validators={validators}
              subnets={subnets}
            />
          </Card>

          {stats.length > 0 && (
            <Card className="shadow-sm mt-7">
              <ValidatorStatTable data={stats} />
            </Card>
          )}
        </>
      ) : (
        contracts?.length > 0 && (
          <Alert
            className="shadow-sm"
            color="orange"
            icon={<IconAlertCircle />}
          >
            <Text className="mb-7">
              You don&apos;t have any Validators yet. Add your validators,
              attach endpoints, configure services and more.
            </Text>
          </Alert>
        )
      )}
    </Fragment>
  );
}
