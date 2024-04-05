import { Box, Button, Text, Title, Group, Grid, Card } from "@mantine/core";

export function ProductInfo() {
  return (
    <Box className="mt-20">
      <Box className="mb-8">
        <Title className="text-2xl">Let&apos;s Get Started</Title>
        <Text>
          Explore the Resource Hub below to start building a winning app on
          Bittensor in no time
        </Text>
      </Box>

      <Grid>
        <Grid.Col span={4}>
          <Card className="h-full">
            <Group justify="space-between" h="100%" gap="xs">
              <Text className="text-sm font-bold mb-4">Taoshi Quickstarts</Text>

              <Text size="xs">
                Make your first request, integrate your app with Infura, and
                start building!
              </Text>

              <Button fullWidth mt="md" variant="outline">
                Get Started Now
              </Button>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card className="h-full">
            <Group justify="space-between" h="100%" gap="xs">
              <Text size="sm" fw={700} mb="sm">
                Integrate Taoshi to your application
              </Text>

              <Text size="xs">
                Use Taoshi&apos;s SDK to connect user wallets to your app.
              </Text>

              <Button fullWidth mt="md" variant="outline">
                Integrate Taoshi
              </Button>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card className="h-full">
            <Group justify="space-between" h="100%" gap="xs">
              <Text size="sm" fw={700} mb="sm">
                Taoshi Developer Center
              </Text>

              <Text size="xs">
                Discover resources to learn how you can build with battle-tested
                APIs.
              </Text>

              <Button fullWidth mt="md" variant="outline">
                Start Learning
              </Button>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
