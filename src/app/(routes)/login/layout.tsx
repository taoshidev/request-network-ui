"use client";
import NextImage from "next/image";
import {
  Box,
  Container,
  Divider,
  Flex,
  Group,
  Image,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Logo from "@/assets/logo.svg";

interface PageProps {
  children: React.ReactNode;
}

export default function Page({ children }: PageProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Flex className="h-full">
      <Box p="md" className="w-6/12" display={{ base: "none", sm: "block" }}>
        <Box
          className="bg-primary-500 h-full overflow-hidden border border-dashed border-black"
          p="xl"
        >
          <Box>
            <Group className="items-center text-white">
              <Text className="font-bold" size="xl">
                taoshi
              </Text>
              <Divider variant="dashed" orientation="vertical" />
              <Text size="sm">request network</Text>
            </Group>
          </Box>
          <Box className="mt-36 text-white">
            <Title mb="sm">Start your Journey with us.</Title>
            <Text>
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
