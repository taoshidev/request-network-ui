"use client";

import { Fragment } from "react";
import { Endpoints } from "@/components/Endpoints";
import { Validators } from "@/components/Validators";
import { ValidatorStatTable } from "@/components/ValidatorStatTable";
import { Alert, Text, Box, Group, Button, Card } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { ContractModal } from "@/components/ContractModal";
import { useDisclosure } from "@mantine/hooks";
import withAuthGuard from "@/guard/auth-guard";

const ValidatorDashboard = ({
  user,
  validators,
  subnets,
  stats,
  contracts,
}: any) => {
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

          {stats &&
          stats.some(
            (item) =>
              Array.isArray(item.validator.keys) &&
              item.validator.keys.length > 0
          ) ? (
            <Card className="shadow-sm mt-7">
              <ValidatorStatTable data={stats} />
            </Card>
          ) : (
            <Alert
              className="shadow-sm mt-7"
              color="orange"
              icon={<IconAlertCircle />}
            >
              <Text className="mb-7">
                You don&apos;t have any customer yet. Verify your validator,
                enable your endpoints to allow customers registration.
              </Text>
            </Alert>
          )}
        </>
      ) : (
        contracts?.length > 0 && (
          <Alert
            className="shadow-sm mt-7"
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
};

export default withAuthGuard(ValidatorDashboard);
