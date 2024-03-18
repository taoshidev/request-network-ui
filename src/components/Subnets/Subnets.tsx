"use client";

import { Title, Text, Box, Grid, Card } from "@mantine/core";

import styles from "./subnets.module.css";

interface Subnet {
  label: string;
  name: string;
  value: string;
}

interface SubnetProps {
  subnets: Subnet[];
}

export function Subnets({ subnets }: SubnetProps) {
  console.log(subnets);
  return (
    <Box>
      <Title my="xl" order={2}>
        Choose A Subnet
      </Title>
      <Grid>
        {subnets.map((subnet) => (
          <Grid.Col key={subnet.value} span={4}>
            <Card padding="xl" component="a" className={styles.card}>
              <Text ta="center" fw={700}>
                {subnet.label}
              </Text>
              <Text size="sm" ta="center" mt="sm">
                Validators: {subnet.validators.length}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
