"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Title, Text, Box, Grid, Card } from "@mantine/core";
import { clsx } from "clsx";
import { useRegistration, RegistrationData } from "@/providers/registration";
import { SubnetType } from "@/db/types/subnet";

export function Subnets({
  subnets,
  mode = "navigation",
}: {
  subnets: SubnetType[];
  mode: "navigation" | "registration";
}) {
  const router = useRouter();
  const { updateData, registrationData } = useRegistration();

  const [selectedSubnet, setSelectedSubnet] = useState<string | null>(
    registrationData?.subnet?.id || null
  );

  const handleItemClick = (subnet: any) => {
    if (selectedSubnet === subnet.id) {
      setSelectedSubnet(null);
      updateData?.({ subnet: null } as RegistrationData);
    } else {
      setSelectedSubnet(subnet.id);
      updateData?.({ subnet, validator: null } as RegistrationData);
    }

    if (mode === "navigation") {
      router.push(`/subnets/${subnet?.id}`);
    }
  };

  const selected = useCallback(
    (subnet: SubnetType) => selectedSubnet === subnet.id,
    [selectedSubnet]
  );

  const disabled = useCallback(
    (subnet: SubnetType) => subnet?.endpoints?.length === 0,
    []
  );

  return (
    <Box>
      <Title className="my-7 text-center" order={2}>
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
                disabled(subnet) && "pointer-events-none bg-gray-200"
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
