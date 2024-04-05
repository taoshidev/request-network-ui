"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Title, Text, Box, Grid, Card } from "@mantine/core";
import { clsx } from "clsx";

import { EndpointType } from "@/app/(auth)/endpoints/types";

import { useRegistration, RegistrationData } from "@/providers/registration";

interface Subnet {
  id: string;
  label: string;
  name: string;
  endpoints: Array<EndpointType>;
}

export function Subnets({
  subnets,
  mode = "navigation",
}: {
  subnets: Subnet[];
  mode: "navigation" | "registration";
}) {
  const router = useRouter();
  const { updateData, registrationData } = useRegistration();

  const [selectedSubnets, setSelectedSubnets] = useState(
    new Set(registrationData?.subnet?.value),
  );

  const handleItemClick = (subnet: any) => {
    const newSelectedSubnets = new Set(selectedSubnets);

    if (newSelectedSubnets.has(subnet.id)) {
      newSelectedSubnets.delete(subnet.id);
    } else {
      newSelectedSubnets.add(subnet.id);
    }

    setSelectedSubnets(newSelectedSubnets);

    if (mode === "navigation") {
      router.push(`/subnets/${subnet?.id}`);
    }

    updateData?.({ subnet } as RegistrationData);
  };

  const selected = useCallback(
    (subnet: Subnet) => selectedSubnets.has(subnet.id),
    [selectedSubnets],
  );

  const disabled = useCallback(
    (subnet: Subnet) => subnet?.endpoints?.length === 0,
    [],
  );

  return (
    <Box>
      <Title className="my-12 text-center" order={2}>
        Choose a Subnet
      </Title>
      <Grid>
        {subnets?.map((subnet) => (
          <Grid.Col key={subnet.id} span={4}>
            <Card
              component="button"
              onClick={() => handleItemClick(subnet)}
              className={clsx(
                "cursor-pointer w-full h-full items-center flex",
                selected(subnet) && "bg-primary-500  text-white",
                disabled(subnet) && "pointer-events-none bg-gray-200",
              )}
            >
              <Text className="font-bold">{subnet.label}</Text>
              <Text className="text-sm mt-2">
                Validators: {subnet?.endpoints?.length}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
