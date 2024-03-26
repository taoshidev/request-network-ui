"use client";

import { useEffect, useState, useRef } from "react";
import {
  Title,
  Text,
  Box,
  Grid,
  Card,
  Group,
  Badge,
  Button,
  Table,
  TextInput,
  Input,
} from "@mantine/core";

import styles from "./subnet-validator-review.module.css";
import {
  useRegistration,
  RegistrationData,
} from "@/providers/registration-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconKey, IconCheck } from "@tabler/icons-react";

const keySchema = z.object({
  keyName: z.string().min(3, { message: "Name must be at least 3 characters" }),
});

type Key = z.infer<typeof keySchema>;

export function SubnetValidatorReview() {
  const { updateData, registrationData } = useRegistration();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Key>({
    resolver: zodResolver(keySchema),
  });
  const onSubmit = (values) => {
    updateData({ keyName: values.keyName } as RegistrationData);
    console.log("registration data after", registrationData);

  };

  return (
    <Box>
      <Title my="xl" order={2} ta="center">
        Review Selection
      </Title>
      <Table mt={40}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Validator</Table.Th>
            <Table.Th>Subnet</Table.Th>
            <Table.Th>Verified</Table.Th>
            <Table.Th>Vtrust</Table.Th>
            <Table.Th>Latency</Table.Th>
            <Table.Th>Uptime</Table.Th>
            <Table.Th>Limit</Table.Th>
            <Table.Th>Refill Interval</Table.Th>
            <Table.Th>Refill Rate</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {registrationData?.validator && (
            <Table.Tr key={registrationData?.validator.id}>
              <Table.Td>{registrationData?.validator.name}</Table.Td>
              <Table.Td>{registrationData?.subnet.label}</Table.Td>
              <Table.Td>
                {registrationData?.validator.verified ? (
                  <Badge radius={0} color="orange">
                    Verified
                  </Badge>
                ) : (
                  <Badge radius={0} color="black">
                    Unverified
                  </Badge>
                )}
              </Table.Td>
              <Table.Td>
                {registrationData?.validator.vtrust || "HIGH"}
              </Table.Td>
              <Table.Td>0.8 ms</Table.Td>
              <Table.Td>90%</Table.Td>
              <Table.Td>
                {registrationData?.subnet?.endpoints?.[0].limit}
              </Table.Td>
              <Table.Td>
                {registrationData?.subnet?.endpoints?.[0].refillInterval}
              </Table.Td>
              <Table.Td>
                {registrationData?.subnet?.endpoints?.[0].refillRate}
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
