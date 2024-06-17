"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Text, Box, Grid, Card } from "@mantine/core";
import { clsx } from "clsx";
import { useRegistration, RegistrationData } from "@/providers/registration";
import { SubnetType } from "@/db/types/subnet";

export function Subnets({
  subnets,
  mode = "navigation",
  setDirection,
}: {
  subnets: SubnetType[];
  mode?: "navigation" | "registration";
  setDirection?: (direction: "left" | "right") => void;
}) {
  const router = useRouter();
  const { updateData, registrationData } = useRegistration();

  const [selectedSubnet, setSelectedSubnet] = useState<string | null>(
    registrationData?.subnet?.id || null
  );

  useEffect(() => {
    if (setDirection) {
      setDirection(registrationData.direction);
    }
  }, [registrationData, setDirection]);

  const handleItemClick = (subnet: any) => {
    if (selectedSubnet === subnet.id) {
      setSelectedSubnet(null);
      updateData?.({ subnet: null } as RegistrationData);
    } else {
      setSelectedSubnet(subnet.id);
      updateData?.({ subnet } as RegistrationData);
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
    <Box className={clsx("my-8 slide", registrationData.direction)}>
      <Grid>
        {(subnets || [])?.map((subnet) => (
          <Grid.Col key={subnet.id} span={4}>
            <Card
              withBorder
              shadow="sm"
              padding="lg"
              component="button"
              radius={3}
              onClick={() => handleItemClick(subnet)}
              className={clsx(
                "cursor-pointer w-full h-full items-center flex rn-select",
                selected(subnet) && "bg-primary-500 text-white rn-selected",
                disabled(subnet) && "pointer-events-none bg-[#f1f1f1]"
              )}
            >
              <Text className="font-bold">{subnet.label}</Text>
              <Text className="text-sm mt-2">
                Validators:
                {new Set(subnet?.endpoints?.map((e) => e.validator.id)).size}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}