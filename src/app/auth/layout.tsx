"use client";
import NextImage from "next/image";
import {
  Divider,
  Flex,
  Title,
  Text,
  Box,
  Container,
  Group,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Logo from "@/assets/logo.svg";

interface PageProps {
  children: React.ReactNode;
}

export default function Page({ children }: PageProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Flex h="100%">
      <Box p="md" w="600px" display={{ base: "none", sm: "block" }}>
        <Box
          bg="orange"
          p="xl"
          h="100%"
          style={{ border: "1px dashed black", overflow: "hidden" }}
        >
          <Box>
            <Group align="center">
              <Text size="xl" fw={700} c="white">
                taoshi
              </Text>
              <Divider variant="dashed" orientation="vertical" />
              <Text size="sm" c="white">
                request network
              </Text>
            </Group>
          </Box>
          <Box mt="150px">
            <Title c="white">Start your Journey with us.</Title>
            <Text c="white">
              Are you a subnet validator looking to earn? Or are you a retail
              user looking for access to subnet data? Either way, utilize
              Taoshi&apos;s Request Network to access the power of decentralized
              artificial intelligence.
            </Text>
          </Box>
        </Box>
      </Box>

      <Container flex="1" fluid>
        {children}
      </Container>
    </Flex>
  );
}
