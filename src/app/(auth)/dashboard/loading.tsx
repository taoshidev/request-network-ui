import { Container, Loader, Center } from "@mantine/core";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Container my="xl">
      <Center>
        <Loader size="xl" />
      </Center>
    </Container>
  );
}
