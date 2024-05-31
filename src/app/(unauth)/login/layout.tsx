"use client";

import {
  Box,
  Container,
  Divider,
  Flex,
  Group,
  Text,
  Title,
} from "@mantine/core";

interface PageProps {
  children: React.ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <Flex className="h-full">
      <Box className="w-6/12" display={{ base: "none", sm: "block" }}>
        <Box className="bg-primary-500 h-full overflow-hidden" p="xl">
          <Box>
            <Group className="items-center text-white">
              <Text className="font-bold font-adlam-display text-3xl">
                taoshi
              </Text>
              <Divider orientation="vertical" />
              <Text size="xl">request network</Text>
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

      <Container flex="1" fluid className="bg-stone-100">
        {children}
      </Container>
    </Flex>
  );
}
