"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Title, Text, Box, Grid, Card } from "@mantine/core";
import styles from "./subnets.module.css";
import { EndpointType } from "@/app/(routes)/endpoints/types";
import {
  useRegistration,
  RegistrationData,
} from "@/providers/registration-provider";

interface Subnet {
  label: string;
  name: string;
  value: string;
  endpoints: Array<EndpointType>;
}

export function Subnets({
  subnets,
  mode = "navigation",
}: {
  subnets: Subnet[];
  mode: "navigation" | "registration";
}) {
  const { updateData, registrationData } = useRegistration();
  const [selectedSubnet, setSelectedSubnet] = useState<string | null>(
    registrationData?.subnet?.value || null
  );
  const router = useRouter();
  const handleItemClick = (subnet: any) => {
    setSelectedSubnet(subnet.value);
    if (mode === "navigation") {
      router.push(`/subnets/${subnet?.id}`);
    }
    updateData?.({ subnet } as RegistrationData);
  };
  return (
    <Box>
      <Title my="xl" order={2} ta="center">
        Choose A Subnet
      </Title>
      <Grid>
        {subnets?.map((subnet) => (
          <Grid.Col key={subnet.value} span={4}>
            <Card
              padding="xl"
              component="a"
              className={`${styles.card} ${
                selectedSubnet === subnet.value ? styles.selected : ""
              } ${subnet?.endpoints?.length === 0 ? styles.disabled : ""}`}
              onClick={() => handleItemClick(subnet)}
              style={
                subnet.endpoints.length === 0 ? { pointerEvents: "none" } : {}
              }
            >
              <Text ta="center" fw={700}>
                {subnet.label}
              </Text>
              <Text size="sm" ta="center" mt="sm">
                Validators: {subnet?.endpoints?.length}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
